const express = require('express');
const request = require('request');
const mustacheExpress = require('mustache-express');
const Pdfkit = require('pdfkit');
const xpath = require('xpath');
const SVGtoPDF = require('svg-to-pdfkit');
const LocalStorage = require('node-localstorage').LocalStorage;

const localStorage = new LocalStorage('./scratch');
const DomParser = require('xmldom').DOMParser;

const dom = new DomParser();

const conf = require('./routes/conf');
const index = require('./routes/index');
const style = require('./routes/style');

const app = express();
const port = 4000;
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', `${__dirname}/views`);

// extract LinkedIn public information
const getInfo = res => (err, r, body) => {
  if (err) res.status(500).send(err);
  const person = JSON.parse(body);
  localStorage.setItem('person', body);
  res.status(200).render('tokenSuccess', {
    website: 'LinkedIn',
    user: person.firstName,
  });
};

// get user with granted token
const getPerson = (token, next) => {
  request.get(
    conf.linkedin.peopleURL,
    {
      auth: {
        bearer: token,
      },
    },
    next,
  );
};

// generate OAuth token
const accessToken = (accesscode, res) => {
  request.post(conf.linkedin.tokenURL, {
    form: {
      grant_type: conf.linkedin.grantType,
      code: accesscode,
      redirect_uri: conf.linkedin.redirect,
      client_id: conf.linkedin.id,
      client_secret: conf.linkedin.secret,
    },
  }, (err, r, body) => {
    if (err) {
      res.status(500).send(err);
      return;
    }

    const token = JSON.parse(body).access_token;
    getPerson(token, getInfo(res));
  });
};

app.use('/', index);

app.get('/auth', (req, res) => {
  const accesscode = req.query.code;
  accessToken(accesscode, res);
});

// get GitHub username
app.get('/form', (req, res) => {
  const username = req.query.github;
  const chart = conf.github.pre + username;
  localStorage.setItem('github', chart);
});

// render PDF
app.get('/pdf', (req, res) => {
  const github = localStorage.getItem('github');
  request(github, (err, r, body) => {
    if (err) throw err;
    if (res.statusCode !== 200) throw new Error(`Request failed. Status code: ${res.statusCode}`);

    // -->> extract svg content from web source ----------------
    const docSVG = dom.parseFromString(body);
    const svgString = xpath.select("(//svg[@class='js-calendar-graph-svg'])[1]", docSVG)[0].toString();

    if (!svgString) throw new Error('SVG element not found.');

    // -->> upload stream as pdf file ------------
    const doc = new Pdfkit();
    const pplString = localStorage.getItem('person');
    const person = JSON.parse(pplString);

    doc.pipe(res);

    // ** Profile Name
    doc.fontSize(style.person.fontsize)
      .text(`${person.firstName} ${person.lastName}`, style.person.x, style.person.y, style.person.option);

    // ** person headline
    doc.font('Courier')
      .fontSize(style.headline.fontsize)
      .text(person.industry, style.headline.option);

    doc.fontSize(12)
      .text(person.headline);

    // ** line
    doc.moveTo(style.line.startx, doc.y + 6)
      .fontSize(16)
      .lineTo(style.line.endx, doc.y + 6)
      .stroke();

    // ** person intro
    doc.moveDown()
      .fontSize(12)
      .text(person.summary, style.intro.option);

    const position = person.positions.values[0];

    if (position) {
      const company = position.company;

      if (position.title && company.name) {
        // ** job
        doc.moveDown()
          .font('Helvetica')
          .fontSize(style.experience.fontsize)
          .fillColor('gray')
          .text('CURRENT JOB');

        // ** job title and employer
        doc.moveDown(0.4)
          .fontSize(style.jobTitle.fontsize)
          .fillColor('black')
          .text(`${position.title}  |  ${company.name}`, style.jobTitle.option);
      }

      const startDate = position.startDate;

      if (startDate) {
        // ** job time
        doc.moveDown(0.5)
          .fontSize(style.jobTime.fontsize)
          .font('Helvetica')
          .fillColor('gray')
          .text(`${monthNames[startDate.month - 1]} ${startDate.year} to Present `);
      }

      if (position.summary) {
        // ** job summary
        doc.moveDown(0.5)
          .fontSize(style.jobSummary.fontsize)
          .fillColor('black')
          .lineGap(4)
          .text(position.summary, style.jobSummary.option);
      }
    }

    // ** Github chart title
    const githubName = 'GitHub';
    doc.moveDown()
      .font('Helvetica')
      .fontSize(style.githubTitle.fontsize)
      .text(githubName, style.githubTitle.option);

    const githubURL = localStorage.getItem('github');
    doc.fontSize(style.githubURL.fontsize)
      .text(githubURL, style.githubURL.option);

    SVGtoPDF(doc, svgString, style.github.x, doc.y + 10);

    doc.end();
  });
});

app.use((req, res, next) => {
  const err = new Error('Not Found!');
  err.status = 404;
  next(err);
});

// error handler
// development error handler -> production eror handler, change `error: err` to `error: {}`
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err,
  });
});

app.listen(port, () => console.log(`App is served at http://localhost:${port}`));
localStorage.clear();
module.exports = app;
