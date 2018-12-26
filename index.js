/*
Step:
0. Find library that can make HTTP request
1. Given url, save as string in memory
1.1 Find a library that can parse HTML into DOM(domain object model)
2. From the DOM, extract svg 
3. Convert svg into png file
*/

const request = require('request');

const domParser = require('xmldom').DOMParser;
const xpath = require('xpath');
const dom = new domParser();

request('https://github.com/users/sophiiae/contributions', function (error, response, body) {

    var doc = dom.parseFromString(body);
    var svgNode = xpath.select("(//svg[@class='js-calendar-graph-svg'])[1]", doc);
    console.log(svgNode[0].toString());
    var svg = svgNode[0];

});





/*
1. Learn about Linkedin profile API
2. Upload png as profile background image using profile API
*/

	
