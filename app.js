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

// main page
app.use('/', index);

// get authorized code
app.get('/auth', (req, res) => {
  const accesscode = req.query.code;
  accessToken(accesscode, res);
});

// get GitHub username from user input
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
    doc.fontSize(30)
      .text(`${person.firstName} ${person.lastName}`, 60, 50, {
        stroke: true,
        fill: true,
      });

    // ** person headline
    doc.font('Courier')
      .fontSize(14)
      .text(person.industry, {
        stroke: true,
        fill: true,
      });

    doc.fontSize(12)
      .text(person.headline);

    // ** line
    doc.moveTo(50, doc.y + 6)
      .fontSize(16)
      .lineTo(540, doc.y + 6)
      .stroke();

    // ** person intro
    doc.moveDown()
      .fontSize(12)
      .text(person.summary, {
        width: 500,
        align: 'left',
        stroke: true,
        fill: true,
      });

    const position = person.positions.values[0];

    // add content if position is found
    if (position) {
      const company = position.company;
      if (position.title && company.name) {
        // ** job
        doc.moveDown()
          .font('Helvetica')
          .fontSize(16)
          .fillColor('gray')
          .text('CURRENT JOB');

        // ** job title and employer
        doc.moveDown(0.4)
          .fontSize(14)
          .fillColor('black')
          .text(`${position.title}  |  ${company.name}`, {
            stroke: true,
            fill: true,
          });
      }

      const startDate = position.startDate;
      if (startDate) {
        // ** job time
        doc.moveDown(0.5)
          .fontSize(12)
          .font('Helvetica')
          .fillColor('gray')
          .text(`${monthNames[startDate.month - 1]} ${startDate.year} to Present `);
      }

      if (position.summary) {
        // ** job summary
        doc.moveDown(0.5)
          .fontSize(12)
          .fillColor('black')
          .lineGap(4)
          .text(position.summary, {
            width: 500,
            align: 'left',
          });
      }
    }

    // ** Github chart title
    const githubName = 'GitHub';
    doc.moveDown()
      .font('Helvetica')
      .fontSize(14)
      .text(githubName, {
        stroke: true,
        fill: true,
        width: 500,
        align: 'center',
      });

    const githubURL = localStorage.getItem('github');
    doc.fontSize(10)
      .text(githubURL, {
        width: 500,
        align: 'center',
        underline: true,
      });

    // convert GitHub contribution chart svg to pdf
    SVGtoPDF(doc, svgString, 50, doc.y + 10);

    doc.end();
  });
});

// show error page if not found
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

// app.listen(port, () => console.log('App is served at http://99.79.3.225'));
app.listen(port, () => console.log(`App is served at http://localhost:${port}`));

// clear local storage
localStorage.clear();

module.exports = app;
