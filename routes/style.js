const marginLeft = 50
const marginTop = 50

var person = {
  fontsize: 30,
  x: marginLeft,
  y: marginTop,
  option: {
      stroke: true,
      fill: true
  }
}

var line = {
  startx: marginLeft,
  starty: person.y + 53,
  endx: 540,
  endy: person.y + 55,
}

var headline = {
  fontsize: 14,
  x: marginLeft,
  y: person.y + 34,
}

var githubTitle = {
  fontsize: 13,
  x: marginLeft,
  y: headline.y + 100,
  option: {
      width: 500,
      align: 'center',
      underline: true
  }
}
var github = {
  x: marginLeft,
  y: headline.y + 24,
  option: {
      width: 669,
      height: 110,
      align: 'center'
  }
}

module.exports.person = person
module.exports.line = line
module.exports.headline = headline

module.exports.github = github
module.exports.githubTitle = githubTitle
