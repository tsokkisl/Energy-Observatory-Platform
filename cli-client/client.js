const readline = require('readline');
var request = require('request');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

function getToken() {
  if (fs.existsSync('softeng19bAPI.token')) return fs.readFileSync('softeng19bAPI.token','utf8');
  else return 'unauthorized';
}

function newuser(url, data) {
  var clientServerOptions = {
    uri: url,
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
  request(clientServerOptions, function (error, response) {
    console.clear();
    if (error) console.log(error);
    else if (response.statusCode == 401) console.log("Error 401 - Unauthorized");
    else console.log(JSON.parse(response.body));
    return;
  });
}

function moduser(url, data) {
  var clientServerOptions = {
    uri: url,
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
  request(clientServerOptions, function (error, response) {
    console.clear();
    if (error) console.log(error);
    else if (response.statusCode == 401) console.log("Error 401 - Unauthorized");
    else console.log(JSON.parse(response.body));
    return;
  });
}

function userstatus(url) {
  var clientServerOptions = {
    uri: url,
    headers: {
      'X-OBSERVATORY-AUTH' : getToken()
    },
    requestCert: true,
    rejectUnauthorized: false,
    agent: false
  }
  request(clientServerOptions, function (error, response, body) {
    console.clear();
    if (error) console.log(error);
    else if (response.statusCode == 401) console.log("Error 401 - Unauthorized");
    else console.log(JSON.parse(body));
    return;
  });
}

function newdata(url, f) {
  var clientServerOptions = {
    uri: url,
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
      'X-OBSERVATORY-AUTH' : getToken()
    },
    formData : {
      file : fs.createReadStream(f),
      filetype: 'csv'
    },
    requestCert: true,
    rejectUnauthorized: false,
    agent: false
  }
  request(clientServerOptions, function (error, response, body) {
    console.clear();
    if (error) console.log(error);
    else if (response.statusCode == 401) console.log("Error 401 - Unauthorized");
    else console.log(JSON.parse(body));
    return;
  });
}

function fetchData(url) {
  var clientServerOptions = {
    uri: url,
    headers: {
      'X-OBSERVATORY-AUTH' : getToken()
    },
    requestCert: true,
    rejectUnauthorized: false,
    agent: false
  }
  request(clientServerOptions, function (error, response, body) {
    console.clear();
    console.log('___________________________________________________________________________________\n');
    if (response.statusCode == 401) console.log("Error 401 - Unauthorized");
    else if (response.statusCode == 402) console.log("Error 402 - Out of quota");
    else if (response.statusCode == 400) console.log("Error 400 - Bad request");
    else if (response.headers["content-type"] == "text/csv; charset=utf-8") console.log(body);
    else if (response.headers["content-type"] == "application/json; charset=utf-8") console.log(JSON.parse(body));
  });
}

function healthCheck(url) {
  var clientServerOptions = {
    uri: url,
    requestCert: true,
    rejectUnauthorized: false,
    agent: false
  }
  request(clientServerOptions, function (error, response, body) {
    console.clear();
    if (error) console.log(error);
    else console.log(JSON.parse(body));
    return;
  });
}

function reset(url) {
  var clientServerOptions = {
    uri: url,
    method: 'POST',
    requestCert: true,
    rejectUnauthorized: false,
    agent: false
  }
  request(clientServerOptions, function (error, response, body) {
    console.clear();
    if (error) console.log(error);
    else console.log(JSON.parse(response.body));
    return;
  });
}

function login(url, username, password) {
  var clientServerOptions = {
    uri: url,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-OBSERVATORY-AUTH' : JSON.stringify({ "username" : username, "password" : password })
    },
    requestCert: true,
    rejectUnauthorized: false,
    agent: false
  }
  request(clientServerOptions, function (error, response, body) {
    console.clear();
    if (error) console.log(error);
    else if (response.statusCode == 401) console.log("Incorrect username/password combination... Please try again!");
    else if (response.statusCode == 400) console.log("You must be logged out in order to perform this action");
    else {
      fs.writeFileSync('softeng19bAPI.token', JSON.parse(body)['token'], 'utf8', () => {});
      console.log("Welcome");
    }
    return;
  });
}

