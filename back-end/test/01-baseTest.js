const expect = require('chai').expect;
var request = require('request');
const fs = require('fs');

function getToken() {
  if (fs.existsSync('../cli-client/softeng19bAPI.token')) return fs.readFileSync('../cli-client/softeng19bAPI.token','utf8');
  else return 'unauthorized';
}

describe('Base commands', () => {
  //Reset Tests
  describe('/POST Reset', () => {
    it('/Reset - Should GET status : OK', (done) => {
      var clientServerOptions = {
        uri: 'https://localhost:8765/energy/api/Reset',
        method: 'POST',
        requestCert: true,
        rejectUnauthorized: false,
        agent: false
      }
      request(clientServerOptions, function (error, response, body) {
        expect(JSON.parse(body)).to.include({ "status": "OK" });
        done();
      })
    });
  });
  //Login tests
  describe('/POST login', () => {
    it('/Login (User does not exist) - Should GET status code 401', (done) => {
      var clientServerOptions = {
        uri: 'https://localhost:8765/energy/api/Login',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-OBSERVATORY-AUTH' : JSON.stringify({ "username" : "adminn", "password" : "321nimda" })
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
    it('/Login (User exist) - Should GET Authentication token', (done) => {
      var clientServerOptions = {
        uri: 'https://localhost:8765/energy/api/Login',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-OBSERVATORY-AUTH' : JSON.stringify({ "username" : "admin", "password" : "321nimda" })
        },
        requestCert: true,
        rejectUnauthorized: false,
        agent: false
      }
      request(clientServerOptions, function (error, response, body) {
        fs.writeFileSync('../cli-client/softeng19bAPI.token', JSON.parse(body)['token'], 'utf8', () => {});
        expect(JSON.parse(body)).to.contain.keys("token");
        done();
      });
    });
    it('/Login (User already logged in) - Should GET status code 400', (done) => {
      var clientServerOptions = {
        uri: 'https://localhost:8765/energy/api/Login',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-OBSERVATORY-AUTH' : JSON.stringify({ "username" : "admin", "password" : "321nimda" })
        },
        requestCert: true,
        rejectUnauthorized: false,
        agent: false
      }
      request(clientServerOptions, function (error, response, body) {
        expect(response.statusCode).to.equal(400);
        done();
      });
    });
    // describe('/POST Logout', () => {
    //     it('/Logout - Should GET logout message', (done) => {
    //         var clientServerOptions = {
    //             uri: 'https://localhost:8765/energy/api/Logout',
    //             method: 'POST',
    //             headers: {
    //                 'X-OBSERVATORY-AUTH' : getToken()
    //             },
    //             requestCert: true,
    //             rejectUnauthorized: false,
    //             agent: false
    //         }
    //         request(clientServerOptions, function (error, response, body) {
    //             assert.equal(body, "You have been logged out");
    //             done();
    //         });
    //     });
    // });
  });
  //Logout tests
  // describe('/POST Logout', () => {
  //     it('/Logout - Should GET logout message', (done) => {
  //         var clientServerOptions = {
  //             uri: 'https://localhost:8765/energy/api/Logout',
  //             method: 'POST',
  //             headers: {
  //                 'X-OBSERVATORY-AUTH' : getToken()
  //             },
  //             requestCert: true,
  //             rejectUnauthorized: false,
  //             agent: false
  //         }
  //         request(clientServerOptions, function (error, response, body) {
  //             assert.equal(body, "You have been logged out");
  //             done();
  //         });
  //     });
  // });
  //HealthCheck tests
  describe('/GET HealthCheck', () => {
    it('/HealthCheck - Should GET status : OK', (done) => {
      var clientServerOptions = {
        uri: 'https://localhost:8765/energy/api/HealthCheck',
        requestCert: true,
        rejectUnauthorized: false,
        agent: false
      }
      request(clientServerOptions, function (error, response, body) {
        expect(JSON.parse(body)).to.include({ "status": "OK" });
        done();
      })
    });
  });
});
