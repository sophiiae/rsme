const request = require('request')
const DomParser = require('xmldom').DOMParser
const xpath = require('xpath')
const dom = new DomParser()
const innertext = require('innertext')
const conf = require('./conf')

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
]
const charPerLine = 90

request(conf.info.linkedin_profile, function (error, response, body) {
    if (error) throw error

    if (response.statusCode !== 200) throw new Error('Request failed. Status code: ' + response.statusCode)

    var linkedin = body
    // console.log(body);

    // -->> extract linkedin profile information ----------------
    var docLinkedin = dom.parseFromString(linkedin)

    var firstName = innertext(xpath.select('//first-name', docLinkedin).toString())
    var lastName = innertext(xpath.select('//last-name', docLinkedin).toString())
    var headLine = innertext(xpath.select('//headline', docLinkedin).toString())

    var summary = xpath.select(('(//summary)'), docLinkedin)
    var intro = summary[0].toString()
    intro = innertext(intro.replace(/\s/g, ' '))
    var introChars = intro.length
    var introLines = Math.ceil(introChars / charPerLine)

    var program = innertext(xpath.select('(//industry)[1]', docLinkedin)[0].toString())
    var profileURL = innertext(xpath.select('//public-profile-url', docLinkedin).toString())

    var position = xpath.select('//position', docLinkedin)

    // Only extracts work information if job is listed in LinkedIn profile with present state
    if (position) {
        module.exports.position = 1
        var title = innertext(xpath.select('//title', docLinkedin).toString())
        var jobSummary = innertext(summary[1].toString())
        var jobYear = innertext(xpath.select('//year', docLinkedin).toString())
        var jobMonth = innertext(xpath.select('//month', docLinkedin).toString())
        var companyName = innertext(xpath.select('//company/name', docLinkedin).toString())

        var jobSummaryLines = jobSummary.match(/^/mg).length
        var jobSummaryChars = jobSummaryLines.length
        if (jobSummaryChars / jobSummaryLines > charPerLine) {
            let extra = Math.ceil(jobSummaryChars / jobSummaryLines)
            var extraLines = Math.ceil(extra / charPerLine) + 1
        }

        module.exports.job = {
            title: title,
            summary: jobSummary,
            summary_lines: jobSummaryLines,
            extraLines: extraLines,
            year: jobYear,
            month: monthNames[jobMonth - 1],
            employer: companyName
        }
    }

    // -->> export variables ---------------------------------
    module.exports.person = {
        firstname: firstName,
        lastname: lastName,
        headline: headLine,
        intro: intro,
        introLines: introLines,
        program: program,
        profileurl: profileURL
    }
})
