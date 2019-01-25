const express = require('express');
const conf = require('../routes/conf');

const router = express.Router();

router.get('/', (req, res) => {
  let doc = new Pdfkit();
  let pplString = localStorage.getItem('person');
  let person = JSON.parse(pplString);

  doc.pipe(res);
  doc.fontSize(25)
    .text(person.firstName + person.lastName, 100, 100);
  doc.end();
});

module.exports = router;



app.get('/pdf', (req, res) => {
  let doc = new Pdfkit();
  let pplString = localStorage.getItem('person');
  let person = JSON.parse(pplString);

  doc.pipe(res);
  doc.fontSize(25)
    .text(person.firstName + person.lastName, 100, 100);
  doc.end();
})