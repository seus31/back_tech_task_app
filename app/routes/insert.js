var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {

  let msg = req.query.msg || "ふにょふにょ"
  const client = require("../db_client").pg_client()

  client.connect()
    .then(() => console.log("Connected successfuly"))
    .then(() => client.query(`INSERT INTO chat (timestamp, comment) VALUES( now(), '${msg}' );`))
    .then(() => client.query(`SELECT * FROM chat order by timestamp desc;` ))
    .then(function (results) {
      console.table(results.rows)
      res.render('index', { title: 'インサート', sql_result: results.rows })
    })
    .catch((e => console.log(e)))
    .finally((() => client.end()))


  // res.render('index', { title: 'Express' });
});

module.exports = router;
