/*

*/
const dotenv = require('dotenv').config()

const login = {
    host: process.env.FTP_HOST,
    user: process.env.FTP_USER,
    password: process.env.FTP_PASSWORD
}

const info = {
    github_chart_url: process.env.GITHUB_CHART_URL,
    resume_name: process.env.RESUME_NAME,
    linkedin_profile: process.env.LINKEDIN_PROFILE
}

module.exports.login = login
module.exports.info = info