function logout(url) {
  var clientServerOptions = {
    uri: url,
    method: 'POST',
    headers: {
      'X-OBSERVATORY-AUTH' : getToken()
    },
    requestCert: true,
    rejectUnauthorized: false,
    agent: false
  }
  request(clientServerOptions, function (error, response) {
    console.clear();
    if (error) console.log(error);
    else {
      if (fs.existsSync('softeng19bAPI.token')) fs.unlinkSync('softeng19bAPI.token');
      if (response.statusCode == 200) console.log("You have been logged out");
    }
    return;
  });
}

function cliManual() {
  console.clear();
  console.log("CLI Manual\n________________________________________\n\n" +
  "Data requests with dataset = ActualTotalLoad|ActualvsForecast|DayAheadTotalLoadForecast\n" +
  "_______________________________________________________________________________________\n\n" +
  "energy_group63 'dataset' --area 'area' --timeres 'timeres' [--date 'YYYY-MM-DD' --format 'formattype']\n" +
  "energy_group63 'dataset' --area 'area' --timeres 'timeres' [--month 'YYYY-MM' --format 'formattype']\n" +
  "energy_group63 'dataset' --area 'area' --timeres 'timeres' [--year 'YYYY' --format 'formattype']\n" +
  "energy_group63 'dataset' --area 'area' --timeres 'timeres' [--format 'formattype']\n\n" +
  "Data requests with dataset = AggregatedGenerationPerType\n" +
  "________________________________________________________\n\n" +
  "energy_group63 'dataset' --area 'area' --timeres 'timeres' --prodtype 'productiontype' [--date 'YYYY-MM-DD' --format 'formattype' ]\n" +
  "energy_group63 'dataset' --area 'area' --timeres 'timeres' --prodtype 'productiontype' [--month 'YYYY-MM' --format 'formattype' ]\n" +
  "energy_group63 'dataset' --area 'area' --timeres 'timeres' --prodtype 'productiontype' [--year 'YYYY' --format 'formattype' ]\n" +
  "energy_group63 'dataset' --area 'area' --timeres 'timeres' --prodtype 'productiontype' [--format 'formattype']\n\n" +
  "Admin commands\n" +
  "______________\n\n" +
  "energy_group63 Admin --newuser 'username' --passw 'password' --email 'email' --quota 'quota'\n" +
  "energy_group63 Admin --userstatus 'username' ]\n" +
  "energy_group63 Admin --moduser 'username' --passw 'password' --email 'email' --quota 'quota'\n" +
  "energy_group63 Admin --newdata 'dataset' --source 'sourcefile'\n\n" +
  "General Commands\n" +
  "________________\n\n" +
  "energy_group63 Login --username test --passw 123\n" +
  "energy_group63 Logout\n" +
  "energy_group63 HealthCheck\n" +
  "energy_group63 Reset\n" +
  "clear\n" +
  "help");
}

function invalidCommand() {
  console.clear();
  console.log("Invalid command... Please type 'help' to read the CLI Manual.");
}

