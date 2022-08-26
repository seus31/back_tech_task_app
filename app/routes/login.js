const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const validate = require('../libs/validate');

router.get('/', (req, res, next) => {
  console.log(req.url)
  res.render('login', { title: 'ログイン', errors: [] })
})

router.post('/',
  body('email', 'メールアドレスまたはパスワードが正しくありません。')
    .custom((email, {req}) => validate.loginCheck(email, req)),
  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.array().length === 0) {
      req.session.email = req.body.email;
      res.redirect('/user');
    }
    res.render('login', { title: 'ログイン', errors: errors.array() })
})

module.exports = router;
