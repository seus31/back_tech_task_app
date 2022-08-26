const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const validate = require('../libs/validate');
const mailer = require('nodemailer');
const bcrypt = require('bcrypt');
const models = require('../models');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: false });

router.get('/forgot', (req, res, next) => {
  res.render('password', { title: 'パスワードリセット', errors: [] })
})

router.post('/send',
  body('email', 'メールアドレスまたはパスワードが正しくありません。')
    .custom((email, {req}) => validate.resetCheck(email)),
  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.array().length === 0) {

      const smtp = mailer.createTransport({
        host: 'mailhog',
        port: '1025',
        auth: {
          user: 'user',
          pass: 'password',
        }
      });

      const mailOptions = {
        from: 'admin@localhost.com',
        to: req.body.email,
        subject: 'タイトルです',
        html: 'http://localhost:3000/password/reset?email=' + req.body.email,
      };

      smtp.sendMail(mailOptions, function(err, info) {
        if (!err) {
          console.log('Mail success: ' + info.response);
        } else {
          console.log('Mail err', err);
        }
        smtp.close();
      });    }
    res.render('password', { title: 'パスワードリセット', errors: errors.array() })
})

router.get('/reset', csrfProtection, (req, res, next) => {
  res.render('reset', { title: 'パスワードリセット', email: req.query.email, csrfToken: req.csrfToken(), errors: [] })
})

router.post('/reset',
  csrfProtection,
  body('password', 'パスワードが正しくありません。')
    .matches(/^[a-zA-Z0-9.?/-@_=!]{8,}$/, 'i')
    .withMessage('パスワードは8文字以上で、大文字・小文字・数字・記号『.?/-@_=!』を使って入力してください。'),
  body('password_confirm', 'パスワード確認が正しくありません。')
    .custom((passwordConfirm, { req }) => validate.validatePasswordConfirm(passwordConfirm, req)),
  (req, res, next) => {
    const errors = validationResult(req);

    if (errors.array().length === 0) {
      const email = req.body.email
      const password = bcrypt.hashSync(req.body.password, 10)

      return models.user.update(
        { 'password': password },
        { where: { email: email } })
        .then(() => {
          return res.redirect('/login')
        }).catch((e => console.log(e)))
    }

    res.render('reset', { title: 'パスワードリセット', csrfToken: req.csrfToken(), errors: errors.array() })
  })

module.exports = router;
