const models = require('../models');
const bcrypt = require('bcrypt');

module.exports = {
  validateEmail: (email) => {
    return models.user.findOne({ where: { email: email } }).then((user) => {
      if (user) {
        return Promise.reject('このメールアドレスはすでに使われています。');
      }
      return true;
    });
  },
  validatePasswordConfirm: (passwordConfirm, req) => {
    if (passwordConfirm !== req.body.password) {
      return Promise.reject('パスワードが一致していません。');
    }
    return true;
  },
  loginCheck: (email, req) => {
    return models.user.findOne({ where: { email: email } }).then(async (user) => {
      if (!user || (user && !await bcrypt.compare(req.body.password, user.password))) {
        return Promise.reject('メールアドレスまたはパスワードが正しくありません。');
      }
    });
  },
  resetCheck: (email) => {
    return models.user.findOne({ where: { email: email } }).then(async (user) => {
      if (!user) {
        return Promise.reject('メールアドレスが存在しません。');
      }
    });
  },
};