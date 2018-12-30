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
const d3 = require("d3");
const sharp = require("sharp");
const fs = require("fs");
// const https = require('https');
const pdfkit = require("pdfkit");
const SVGtoPDF = require('svg-to-pdfkit');

request("https://github.com/users/sophiiae/contributions", function(
    error,
    response,
    body
    ) {
    var doc = dom.parseFromString(body);
    var svgNode = xpath.select("(//svg[@class='js-calendar-graph-svg'])[1]",doc)[0];
    var svgString = svgNode.toString();
    // console.log(svgString);

    sharp(Buffer.from(svgString))
        .resize(1280, null, { fit: "inside" })
        .flatten({ background: "#ffffff" })
        .toFile("output.png");

    var doc = new pdfkit();

    doc.pipe(fs.createWriteStream("output.pdf"));
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
