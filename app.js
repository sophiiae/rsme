const express = require('express');
const request = require('request');
const mustacheExpress = require('mustache-express');
const conf = require('./routes/conf');

const app = express();
const port = 4000;

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', `${__dirname}/views`);

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

const renderPDF = res => (err, r, body) => {
  if (err) res.status(500).send(err);
  const person = JSON.parse(body);
  res.status(200).render('token', {
    website: 'LinkedIn',
    user: person.firstName,
  });
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

app.use(express.static('public'));
app.get('/auth', (req, res) => {
  const accesscode = req.query.code;
  accessToken(accesscode, res);
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
