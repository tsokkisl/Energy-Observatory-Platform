var fs = require('fs');

module.exports = {
  deleteFile: function() {
    if (fs.existsSync('data/data.json')) fs.unlinkSync('data/data.json');
    if (fs.existsSync('data/data.csv')) fs.unlinkSync('data/data.csv');
  }
};
