const crypto = require('crypto');

module.exports = {
  genToken: function(username, password) {
    const hash = crypto.createHash('sha256');
    return hash.update(username + password).digest('hex');
  }
};
