const lato = 'fonts/Lato/'
const opensans = 'fonts/Open_Sans/'
const fonts = {
    bold: lato + 'Lato-Bold.ttf',
    bold_italic: lato + 'Lato-BoldItalic.ttf',
    regular: opensans + 'OpenSans-Regular.ttf',
    light: opensans + 'OpenSans-Light.ttf',
    black: lato + 'Lato-Black.ttf'
}
const marginLeft = 50
const marginTop = 50

var person = {
    font: fonts.bold,
    fontsize: 30,
    x: marginLeft,
    y: marginTop,
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
        align: 'left'
    }
}

module.exports.line = {
    startx: marginLeft,
    starty: links.y + 18,
    endx: 540,
    endy: links.y + 18
}

var program = {
    font: fonts.bold_italic,
    fontsize: 14,
    x: marginLeft,
    y: links.y + 24,
    option: {
        stroke: true,
        fill: true
    }
}

var summary = {
    font: fonts.regular,
    fontsize: 12,
    x: marginLeft,
    y: program.y + 24,
    option: {
        width: 500,
        align: 'left'
    }
}

var experience = {
    font: fonts.bold,
    fontsize: 14,
    x: marginLeft,
    y: summary.y + 50
}

var jobTitle = {
    font: fonts.bold,
    fontsize: 12,
    x: marginLeft,
    y: experience.y + 18
}

var jobTime = {
    font: fonts.light,
    fontsize: 10,
    x: marginLeft,
    y: jobTitle.y + 16
}

var jobSummary = {
    font: fonts.regular,
    fontsize: 12,
    x: marginLeft,
    y: jobTime.y + 16,
    option: {
        width: 500,
        align: 'left'
    }
}

var githubTitle = {
    font: fonts.black,
    fontsize: 13,
    x: marginLeft,
    y: jobSummary.y + 100,
    option: {
        width: 500,
        align: 'center',
        underline: true
    }
}
var github = {
    x: marginLeft,
    y: githubTitle.y + 24,
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
module.exports.jobTitle = jobTitle
module.exports.jobTime = jobTime
module.exports.jobSummary = jobSummary
module.exports.github = github
module.exports.githubTitle = githubTitle
