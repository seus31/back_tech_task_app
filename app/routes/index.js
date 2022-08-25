const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
  if (req.session.username) {
      next();
  } else {
      res.redirect('/login');
  }
});

module.exports = router;
