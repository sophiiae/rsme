const request = require('request')
const DomParser = require('xmldom').DOMParser
const xpath = require('xpath')
const dom = new DomParser()
const innertext = require('innertext')
const conf = require('./conf')

const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"
];
const char_per_line = 90

request(conf.info.linkedin_profile, function(error, response, body){
    if (error) throw error

    if (response.statusCode !== 200) throw ('Request failed. Status code: ' + response.statusCode)

    linkedin = body;
    // console.log(body);

    //-->> extract linkedin profile information ----------------
    var doc_linkedin = dom.parseFromString(linkedin)

    var first_name = innertext(xpath.select("//first-name", doc_linkedin).toString())
    var last_name = innertext(xpath.select("//last-name", doc_linkedin).toString())
    var head_line = innertext(xpath.select("//headline", doc_linkedin).toString())

    var summary = xpath.select(("(//summary)"), doc_linkedin)
    var intro = summary[0].toString()
    intro = innertext(intro.replace(/\s/g, ' '))
    var intro_chars = intro.length
    var intro_lines = Math.ceil(intro_chars / char_per_line)

    var program = innertext(xpath.select("(//industry)[1]", doc_linkedin)[0].toString())
    var profile_url = innertext(xpath.select("//public-profile-url", doc_linkedin).toString())

    var position = xpath.select("//position", doc_linkedin)

    // Only extracts work information if job is listed in LinkedIn profile with present state
    if (position) {
        module.exports.position = 1
        var title = innertext(xpath.select("//title", doc_linkedin).toString())
        var job_summary = innertext(summary[1].toString())
        var job_year = innertext(xpath.select("//year", doc_linkedin).toString())
        var job_month = innertext(xpath.select("//month", doc_linkedin).toString())
        var company_name = innertext(xpath.select("//company/name", doc_linkedin).toString())

        var job_summary_lines = job_summary.match(/^/mg).length
        var job_summary_chars = job_summary_lines.length
        if (job_summary_chars / job_summary_lines > char_per_line) {
            let extra = Math.ceil(job_summary_chars / job_summary_lines)
            var extra_lines = Math.ceil(extra / char_per_line) + 1
        }

        module.exports.job = {
            title: title,
            summary: job_summary,
            summary_lines: job_summary_lines,
            extra_lines: extra_lines,
            year: job_year,
            month: monthNames[job_month - 1],
            employer: company_name
        }
    }

    //-->> export variables ---------------------------------
    module.exports.person = {
        firstname: first_name,
        lastname: last_name,
        headline: head_line,
        intro: intro,
        intro_lines: intro_lines,
        program: program,
        profileurl: profile_url
    }
})