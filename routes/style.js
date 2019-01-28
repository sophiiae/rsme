const marginLeft = 60;
const marginTop = 50;

const person = {
  fontsize: 30,
  x: marginLeft,
  y: marginTop,
  option: {
    stroke: true,
    fill: true,
  },
};

const line = {
  startx: 50,
  starty: person.y + 60,
  endx: 540,
  endy: person.y + 60,
};

const headline = {
  fontsize: 14,
  x: marginLeft,
  y: person.y + 34,
  option: {
    stroke: true,
    fill: true,
  },
};

const intro = {
  fontsize: 12,
  x: marginLeft,
  y: headline.y + 34,
  option: {
    width: 500,
    align: 'left',
    stroke: true,
    fill: true,
  },
};

/** ********* CURRENT JOB *********** */
const experience = {
  fontsize: 16,
  x: marginLeft,
  y: intro.y + 50,
  option: {
    stroke: true,
    fill: true,
  },
};

const jobTitle = {
  fontsize: 14,
  x: marginLeft,
  y: experience.y + 18,
  option: {
    stroke: true,
    fill: true,
  },
};

const jobTime = {
  fontsize: 11,
  x: marginLeft,
  y: jobTitle.y + 18,
};

const jobSummary = {
  fontsize: 12,
  x: marginLeft,
  y: jobTime.y + 16,
  option: {
    width: 500,
    align: 'left',
  },
};

/** ********* GITHUB *********** */
const githubTitle = {
  fontsize: 14,
  x: marginLeft - 10,
  y: jobSummary.y + 200,
  option: {
    stroke: true,
    fill: true,
    width: 500,
    align: 'center',
  },
};

const githubURL = {
  fontsize: 10,
  x: marginLeft - 10,
  y: githubTitle.y + 20,
  option: {
    width: 500,
    align: 'center',
    underline: true,
  },
};

const github = {
  x: marginLeft - 10,
  y: githubURL.y + 24,
  option: {
    width: 669,
    height: 110,
    align: 'center',
  },
};

const updateTime = {
  fontsize: 10,
  x: 380,
  y: github.y + 80,
};

module.exports.person = person;
module.exports.line = line;
module.exports.headline = headline;
module.exports.intro = intro;

module.exports.experience = experience;
module.exports.jobTitle = jobTitle;
module.exports.jobTime = jobTime;
module.exports.jobSummary = jobSummary;
module.exports.updateTime = updateTime;

module.exports.github = github;
module.exports.githubURL = githubURL;
module.exports.githubTitle = githubTitle;
