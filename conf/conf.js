/*

*/

const dotenv = require('dotenv').config()

const login = {
    // host: 'zhengstud.io', 
    // user: 'resume@zhengstud.io',
    // password: 'myresume2019'
    host: process.env.FTP_HOST,
    user: process.env.FTP_USER,
    password: process.env.FTP_PASSWORD
}

const data = {
    github_chart_url: process.env.GITHUB_CHART_URL,
    resume_name: process.env.RESUME_NAME
}


module.exports.login = login; 
module.exports.data = data;