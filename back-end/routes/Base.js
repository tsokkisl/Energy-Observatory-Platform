const express = require('express')
const router = express.Router()
const connection = require('../server').connection;
const bcrypt = require('bcrypt')
const { isAuthenticated } = require('../middlewares/auth');
const { isNotAuthenticated } = require('../middlewares/auth');
const { genToken } = require('../utils/token');

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./session');
}

//login user
router.post('/Login', isNotAuthenticated, (req, res, next) => {
  let username = JSON.parse(req.header('X-OBSERVATORY-AUTH'))['username'];
  let password = JSON.parse(req.header('X-OBSERVATORY-AUTH'))['password'];
  connection.query("SELECT * FROM users WHERE username = '" + username + "'", function (err, row) {
    if (row == undefined || !row[0]) res.sendStatus(401);
    else {
      // Match password
      bcrypt.compare(password, row[0].password, (err, isMatch) => {
        if (isMatch) {
          let token = genToken(username, password);
          let isAdmin = false;
          if (username.toLowerCase() === 'admin') isAdmin = true;
          localStorage.setItem('authUser', JSON.stringify({ "username" : username, "password" : password, "token" : token, "Admin" : isAdmin }));
          res.send(JSON.stringify({ "token": token }));
        }
        else {
          res.sendStatus(401);
        }
      });
    }
  });
});

//logout user
router.post('/Logout', isAuthenticated, (req, res) => {
  localStorage.removeItem('authUser');
  res.sendStatus("200");
})

//health check
router.get('/HealthCheck', (req, res) => {
  if(connection.state !== 'disconnected') res.send(JSON.stringify({ "status": "OK" }));
  else res.send("Database disconnected...");
})

//reset
router.post('/Reset', (req, res) => {
  connection.query("DELETE FROM actualtotalload", function (err, result) {
    if (err) res.send("Failed to reset database...");
    else {
      connection.query("DELETE FROM aggregatedgenerationpertype", function (err, result) {
        if (err) res.send("Failed to reset database...");
        else {
          connection.query("DELETE FROM dayaheadtotalloadforecast", function (err, result) {
            if (err) res.send("Failed to reset database...");
            else {
              connection.query("DELETE FROM users WHERE username != 'admin'", function (err, result) {
                if (err) res.send("Failed to reset database...");
                else res.send(JSON.stringify({ "status": "OK" }));
              });
            }
          });
        }
      });
    }
  });
})

module.exports = router
