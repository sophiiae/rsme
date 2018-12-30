/*
Step:
0. Find library that can make HTTP request
1. Given url, save as string in memory
1.1 Find a library that can parse HTML into DOM(domain object model)
2. From the DOM, extract svg 
3. Convert svg into png file
*/

const request = require("request");
const domParser = require("xmldom").DOMParser;
const xpath = require("xpath");
const dom = new domParser();
const pdfkit = require("pdfkit");
const SVGtoPDF = require('svg-to-pdfkit');
const ftp = require("basic-ftp");
const streamBuffers = require("stream-buffers");

request("https://github.com/users/sophiiae/contributions", function(error,response, body) {
    if (error) throw error;

    if (response.statusCode !== 200) throw ("Request failed. Status code: " + response.statusCode);

    var doc = dom.parseFromString(body);
    var svgNode = xpath.select("(//svg[@class='js-calendar-graph-svg'])[1]",doc)[0];

    if (!svgNode) throw 'SVG element not found.';

    var svgString = svgNode.toString();
    // console.log(svgString);

    var doc = new pdfkit();

    var wStream = new streamBuffers.WritableStreamBuffer();
    wStream.on('finish', () => {
        const rStream = new streamBuffers.ReadableStreamBuffer();
        rStream.put(wStream.getContents());
        rStream.stop();

        const client = new ftp.Client();
        client.ftp.verbose = true;
        client.access({
            host: "zhengstud.io",
            user: "resume@zhengstud.io",
            password: "uiop2019",
            secure: false
        }).then(() => {
            client
                .upload(rStream, 'latest.pdf')
                .then(()=> {
                    client.close();
                });
        }).catch((err) => {
            console.log(err)
            client.close();
        });    
    });

    doc.pipe(wStream);
    doc.fontSize(15).text("Hello, world!", 50, 50);
    doc.text("lalalala", { width: 410, align: "left" });

    var opt = {width: 669, height: 104};
    SVGtoPDF(doc, svgString, 50, 200, opt);
    doc.end();
    
});

/*
1. Learn about Linkedin profile API
2. Upload png as profile background image using profile API
*/
