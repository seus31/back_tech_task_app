const models = require('../models');

module.exports = {
  validateEmail: (email) => {
    return models.user.findOne({ where: { email: email } }).then((user) => {
      if (user) {
        return Promise.reject('このメールアドレスはすでに使われています。');
      }
    });
  },
  validatePasswordConfirm: (passwordConfirm, req) => {
    if (passwordConfirm !== req.body.password) {
      return Promise.reject('パスワードが一致していません。');
    }
  },
};