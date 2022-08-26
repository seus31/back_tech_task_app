const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const validate = require('../libs/validate');
const models = require('../models');
const bcrypt = require('bcrypt');

router.get('/', (req, res, next) => {
  res.render('register', { title: '新規登録', errors: [] })
})

router.post('/',
  body('username', 'ユーザー名が正しくありません。')
    .isAlphanumeric()
    .withMessage('ユーザー名は半角英数字で入力してください。')
    .isLength({min: 5, max: 32})
    .withMessage('ユーザー名は5文字以上32文字以下で入力してください。')
    .not()
    .isEmpty()
    .withMessage('ユーザー名は必須です。'),
  body('email', 'メールアドレスが正しくありません。')
    .isEmail()
    .withMessage('メールアドレスの形式が正しくありません。')
    .custom(async (email, {req}) => validate.validateEmail(email)),
  body('password', 'パスワードが正しくありません。')
    .matches(/^\S?[a-zA-Z0-9.?/-@_=!]{8,}$/, "i")
    .withMessage('パスワードは8文字以上で、大文字・小文字・数字・記号『.?/-@_=!』を使って入力してください。'),
  body('password_confirm', 'パスワードが正しくありません。')
    .custom((passwordConfirm, { req }) => validate.validatePasswordConfirm(passwordConfirm, req)),
  (req, res, next) => {
    const errors = validationResult(req);

    if (errors.array().length === 0) {
      const username = req.body.username
      const email = req.body.email
      const password = bcrypt.hashSync(req.body.password, 10)

      return models.user.findOrCreate({
        where: { email: email },
        defaults: {
          username: username,
          email: email,
          password: password
        }
      }).then(([user, created]) => {
        if (created) return res.redirect('/login')
      }).catch((e => console.log(e)))
    }

    res.render('register', {title: '新規登録', errors: errors.array()})
  })

module.exports = router;
