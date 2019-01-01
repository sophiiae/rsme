const request = require('request')
const DomParser = require('xmldom').DOMParser
const xpath = require('xpath')
const dom = new DomParser()
const Pdfkit = require('pdfkit')
const SVGtoPDF = require('svg-to-pdfkit')
const ftp = require('basic-ftp')
const streamBuffers = require('stream-buffers')
const dotenv = require('dotenv')
const conf = require('./conf/conf')
const linkedin = require('./conf/linkedin')
const style = require('./style')

dotenv.config()

request(conf.info.github_chart_url, function (error, response, body) {
    if (error) throw error

    if (response.statusCode !== 200) throw ('Request failed. Status code: ' + response.statusCode)

    //-->> extract svg content from web source ----------------
    var doc_svg = dom.parseFromString(body)
    var svgString = xpath.select("(//svg[@class='js-calendar-graph-svg'])[1]", doc_svg)[0].toString()

    if (!svgString) throw 'SVG element not found.'

    //-->> use stream buffer and upload stream as pdf file ------------
    var doc = new Pdfkit()
    var wStream = new streamBuffers.WritableStreamBuffer()

    wStream.on('finish', () => {
        const rStream = new streamBuffers.ReadableStreamBuffer()
        rStream.put(wStream.getContents())
        rStream.stop()

        const client = new ftp.Client()
        client.ftp.verbose = true
        client.access({
            //FTP server login info
            host: conf.login.host,
            user: conf.login.user,
            password: conf.login.password,
            secure: false
        }).then(() => {
            client
                .upload(rStream, conf.info.resume_name)
                .then(() => {
                    client.close()
                })
        }).catch((err) => {
            console.log(err)
            client.close()
        })
    })

    //-->> PDF content -----------------------------------------
    doc.pipe(wStream);

    // ** Profile Name
    doc.font(style.person.font)
        .fontSize(style.person.fontsize)
        .text(linkedin.person.firstname + ' ' + linkedin.person.lastname, style.person.x, style.person.y,style.person.option)

    // ** linkedin url link
    doc.font(style.links_url.font)
        .fontSize(style.links_url.fontsize)
        .fillColor('blue')
        .text('LinkedIn', style.links_url.x, style.links_url.y, {
            align: 'left',
            link: 'http://www.linkedin.com/in/feifeizheng'
        })

    // ** line
    doc.moveTo(style.line.startx, style.line.starty)
        .lineTo(style.line.endx, style.line.endy)
        .stroke()

    // ** industry / program
    doc.font(style.program.font)
        .fontSize(style.program.fontsize)
        .fillColor('black')
        .text(linkedin.person.program + ' —— ' + linkedin.person.headline, style.program.x, style.program.y, style.program.option)
    
    // ** person summary
    doc.font(style.intro.font)
        .fontSize(style.intro.fontsize)
        .text(linkedin.person.intro, style.intro.x, style.intro.y, style.intro.option)
    
    // ** job
    doc.font(style.experience.font)
        .fontSize(style.experience.fontsize)
        .fillColor('gray')
        .text('CURRENT JOB', style.experience.x, style.experience.y)

    // ** job title and employer
    doc.font(style.job_title.font)
        .fontSize(style.job_title.fontsize)
        .fillColor('black')
        .text(linkedin.job.title + '  |  ' + linkedin.job.employer, style.job_title.x, style.job_title.y)

    // ** job time 
    doc.font(style.job_time.font)
        .fontSize(style.job_time.fontsize)
        .text(linkedin.job.month + ' ' + linkedin.job.year + ' to Present ', style.job_time.x, style.job_time.y)

    // ** job summary 
    // doc.text(linkedin.job.summary)
    doc.font(style.job_summary.font)
        .fontSize(style.job_summary.fontsize)
        .text(linkedin.job.summary, style.job_summary.x, style.job_summary.y, style.job_summary.option)

    // ** Github chart title
    var github_name = 'GitHub'
    doc.font(style.github_title.font)
        .fontSize(style.github_title.fontsize)
        .text(github_name, style.github_title.x, style.github_title.y, style.github_title.option)

    // **  Github contribution chart
    SVGtoPDF(doc, svgString, style.github.x, style.github.y)

    doc.end() 
})
