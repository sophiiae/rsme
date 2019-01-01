const lato = 'fonts/Lato/'
const opensans = 'fonts/Open_Sans/'
const fonts = {
    bold: lato + 'Lato-Bold.ttf',
    bold_italic: lato + 'Lato-BoldItalic.ttf',
    regular: opensans + 'OpenSans-Regular.ttf',
    light: opensans + 'OpenSans-Light.ttf',
    black: lato + 'Lato-Black.ttf'
}
const margin_left = 50
const margin_top = 50

var person = {
    font: fonts.bold,
    fontsize: 30,
    x: margin_left, 
    y: margin_top, 
    option: {
        stroke: true, 
        fill: true
    }
}

var links = {
    font: fonts.regular,
    fontsize: 10, 
    x: 50, 
    y: person.y + 40,
    option: {
        align: 'left',
    }
}

module.exports.line = {
    startx: margin_left, 
    starty: links.y + 18,
    endx: 540,
    endy: links.y + 18
}

var program = {
    font: fonts.bold_italic,
    fontsize: 14,
    x: margin_left,
    y: links.y + 24,
    option: {
        stroke: true, 
        fill: true,
    }
}

var summary = {
    font: fonts.regular,
    fontsize: 12, 
    x: margin_left,
    y: program.y + 24,
    option: {
        width: 500, 
        align: 'left'
    }
}

var experience = {
    font: fonts.bold,
    fontsize: 14,
    x: margin_left, 
    y: summary.y + 50,
}

var job_title = {
    font: fonts.bold,
    fontsize: 12,
    x: margin_left,
    y: experience.y + 18, 
}

var job_time = {
    font: fonts.light,
    fontsize: 10,
    x: margin_left,
    y: job_title.y + 16, 
}

var job_summary = {
    font: fonts.regular,
    fontsize: 12,
    x: margin_left,
    y: job_time.y + 16, 
    option: {
        width: 500,
        align: 'left'
    }
}

var github_title = {
    font: fonts.black, 
    fontsize: 13,
    x: margin_left, 
    y: job_summary.y + 100,
    option: {
        width: 500,
        align: 'center',
        underline: true
    }
}
var github = {
    x: margin_left, 
    y: github_title.y + 24,
    option: {
        width: 669, 
        height: 110,
        align: 'center'
    }
}

module.exports.person = person
module.exports.links_url = links
module.exports.program = program
module.exports.intro = summary
module.exports.experience = experience
module.exports.job_title = job_title
module.exports.job_time = job_time
module.exports.job_summary = job_summary
module.exports.github = github
module.exports.github_title = github_title