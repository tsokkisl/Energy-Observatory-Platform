const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const connection = require('../server').connection;
const { isAuthenticated } = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/auth');
const { convertArrayToCSV } = require('convert-array-to-csv');
const fs = require('fs');

//get all users from database
router.get('/', (req, res) => {
  connection.query("SELECT * FROM users", function (err, result, fields) {
    if (err) throw err;
    res.json(result);
  });
});

//newuser
router.post('/users', isAuthenticated, isAdmin, (req, res) => {
  const { username, email, password, quota } = req.body;
  if (username.toLowerCase() == 'admin') res.send({ "ERROR": "Invalid username... Please try something else." });
  else {
    connection.query("SELECT * FROM users WHERE username = '" + username + "'", function (err, result) {
      if (err) console.log(err)
      if (result[0]) {
        res.send({ "ERROR": "A user with that username already exists..." });
      }
      else {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, (err, hash) => {
            connection.query("INSERT INTO users (username, email, password, quota, last_quota_reset) VALUES ('" + username + "', '" + email + "', '" + hash + "', '" + quota + "', '" + new Date() + "')", function (err) {
              if (err) res.send({ "ERROR": "Registration failed..." });
              else res.send(JSON.stringify({ "username": username, "email": email, "requestsPerDayQuota": quota }));
            });
          });
        });
      }
    });
  }
});

//modify user
router.put('/users/:user', isAuthenticated, isAdmin, (req, res) => {
  const username = req.params.user;
  const { email, password, quota } = req.body;
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      connection.query("SELECT * FROM users WHERE username = '" + username + "'", function (err, result) {
        if (result.length > 0 || result[0] != undefined) {
          connection.query("UPDATE users SET password = '" + hash + "', email = '" + email + "', quota = '" + quota + "'WHERE username = '" + username + "'", function (err, result) {
            if (err) res.send(JSON.stringify({ "ERROR": "Failed to update user" }));
            else res.send(JSON.stringify({ "username": username, "email": email, "requestsPerDayQuota": quota }));
          });
        }
        else res.send(JSON.stringify({ "ERROR": "User not found..." }));
      });
    });
  });
});

//userstatus
router.get('/users/:user', isAuthenticated, isAdmin, (req, res) => {
  const username = req.params.user;
  connection.query("SELECT * FROM users WHERE username = '" + username + "'", function (err, result, fields) {
    if (err) throw err;
    if (result.length > 0) res.send(JSON.stringify({ "username": result[0].username, "email": result[0].email, "requestsPerDayQuota": result[0].quota }));
    else res.send({ "ERROR": "User not found..." });
  });
});

