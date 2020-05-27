var connection = require('../server').connection;

module.exports = {
  resetQuota: function (req, res, next) {
    connection.query("SELECT last_quota_reset FROM users WHERE username = '" + JSON.parse(localStorage.getItem('authUser'))['username'] + "'", function (err, result, fields) {
      if (Math.abs(new Date() - new Date(result[0].last_quota_reset)) / 3600000 >= 24) {
        connection.query("UPDATE users SET quota = 1000, last_quota_reset = '" + new Date() + "' WHERE username = '" + JSON.parse(localStorage.getItem('authUser'))['username'] + "'", function (err) {
          if (err) throw err;
          else return next();
        })
      }
      else return next();
    });
  },
  checkForResources: function (req, res, next) {
    connection.query("SELECT * FROM users WHERE username = '" + JSON.parse(localStorage.getItem('authUser'))['username'] + "'", function (err, result, fields) {
      if (result[0].quota > 0) return next();
      else res.sendStatus(402);
    });
  },
  useAPIResource: function (username) {
    connection.query("UPDATE users SET quota = quota - 1 WHERE username = '" + username + "'", function (err) {
      if (err) throw err;
    });
  }
};
