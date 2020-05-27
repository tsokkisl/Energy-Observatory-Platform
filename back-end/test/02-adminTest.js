const assert = require('chai').assert;
const expect = require('chai').expect;
var request = require('request');
const fs = require('fs');

function getToken() {
  if (fs.existsSync('../cli-client/softeng19bAPI.token')) return fs.readFileSync('../cli-client/softeng19bAPI.token','utf8');
  else return 'unauthorized';
}

describe('Admin commands', () => {
  //userstatus tests
  describe('/GET userstatus', () => {
    it('/user/admin (Valid token) - Should GET user details', (done) => {
      var clientServerOptions = {
        uri: 'https://localhost:8765/energy/api/Admin/users/admin',
        headers: {
          'X-OBSERVATORY-AUTH' : getToken()
        },
        requestCert: true,
        rejectUnauthorized: false,
        agent: false
      }
      request(clientServerOptions, function (error, response, body) {
        expect(JSON.parse(body)).to.include.keys("username", "email", "requestsPerDayQuota");
        done();
      });
    });
    it('/user/admin (Invalid token) - Should GET status code 401', (done) => {
      var clientServerOptions = {
        uri: 'https://localhost:8765/energy/api/Admin/users/admin',
        headers: {
          'X-OBSERVATORY-AUTH' : 'unauthorized'
        },
        requestCert: true,
        rejectUnauthorized: false,
        agent: false
      }
      request(clientServerOptions, function (error, response, body) {
        expect(response.statusCode).to.equal(401);
        done();
      });
    });
    it('/user/asd - Should output message for not finding user', (done) => {
      var clientServerOptions = {
        uri: 'https://localhost:8765/energy/api/Admin/users/asd',
        headers: {
          'X-OBSERVATORY-AUTH' : getToken()
        },
        requestCert: true,
        rejectUnauthorized: false,
        agent: false
      }
      request(clientServerOptions, function (error, response, body) {
        expect(JSON.parse(body)).to.include({ "ERROR": "User not found..." });
        done();
      });
    });
  });
  //modify user tests
  describe('/PUT moduser', () => {
    it('/user/admin (Valid token) - Should send JSON object of user modified', (done) => {
      let data = { "password": '321nimda', "email": 'admin@mail.com', "quota": 2000 };
      var clientServerOptions = {
        uri: 'https://localhost:8765/energy/api/Admin/users/admin',
        body: JSON.stringify(data),
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-OBSERVATORY-AUTH' : getToken()
        },
        requestCert: true,
        rejectUnauthorized: false,
        agent: false
      }
      request(clientServerOptions, function (error, response, body) {
        expect(JSON.parse(body)).to.contain.keys("username", "email", "requestsPerDayQuota");
        done();
      });
    });
    it('/user/admin (Invalid token) - Should GET status code 401', (done) => {
      let data = { "password": "321nimda", "email": "admin@mail.com", "quota": 2000 };
      var clientServerOptions = {
        uri: 'https://localhost:8765/energy/api/Admin/users/admin',
        body: JSON.stringify(data),
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-OBSERVATORY-AUTH' : 'unauthorized'
        },
        requestCert: true,
        rejectUnauthorized: false,
        agent: false
      }
      request(clientServerOptions, function (error, response, body) {
        expect(response.statusCode).to.equal(401);
        done();
      });
    });
    it('/user/asd - Should send JSON object of error', (done) => {
      let data = { "password": '123', "email": 'test@mail.com', "quota": 2000 };
      var clientServerOptions = {
        uri: 'https://localhost:8765/energy/api/Admin/users/asd',
        body: JSON.stringify(data),
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-OBSERVATORY-AUTH' : getToken()
        },
        requestCert: true,
        rejectUnauthorized: false,
        agent: false
      }
      request(clientServerOptions, function (error, response, body) {
        expect(JSON.parse(body)).to.include({ "ERROR": "User not found..." });
        done();
      });
    });
  });
  //newdata tests
  describe('/POST newdata', () => {
    it('/ActualTotalLoad (Success) - Should message for successful insert', (done) => {
      var clientServerOptions = {
        uri: 'https://localhost:8765/energy/api/Admin/ActualTotalLoad/',
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-OBSERVATORY-AUTH' : getToken()
        },
        formData : {
          file : fs.createReadStream('../cli-client/newdata/ActualTotalLoad-10days.csv'),
          filetype: 'csv'
        },
        requestCert: true,
        rejectUnauthorized: false,
        agent: false
      }
      request(clientServerOptions, function (error, response, body) {
        expect(JSON.parse(body)).to.contain.keys('totalRecordsInFile', 'totalRecordsImported', 'totalRecordsInDatabase');
        done();
      });
    });
    it('/AggregatedGenerationPerType (success) - Should message for successful insert', (done) => {
      var clientServerOptions = {
        uri: 'https://localhost:8765/energy/api/Admin/AggregatedGenerationPerType/',
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-OBSERVATORY-AUTH' : getToken()
        },
        formData : {
          file : fs.createReadStream('../cli-client/newdata/AggregatedGenerationPerType-10days.csv'),
          filetype: 'csv'
        },
        requestCert: true,
        rejectUnauthorized: false,
        agent: false
      }
      request(clientServerOptions, function (error, response, body) {
        expect(JSON.parse(body)).to.contain.keys('totalRecordsInFile', 'totalRecordsImported', 'totalRecordsInDatabase');
        done();
      });
    });
    it('/DayAheadTotalLoadForecast (Success) - Should message for successful insert', (done) => {
      var clientServerOptions = {
        uri: 'https://localhost:8765/energy/api/Admin/DayAheadTotalLoadForecast/',
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-OBSERVATORY-AUTH' : getToken()
        },
        formData : {
          file : fs.createReadStream('../cli-client/newdata/DayAheadTotalLoadForecast-10days.csv'),
          filetype: 'csv'
        },
        requestCert: true,
        rejectUnauthorized: false,
        agent: false
      }
      request(clientServerOptions, function (error, response, body) {
        expect(JSON.parse(body)).to.contain.keys('totalRecordsInFile', 'totalRecordsImported', 'totalRecordsInDatabase');
        done();
      });
    });
  });
  //newuser tests
  describe('/POST newuser', () => {
    it('/users (Success) - Should send JSON object of user created', (done) => {
      let data = { "username" : Math.random().toString(36).slice(2) + Math.floor(Math.random() * 100000) + 1, "password": '123', "email": 'newuser@mail.com', "quota": 1000 };
      var clientServerOptions = {
        uri: 'https://localhost:8765/energy/api/Admin/users',
        body: JSON.stringify(data),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-OBSERVATORY-AUTH' : getToken()
        },
        requestCert: true,
        rejectUnauthorized: false,
        agent: false
      }
      request(clientServerOptions, function (error, response, body) {
        expect(JSON.parse(body)).to.contain.keys("username", "email", "requestsPerDayQuota");
        done();
      });
    });
    it('/users (Invalid username) - Should send JSON object of error', (done) => {
      let data = { "username" : "admin", "password": '123', "email": 'newuser@mail.com', "quota": 1000 };
      var clientServerOptions = {
        uri: 'https://localhost:8765/energy/api/Admin/users',
        body: JSON.stringify(data),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-OBSERVATORY-AUTH' : getToken()
        },
        requestCert: true,
        rejectUnauthorized: false,
        agent: false
      }
      request(clientServerOptions, function (error, response, body) {
        expect(JSON.parse(body)).to.include({ "ERROR": "Invalid username... Please try something else." });
        done();
      });
    });
    // it('/users (User already exists) - Should send JSON object of error', (done) => {
    //     let data = { "username" : "test", "password": '123', "email": 'newuser@mail.com', "quota": 1000 };
    //     var clientServerOptions = {
    //         uri: 'https://localhost:8765/energy/api/Admin/users',
    //         body: JSON.stringify(data),
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'X-OBSERVATORY-AUTH' : getToken()
    //         },
    //         requestCert: true,
    //         rejectUnauthorized: false,
    //         agent: false
    //     }
    //     request(clientServerOptions, function (error, response, body) {
    //         expect(JSON.parse(body)).to.include({ "ERROR": "A user with that username already exists..." });
    //         done();
    //     });
    // });
  });
});
