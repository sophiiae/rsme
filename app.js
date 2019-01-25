const express = require('express');
const request = require('request');
const mustacheExpress = require('mustache-express');
const Pdfkit = require('pdfkit');
const LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');
const conf = require('./routes/conf');
const index = require('./routes/index');
const style = require('./routes/style');

const app = express();
const port = 4000;

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

// render PDF
app.get('/pdf', (req, res) => {
  let doc = new Pdfkit();
  let pplString = localStorage.getItem('person');
  let person = JSON.parse(pplString);

  doc.pipe(res);

  // ** Profile Name
  doc.fontSize(style.person.fontsize)
    .text(person.firstName + ' ' + person.lastName, style.person.x, style.person.y, style.person.option);

  // ** line
  doc.moveTo(style.line.startx, style.line.starty)
  .lineTo(style.line.endx, style.line.endy)
  .stroke()

  // ** person headline
  doc.fontSize(style.headline.fontsize)
  .fillColor('black')
  .text(person.headline, style.headline.x, style.headline.y)

  doc.end();
})

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