//newdata
router.post('/:dataset', isAuthenticated, isAdmin, (req, res) => {
  let count = 0;
  let dataset = req.params.dataset;
  let params = [];
  let csvData = req.files.file.data.toString('utf8').split('\n');
  let csvHeaders = csvData[0].split(';');
  csvData.shift();

  for (row of csvData) {
    let temp = row.split(';');
    for (i in temp) {
      if (csvHeaders[i] == 'Status' && temp[i] == 'NULL') temp[i] = null;
      else if ((csvHeaders[i] == 'EntityCreatedAt' || csvHeaders[i] == 'EntityModifiedAt') && temp[i].slice(temp[i].length - 7) == ' +00:00') temp[i] = temp[i].slice(0, -7);
    }
    params.push(temp);
    count++;
  }

  if (fs.existsSync('uploaded_data.csv')) fs.unlinkSync('uploaded_data.csv');
  fs.writeFileSync('uploaded_data.csv', convertArrayToCSV(params, { csvHeaders, separator: ';' }),'utf8');

  if (dataset == 'ActualTotalLoad') {
    connection.query("SELECT COUNT(*) AS recordsBeforeInsert FROM " + dataset , function (err, result) {
      let recordsBeforeInsert = result[0].recordsBeforeInsert;
      connection.query("LOAD DATA LOCAL INFILE 'uploaded_data.csv' INTO TABLE " + dataset + " FIELDS TERMINATED BY ';' ENCLOSED BY '\"' LINES TERMINATED BY '\n' (Id,EntityCreatedAt,EntityModifiedAt,ActionTaskID,Status,Year,Month,Day,DateTime,AreaName,UpdateTime,TotalLoadValue,AreaTypeCodeId,AreaCodeId,ResolutionCodeId,MapCodeId,RowHash)" , function (err) {
        if (err) res.send({ "ERROR": "Failed to add " + count + " row(s) into the database..." });
        else {
          connection.query("SELECT COUNT(*) AS recordsAfterInsert FROM " + dataset, function (err, result) {
            if (err) res.send({ "ERROR": "Failed to add " + count + " row(s) into the database..." });
            else res.send(JSON.stringify({ "totalRecordsInFile" :  count, "totalRecordsImported" : result[0].recordsAfterInsert - recordsBeforeInsert, "totalRecordsInDatabase" : result[0].recordsAfterInsert }));
          });
        }
      });
    });
  }
  else if (dataset == 'AggregatedGenerationPerType') {
    connection.query("SELECT COUNT(*) AS recordsBeforeInsert FROM " + dataset , function (err, result) {
      let recordsBeforeInsert = result[0].recordsBeforeInsert;
      connection.query("LOAD DATA LOCAL INFILE 'uploaded_data.csv' INTO TABLE " + dataset + " FIELDS TERMINATED BY ';' ENCLOSED BY '\"' LINES TERMINATED BY '\n' (Id,EntityCreatedAt,EntityModifiedAt,ActionTaskID,Status,Year,Month,Day,DateTime,AreaName,UpdateTime,ActualGenerationOutput,ActualConsuption,AreaTypeCodeId,AreaCodeId,ResolutionCodeId,MapCodeId,ProductionTypeId,RowHash)" , function (err) {
        if (err) res.send({ "ERROR": "Failed to add " + count + " row(s) into the database..." });
        else {
          connection.query("SELECT COUNT(*) AS recordsAfterInsert FROM " + dataset, function (err, result) {
            if (err) res.send({ "ERROR": "Failed to add " + count + " row(s) into the database..." });
            else res.send(JSON.stringify({ "totalRecordsInFile" :  count, "totalRecordsImported" : result[0].recordsAfterInsert - recordsBeforeInsert, "totalRecordsInDatabase" : result[0].recordsAfterInsert }));
          });
        }
      });
    });
  }
  else if (dataset == 'DayAheadTotalLoadForecast') {
    connection.query("SELECT COUNT(*) AS recordsBeforeInsert FROM " + dataset , function (err, result) {
      let recordsBeforeInsert = result[0].recordsBeforeInsert;
      connection.query("LOAD DATA LOCAL INFILE 'uploaded_data.csv' INTO TABLE " + dataset + " FIELDS TERMINATED BY ';' ENCLOSED BY '\"' LINES TERMINATED BY '\n' (Id,EntityCreatedAt,EntityModifiedAt,ActionTaskID,Status,Year,Month,Day,DateTime,AreaName,UpdateTime,TotalLoadValue,AreaTypeCodeId,AreaCodeId,ResolutionCodeId,MapCodeId,RowHash)" , function (err) {
        if (err) res.send({ "ERROR": "Failed to add " + count + " row(s) into the database..." });
        else {
          connection.query("SELECT COUNT(*) AS recordsAfterInsert FROM " + dataset, function (err, result) {
            if (err) res.send({ "ERROR": "Failed to add " + count + " row(s) into the database..." });
            else res.send(JSON.stringify({ "totalRecordsInFile" :  count, "totalRecordsImported" : result[0].recordsAfterInsert - recordsBeforeInsert, "totalRecordsInDatabase" : result[0].recordsAfterInsert }));
          });
        }
      });
    });
  }
  else res.sendStatus(400);
});

module.exports = router
