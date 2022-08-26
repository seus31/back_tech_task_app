const pool = require("../db_client")

module.exports = {
  validateEmail: async (email) => {
    return pool.connect()
      .then((client) => {
        return client
          .query(`SELECT * FROM users WHERE email = '${email}';`)
          .then((result) => {
            return result.rowCount === 0;
          })
          .catch((e => console.log(e)))
          .finally(() => client.release());
      });
  },
  validatePasswordConfirm: (passwordConfirm, req) => {
    return passwordConfirm === req.body.password
  },
};