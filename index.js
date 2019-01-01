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

    if (response.statusCode !== 200) throw new Error('Request failed. Status code: ' + response.statusCode)

    // -->> extract svg content from web source ----------------
    var docSVG = dom.parseFromString(body)
    var svgString = xpath.select("(//svg[@class='js-calendar-graph-svg'])[1]", docSVG)[0].toString()

    if (!svgString) throw new Error('SVG element not found.')

    // -->> use stream buffer and upload stream as pdf file ------------
    var doc = new Pdfkit()
    var wStream = new streamBuffers.WritableStreamBuffer()

    wStream.on('finish', () => {
        const rStream = new streamBuffers.ReadableStreamBuffer()
        rStream.put(wStream.getContents())
        rStream.stop()

        const client = new ftp.Client()
        client.ftp.verbose = true
        client.access({
            // FTP server login info
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

    // -->> PDF content -----------------------------------------
    doc.pipe(wStream)

    // ** Profile Name
    doc.font(style.person.font)
        .fontSize(style.person.fontsize)
        .text(linkedin.person.firstname + ' ' + linkedin.person.lastname, style.person.x, style.person.y, style.person.option)

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
    doc.font(style.jobTitle.font)
        .fontSize(style.jobTitle.fontsize)
        .fillColor('black')
        .text(linkedin.job.title + '  |  ' + linkedin.job.employer, style.jobTitle.x, style.jobTitle.y)

    // ** job time
    doc.font(style.jobTime.font)
        .fontSize(style.jobTime.fontsize)
        .text(linkedin.job.month + ' ' + linkedin.job.year + ' to Present ', style.jobTime.x, style.jobTime.y)

    // ** job summary
    // doc.text(linkedin.job.summary)
    doc.font(style.jobSummary.font)
        .fontSize(style.jobSummary.fontsize)
        .text(linkedin.job.summary, style.jobSummary.x, style.jobSummary.y, style.jobSummary.option)

    // ** Github chart title
    var githubName = 'GitHub'
    doc.font(style.githubTitle.font)
        .fontSize(style.githubTitle.fontsize)
        .text(githubName, style.githubTitle.x, style.githubTitle.y, style.githubTitle.option)

    // **  Github contribution chart
    SVGtoPDF(doc, svgString, style.github.x, style.github.y)

    doc.end()
})
