const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
  if (req.session.username) {
      next();
  } else {
      res.redirect('/login');
  }
  const client = require("../db_client").pg_client()

  client.connect()
    .then(() => console.log("Connected successfuly"))
    .then(() => client.query("select * from users"))
    .then(function (results) {
      console.table(results.rows)
      res.render('index', { title: 'セレクト', sql_result: results.rows})
    })
    .catch((e => console.log(e)))
    .finally((() => client.end()))

  // res.render('index', { title: 'Express' ,sql_result: results.rows});


});

module.exports = router;
