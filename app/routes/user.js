const express = require('express');
const router = express.Router();
const models = require('../models');

router.get('/', async (req, res, next) => {
  if (req.session.email) {
    const users = await models.user.findAll();
    res.render('user', {title: 'ユーザー一覧', users: users })
  } else {
    req.session.redirect_url = '/users'
    return res.redirect('/login');
  }
})

module.exports = router;
