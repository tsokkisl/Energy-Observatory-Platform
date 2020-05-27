const { createCSV } = require('../utils/csv');
const fs = require('fs');

module.exports = {
  sendData: function(req, res, data) {
    if (req.query.format == 'csv') {
      res.setHeader("Content-Type", "text/csv");
      if (data != null) {
        let csv = createCSV(data);
        res.send(csv);
        if (fs.existsSync('data/data.csv')) fs.unlinkSync('data/data.csv');
        fs.writeFileSync('data/data.csv', csv,'utf8');
      }
      else {
        res.send("");
        if (fs.existsSync('data/data.csv')) fs.unlinkSync('data/data.csv');
      }
    }
    else if (req.query.format == 'json'  || req.query.format == undefined) {
      res.setHeader("Content-Type", "application/json");
      if (fs.existsSync('data/data.json')) fs.unlinkSync('data/data.json');
      fs.writeFileSync('data/data.json', JSON.stringify({ data }), 'utf8', () => {});
      res.send(JSON.stringify(data));
    }
    else res.sendStatus(400);
  }
};
