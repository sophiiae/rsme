const express = require('express');
const request = require('request');
const mustacheExpress = require('mustache-express');
const Pdfkit = require('pdfkit');
const LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');
const conf = require('./routes/conf');
const index = require('./routes/index');

const app = express();
const port = 4000;

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', `${__dirname}/views`);

const renderPDF = res => (err, r, body) => {
  if (err) res.status(500).send(err);
  const person = JSON.parse(body);
  localStorage.setItem('person', body);
  res.status(200).render('tokenSuccess', {
    website: 'LinkedIn',
    user: person.firstName,
  });
};

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
    getPerson(token, renderPDF(res));
  });
};

app.use('/', index);

app.get('/auth', (req, res) => {
  const accesscode = req.query.code;
  accessToken(accesscode, res);
});

app.get('/pdf', (req, res) => {
  let doc = new Pdfkit();
  let pplString = localStorage.getItem('person');
  let person = JSON.parse(pplString);

  doc.pipe(res);
  doc.fontSize(25)
    .text(person.firstName + person.lastName, 100, 100);
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
