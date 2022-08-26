const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
  if (req.session.email) {
    return res.render('index', { title: 'ダッシュボード' })
  } else {
    return res.redirect('/login');
  }
});

module.exports = router;