function main() {
  console.log("Enter command : \n")
  rl.on('line', function (line) {
    let args = line.split(' ');
    if (args[0] == 'energy_group63') {
      if (args[1] == 'Admin') {
        // check scopes
        if (args[2] == '--newuser' && args[4] == '--passw' && args[6] == '--email' && args[8] == '--quota') {
          if (args.length != 10) invalidCommand();
          else newuser("https://localhost:8765/energy/api/Admin/users", { "username": args[3], "password": args[5], "email": args[7], "quota": args[9] });
        }
        else if (args[2] == '--userstatus') {
          if (args.length != 4) invalidCommand();
          else userstatus("https://localhost:8765/energy/api/Admin/users/" + args[3]);
        }
        else if (args[2] == '--moduser' && args[4] == '--passw' && args[6] == '--email' && args[8] == '--quota') {
          if (args.length != 10) invalidCommand();
          else moduser("https://localhost:8765/energy/api/Admin/users/" + args[3], { "password": args[5], "email": args[7], "quota": args[9] });
        }
        else if (args[2] == '--newdata' && args[4] == '--source') {
          if (args.length != 6) invalidCommand();
          else newdata("https://localhost:8765/energy/api/Admin/" + args[3], args[5]);
        }
        else invalidCommand();
      }
      else if ((args[1] == 'ActualTotalLoad' || args[1] == 'DayAheadTotalLoadForecast' || args[1] == 'AggregatedGenerationPerType' || args[1] == 'ActualvsForecast') && (args[2] == '--area' && args[4] == '--timeres')) {
        // no date no format no type
        if (args.length == 6) {
          let url = "https://localhost:8765/energy/api/" + args[1] + "/" + args[3] + "/" + args[5] + "/date";
          fetchData(url);
        } // no format yes date no type
        else if (args.length == 8 && args.indexOf('--format') == -1 && (args[6] == '--date' || args[6] == '--month' || args[6] == '--year')) {
          let url = "https://localhost:8765/energy/api/" + args[1] + "/" + args[3] + "/" + args[5] + "/" + args[6].substring(2) + "/" + args[7];
          fetchData(url);
        } // yes format no date no type
        else if (args.length == 8 && args[6] == '--format' && (args.indexOf('--date') == -1 || args.indexOf('--month') == -1 || args.indexOf('--year') == -1)) {
          let url = "https://localhost:8765/energy/api/" + args[1] + "/" + args[3] + "/" + args[5] + "/date";
          url += '?format=' + args[7];
          fetchData(url);
        } // yes format yes date no type
        else if (args.length == 10 && args[8] == '--format' && (args[6] == '--date' || args[6] == '--month' || args[6] == '--year')) {
          let url = "https://localhost:8765/energy/api/" + args[1] + "/" + args[3] + "/" + args[5] + "/" + args[6].substring(2) +  "/" + args[7];
          url += '?format=' + args[9];
          fetchData(url);
        } // no format no date yes type
        else if (args.length == 8 && args.indexOf('--format') == -1 && args[6] == '--prodtype' && (args.indexOf('--date') == -1 || args.indexOf('--month') == -1 || args.indexOf('--year') == -1)) {
          let url = "https://localhost:8765/energy/api/" + args[1] + "/" + args[3] + "/" + args[7] + "/" + args[5] + "/date";
          fetchData(url);
        } // no format yes date yes type
        else if (args.length == 10 && args.indexOf('--format') == -1 && args[6] == '--prodtype' && (args[8] == '--date' || args[8] == '--month' || args[8] == '--year')) {
          let url = "https://localhost:8765/energy/api/" + args[1] + "/" + args[3] + "/" + args[7] + "/" + args[5] + "/" + args[8].substring(2) +  "/" + args[9];
          fetchData(url);
        } // yes format no date yes type
        else if (args.length == 10 && args[8] == '--format' && args[6] == '--prodtype' && (args.indexOf('--date') == -1 || args.indexOf('--month') == -1 || args.indexOf('--year') == -1)) {
          let url = "https://localhost:8765/energy/api/" + args[1] + "/" + args[3] + "/" + args[7] + "/" + args[5] + "/date";
          url += '?format=' + args[9];
          fetchData(url);
        } // yes format yes date yes type
        else if (args.length == 12 && args[10] == '--format' && args[6] == '--prodtype' && (args[8] == '--date' || args[8] == '--month' || args[8] == '--year')) {
          let url = "https://localhost:8765/energy/api/" + args[1] + "/" + args[3] + "/" + args[7] + "/" + args[5] + "/" + args[8].substring(2) +  "/" + args[9];
          url += '?format=' + args[11];
          fetchData(url);
        }
        else invalidCommand();
      }
      else if (args[1] == 'HealthCheck') healthCheck('https://localhost:8765/energy/api/HealthCheck');
      else if (args[1] == 'Reset') reset('https://localhost:8765/energy/api/Reset');
      else if (args[1] == 'Login' && args[2] == '--username' && args[4] == '--passw') login('https://localhost:8765/energy/api/Login', args[3], args[5]);
      else if (args[1] == 'Logout') logout('https://localhost:8765/energy/api/Logout');
      else invalidCommand();
    }
    else if (args[0] == 'clear') console.clear();
    else if (args[0] == 'help') cliManual();
    else invalidCommand();
  });
}

main()
