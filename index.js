/*
Step:
0. Find library that can make HTTP request
1. Given url, save as string in memory
1.1 Find a library that can parse HTML into DOM(domain object model)
2. From the DOM, extract svg
3. Convert svg into png file
*/

const request = require('request')
const DomParser = require('xmldom').DOMParser
const xpath = require('xpath')
const dom = new DomParser()
const Pdfkit = require('pdfkit')
const SVGtoPDF = require('svg-to-pdfkit')
const ftp = require('basic-ftp')
const streamBuffers = require('stream-buffers')
const conf = require('./conf/conf')
const dotenv = require('dotenv')

dotenv.config()

request(conf.data.github_chart_url, function (error, response, body) {
    if (error) throw error

    if (response.statusCode !== 200) throw ('Request failed. Status code: ' + response.statusCode)

    // extract svg content from web source
    var doc = dom.parseFromString(body)
    var svgNode = xpath.select("(//svg[@class='js-calendar-graph-svg'])[1]", doc)[0]

    if (!svgNode) throw 'SVG element not found.'

    var svgString = svgNode.toString()
    // console.log(svgString);

    var doc = new Pdfkit()

    //use stream buffer and upload stream as pdf file
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
                .upload(rStream, conf.data.resume_name)
                .then(() => {
                    client.close()
                })
        }).catch((err) => {
            console.log(err)
            client.close()
        })
    })

    doc.pipe(wStream);
    doc.fontSize(15).text('Hello, world!', 50, 50)
    doc.text('lalalala', { width: 410, align: 'left' })

    var opt = {width: 669, height: 104}
    SVGtoPDF(doc, svgString, 50, 250, opt)
    doc.end() 
})

/*
1. Learn about Linkedin profile API
2. Upload png as profile background image using profile API
*/
