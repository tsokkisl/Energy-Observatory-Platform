const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const connection = require('../server').connection;
const { genApiKey } = require('../utils/apikey');

//get all users from database
router.get('/', (req, res) => {
  connection.query("SELECT * FROM users", function (err, result, fields) {
    if (err) throw err;
    res.json(result);
  });
});

//register user
router.post('/newuser', (req, res) => {
  const { username, email, password, quota } = req.body;
  connection.query("SELECT * FROM users WHERE username = '" + username + "'", function (err, result) {
    if (result[0]) {
      res.send("A user with that username already exists");
    }
    else {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
          connection.query("SELECT apikey FROM users", function (err, result) {
            result = result.map(x => { return x.apikey; })
            let apikey = genApiKey(result);
            connection.query("INSERT INTO users (username, email, password, quota, apikey) VALUES ('" + username + "', '" + email + "', '" + hash + "', '" + quota + "', '" + apikey + "')", function (err) {
              if (err) res.send("Registration failed");
              else res.send("Registration successfull - Your Api Key is : " + apikey);
            });
          });
        });
      });
    }
  });
});

//modify user
router.post('/moduser', (req, res) => {
  const { username, email, password, quota } = req.body;
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      connection.query("UPDATE users SET password = '" + hash + "', email = '" + email + "', quota = '" + quota + "'WHERE username = '" + username + "'", function (err, result) {
        if (err) res.send("User update failed");
        else res.send("User updated successfully");
      });
    });
  });
});

//userstatus
router.post('/userstatus', (req, res) => {
  const username = req.body.username;
  connection.query("SELECT * FROM users WHERE username = '" + username + "'", function (err, result, fields) {
    if (err) throw err;
    if (result.length > 0) res.send("Username : " + result[0].username + "\nEmail : " + result[0].email + "\nApi key : " + result[0].apikey + "\nQuota : " + result[0].quota);
    else res.send("User not found");
  });
});

//insert new data
router.post('/newdata', (req, res) => {
  let count = 0;
  let dataset = req.header('Dataset');
  let params = []
  for (row of req.body) {
    let temp = []
    for (let val in row) {
      if (val == 'Status' && row[val] == 'NULL') temp.push(null);
      else if (val == 'EntityCreatedAt' || val == 'EntityModifiedAt') temp.push(row[val].slice(0, -7));
      else temp.push(row[val]);
    }
    params.push(temp)
    count++;
  }
  if (dataset == 'ActualTotalLoad') {
    connection.query("INSERT INTO " + dataset + " (Id,EntityCreatedAt,EntityModifiedAt,ActionTaskID,Status,Year,Month,Day,DateTime,AreaName,UpdateTime,TotalLoadValue,AreaTypeCodeId,AreaCodeId,ResolutionCodeId,MapCodeId,RowHash) VALUES ?", [params], function (err) {
      if (err) res.send("Failed to add " + count + " row(s) into the database...");
      else {
        connection.query("SELECT COUNT(Id) AS totalRecords FROM " + dataset, function (err, result) {
          if (err) res.send("Failed to add " + count + " row(s) into the database...\nError : " + err.sqlMessage);
          else res.send("Added " + count + " new row(s) in the database!\n\nTotal Records for " + dataset + " : " + result[0].totalRecords);
        });
      }
    });
  }
  else if (dataset == 'AggregatedGenerationPerType') {
    connection.query("INSERT INTO " + dataset + " (Id,EntityCreatedAt,EntityModifiedAt,ActionTaskID,Status,Year,Month,Day,DateTime,AreaName,UpdateTime,ActualGenerationOutput,ActualConsuption,AreaTypeCodeId,AreaCodeId,ResolutionCodeId,MapCodeId,ProductionTypeId,RowHash) VALUES ?", [params], function (err) {
      if (err) res.send("Failed to add " + count + " row(s) into the database...");
      else {
        connection.query("SELECT COUNT(Id) AS totalRecords FROM " + dataset, function (err, result) {
          if (err) res.send("Failed to add " + count + " row(s) into the database...\nError : " + err.sqlMessage);
          else res.send("Added " + count + " new row(s) in the database!\n\nTotal Records for " + dataset + " : " + result[0].totalRecords);
        });
      }
    });
  }
  else if (dataset == 'DayAheadTotalLoadForecast') {
    connection.query("INSERT INTO " + dataset + " (Id,EntityCreatedAt,EntityModifiedAt,ActionTaskID,Status,Year,Month,Day,DateTime,AreaName,UpdateTime,TotalLoadValue,AreaTypeCodeId,AreaCodeId,ResolutionCodeId,MapCodeId,RowHash) VALUES ?", [params], function (err) {
      if (err) res.send("Failed to add " + count + " row(s) into the database...\nError : " + err.sqlMessage);
      else {
        connection.query("SELECT COUNT(Id) AS totalRecords FROM " + dataset, function (err, result) {
          if (err) res.send("Failed to add " + count + " row(s) into the database...");
          else res.send("Added " + count + " new row(s) in the database!\n\nTotal Records for " + dataset + " : " + result[0].totalRecords);
        });
      }
    });
  }
  else res.sendStatus(400);
});

module.exports = router
