const assert = require('chai').assert;
const expect = require('chai').expect;
var request = require('request');
const fs = require('fs');

function getToken() {
  if (fs.existsSync('../cli-client/softeng19bAPI.token')) return fs.readFileSync('../cli-client/softeng19bAPI.token','utf8');
  else return 'unauthorized';
}

describe('Fetch Data commands', () => {
  //ActualTotalLoad tests
  describe('/GET data by date - ActualTotalLoad', () => {
    it('/Greece/PT60M/date/2018-01-04/ (Valid parameters) - Should GET data', (done) => {
      var clientServerOptions = {
        uri: 'https://localhost:8765/energy/api/ActualTotalLoad/Greece/PT60M/date/2018-01-04?format=json',
        headers: {
          'X-OBSERVATORY-AUTH' : getToken()
        },
        requestCert: true,
        rejectUnauthorized: false,
        agent: false
      }
      request(clientServerOptions, function (error, response, body) {
        expect(JSON.parse(body)[0]).to.include({ "Source": "entso-e", "Dataset" : "ActualTotalLoad" });
      });
      done();
    });
    it('/Greece/PT60M/date/2018-01-40/ (No data) - Should GET null data', (done) => {
      var clientServerOptions = {
        uri: 'https://localhost:8765/energy/api/ActualTotalLoad/Greece/PT60M/date/2018-01-40?format=json',
        headers: {
          'X-OBSERVATORY-AUTH' : getToken()
        },
        requestCert: true,
        rejectUnauthorized: false,
        agent: false
      }
      request(clientServerOptions, function (error, response, body) {
        expect(JSON.parse(body)).to.equal(null);
      });
      done();
    })
    it('/Greece/PT60M/date/2018-01-04/ (No quotas) - Should GET status code 402', (done) => {
      var clientServerOptions = {
        uri: 'https://localhost:8765/energy/api/ActualTotalLoad/Greece/PT60M/date/2018-01-04?format=json',
        headers: {
          'X-OBSERVATORY-AUTH' : getToken()
        },
        requestCert: true,
        rejectUnauthorized: false,
        agent: false
      }
      request(clientServerOptions, function (error, response, body) {
        expect(response.statusCode).to.equal(402);
      });
      done();
    });
    it('/Greece/PT60M/date/2018-01-04/ (Logged out) - Should GET status code 401', (done) => {
      var clientServerOptions = {
        uri: 'https://localhost:8765/energy/api/ActualTotalLoad/Greece/PT60M/date/2018-01-04?format=json',
        headers: {
          'X-OBSERVATORY-AUTH' : 'unauthorized'
        },
        requestCert: true,
        rejectUnauthorized: false,
        agent: false
      }
      request(clientServerOptions, function (error, response, body) {
        expect(response.statusCode).to.equal(401);
      });
      done();
    });
    it('/Greece/PT60M/date/2018-01-04/ (Bad request) - Should GET status code 400', (done) => {
      var clientServerOptions = {
        uri: 'https://localhost:8765/energy/api/ActualTotalLoad/Greece/PT60M/date/2018-01-04?format=jso',
        headers: {
          'X-OBSERVATORY-AUTH' : getToken()
        },
        requestCert: true,
        rejectUnauthorized: false,
        agent: false
      }
      request(clientServerOptions, function (error, response, body) {
        expect(response.statusCode).to.equal(400);
      });
      done();
    });
  });
  //ActualvsForecast tests
  describe('/GET data by date - ActualvsForecast', () => {
    it('/Greece/PT60M/date/2018-01-04/ (Valid parameters) - Should GET data', (done) => {
      var clientServerOptions = {
        uri: 'https://localhost:8765/energy/api/ActualvsForecast/Greece/PT60M/date/2018-01-04?format=json',
        headers: {
          'X-OBSERVATORY-AUTH' : getToken()
        },
        requestCert: true,
        rejectUnauthorized: false,
        agent: false
      }
      request(clientServerOptions, function (error, response, body) {
        expect(JSON.parse(body)[0]).to.include({ "Source": "entso-e", "Dataset" : "ActualvsForecast" });
      });
      done();
    });
    it('/Greece/PT60M/date/2018-01-40/ (No data) - Should GET null data', (done) => {
      var clientServerOptions = {
        uri: 'https://localhost:8765/energy/api/ActualvsForecast/Greece/PT60M/date/2018-01-40?format=json',
        headers: {
          'X-OBSERVATORY-AUTH' : getToken()
        },
        requestCert: true,
        rejectUnauthorized: false,
        agent: false
      }
      request(clientServerOptions, function (error, response, body) {
        expect(JSON.parse(body)).to.equal({ });
      });
      done();
    })
    it('/Greece/PT60M/date/2018-01-04/ (No quotas) - Should GET status code 402', (done) => {
      var clientServerOptions = {
        uri: 'https://localhost:8765/energy/api/ActualvsForecast/Greece/PT60M/date/2018-01-04?format=json',
        headers: {
          'X-OBSERVATORY-AUTH' : getToken()
        },
        requestCert: true,
        rejectUnauthorized: false,
        agent: false
      }
      request(clientServerOptions, function (error, response, body) {
        expect(response.statusCode).to.equal(402);
      });
      done();
    });
    it('/Greece/PT60M/date/2018-01-04/ (Logged out) - Should GET status code 401', (done) => {
      var clientServerOptions = {
        uri: 'https://localhost:8765/energy/api/ActualvsForecast/Greece/PT60M/date/2018-01-04?format=json',
        headers: {
          'X-OBSERVATORY-AUTH' : 'unauthorized'
        },
        requestCert: true,
        rejectUnauthorized: false,
        agent: false
      }
      request(clientServerOptions, function (error, response, body) {
        expect(response.statusCode).to.equal(401);
      });
      done();
    });
    it('/Greece/PT60M/date/2018-01-04/ (Bad request) - Should GET status code 400', (done) => {
      var clientServerOptions = {
        uri: 'https://localhost:8765/energy/api/ActualvsForecast/Greece/PT60M/date/2018-01-04?format=jso',
        headers: {
          'X-OBSERVATORY-AUTH' : getToken()
        },
        requestCert: true,
        rejectUnauthorized: false,
        agent: false
      }
      request(clientServerOptions, function (error, response, body) {
        expect(response.statusCode).to.equal(400);

      });
      done();
    });
  });
  //AggregatedGenerationPerType tests
  describe('/GET data by date - AggregatedGenerationPerType', () => {
    it('/Greece/1/PT60M/date/2018-01-04/ (Valid parameters) - Should GET data', (done) => {
      var clientServerOptions = {
        uri: 'https://localhost:8765/energy/api/AggregatedGenerationPerType/Greece/1/PT60M/date/2018-01-04?format=json',
        headers: {
          'X-OBSERVATORY-AUTH' : getToken()
        },
        requestCert: true,
        rejectUnauthorized: false,
        agent: false
      }
      request(clientServerOptions, function (error, response, body) {
        expect(JSON.parse(body)[0]).to.include({ "Source": "entso-e", "Dataset" : "AggregatedGenerationPerType" });
      });
      done();
    });
    it('/Greece/1/PT60M/date/2018-01-40/ (No data) - Should GET null data', (done) => {
      var clientServerOptions = {
        uri: 'https://localhost:8765/energy/api/AggregatedGenerationPerType/Greece/1/PT60M/date/2018-01-40?format=json',
        headers: {
          'X-OBSERVATORY-AUTH' : getToken()
        },
        requestCert: true,
        rejectUnauthorized: false,
        agent: false
      }
      request(clientServerOptions, function (error, response, body) {
        expect(JSON.parse(body)).to.equal({ });
      });
      done();
    })
    it('/Greece/1/PT60M/date/2018-01-04/ (No quotas) - Should GET status code 402', (done) => {
      var clientServerOptions = {
        uri: 'https://localhost:8765/energy/api/AggregatedGenerationPerType/Greece/1/PT60M/date/2018-01-04?format=json',
        headers: {
          'X-OBSERVATORY-AUTH' : getToken()
        },
        requestCert: true,
        rejectUnauthorized: false,
        agent: false
      }
      request(clientServerOptions, function (error, response, body) {
        expect(response.statusCode).to.equal(402);
      });
      done();
    });
    it('/Greece/1/PT60M/date/2018-01-04/ (Logged out) - Should GET status code 401', (done) => {
      var clientServerOptions = {
        uri: 'https://localhost:8765/energy/api/AggregatedGenerationPerType/Greece/1/PT60M/date/2018-01-04?format=json',
        headers: {
          'X-OBSERVATORY-AUTH' : 'unauthorized'
        },
        requestCert: true,
        rejectUnauthorized: false,
        agent: false
      }
      request(clientServerOptions, function (error, response, body) {
        expect(response.statusCode).to.equal(401);
      });
      done();
    });
    it('/Greece/1/PT60M/date/2018-01-04/ (Bad request) - Should GET status code 400', (done) => {
      var clientServerOptions = {
        uri: 'https://localhost:8765/energy/api/AggregatedGenerationPerType/Greece/1/PT60M/date/2018-01-04?format=jso',
        headers: {
          'X-OBSERVATORY-AUTH' : getToken()
        },
        requestCert: true,
        rejectUnauthorized: false,
        agent: false
      }
      request(clientServerOptions, function (error, response, body) {
        expect(response.statusCode).to.equal(400);
      });
      done();
    });
  });
  //DayAheadTotalLoadForecast tests
  describe('/GET data by date - DayAheadTotalLoadForecast', () => {
    it('/Greece/PT60M/date/2018-01-04/ (Valid parameters) - Should GET data', (done) => {
      var clientServerOptions = {
        uri: 'https://localhost:8765/energy/api/DayAheadTotalLoadForecast/Greece/PT60M/date/2018-01-04?format=json',
        headers: {
          'X-OBSERVATORY-AUTH' : getToken()
        },
        requestCert: true,
        rejectUnauthorized: false,
        agent: false
      }
      request(clientServerOptions, function (error, response, body) {
        expect(JSON.parse(body)[0]).to.include({ "Source": "entso-e", "Dataset" : "DayAheadTotalLoadForecast" });
      });
      done();
    });
    it('/Greece/PT60M/date/2018-01-40/ (No data) - Should GET null data', (done) => {
      var clientServerOptions = {
        uri: 'https://localhost:8765/energy/api/DayAheadTotalLoadForecast/Greece/PT60M/date/2018-01-40?format=json',
        headers: {
          'X-OBSERVATORY-AUTH' : getToken()
        },
        requestCert: true,
        rejectUnauthorized: false,
        agent: false
      }
      request(clientServerOptions, function (error, response, body) {
        expect(JSON.parse(body)).to.equal({ });
      });
      done();
    })
    it('/Greece/PT60M/date/2018-01-04/ (No quotas) - Should GET status code 402', (done) => {
      var clientServerOptions = {
        uri: 'https://localhost:8765/energy/api/DayAheadTotalLoadForecast/Greece/PT60M/date/2018-01-04?format=json',
        headers: {
          'X-OBSERVATORY-AUTH' : getToken()
        },
        requestCert: true,
        rejectUnauthorized: false,
        agent: false
      }
      request(clientServerOptions, function (error, response, body) {
        expect(response.statusCode).to.equal(402);
      });
      done();
    });
    it('/Greece/PT60M/date/2018-01-04/ (Logged out) - Should GET status code 401', (done) => {
      var clientServerOptions = {
        uri: 'https://localhost:8765/energy/api/DayAheadTotalLoadForecast/Greece/PT60M/date/2018-01-04?format=json',
        headers: {
          'X-OBSERVATORY-AUTH' : 'unauthorized'
        },
        requestCert: true,
        rejectUnauthorized: false,
        agent: false
      }
      request(clientServerOptions, function (error, response, body) {
        expect(response.statusCode).to.equal(401);
      });
      done();
    });
    it('/Greece/PT60M/date/2018-01-04/ (Bad request) - Should GET status code 400', (done) => {
      var clientServerOptions = {
        uri: 'https://localhost:8765/energy/api/DayAheadTotalLoadForecast/Greece/PT60M/date/2018-01-04?format=jso',
        headers: {
          'X-OBSERVATORY-AUTH' : getToken()
        },
        requestCert: true,
        rejectUnauthorized: false,
        agent: false
      }
      request(clientServerOptions, function (error, response, body) {
        expect(response.statusCode).to.equal(400);
      });
      done();
    });
  });
});
