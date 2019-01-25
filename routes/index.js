const express = require('express');
const conf = require('../routes/conf');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('index', {
    title: 'LinkedIn Binding',
    oauth: conf.linkedin.oauth,
  });
});

module.exports = router;
