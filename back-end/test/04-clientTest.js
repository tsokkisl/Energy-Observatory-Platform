const assert = require('chai').assert;

function main(line) {
  let args = line.split(' ');
  if (args[0] == 'energy_group63') {
    if (args[1] == 'Admin') {
      // check scopes
      if (args[2] == '--newuser' && args[4] == '--passw' && args[6] == '--email' && args[8] == '--quota') {
        if (args.length != 10) return "Invalid command format";
        else return "Calling newuser('https://localhost:8765/energy/api/Admin/users', { 'username': '" + args[3] + "', 'password': '" + args[5] + "', 'email': '" + args[7] + "', 'quota': '" + args[9] + "' })";
      }
      else if (args[2] == '--userstatus') {
        if (args.length != 4) return "Invalid command format";
        else return "Calling userstatus('https://localhost:8765/energy/api/Admin/users/" + args[3] + "')";
      }
      else if (args[2] == '--moduser' && args[4] == '--passw' && args[6] == '--email' && args[8] == '--quota') {
        if (args.length != 10) return "Invalid command format";
        else return "Calling moduser('https://localhost:8765/energy/api/Admin/users/" + args[3] + "', { 'password': '" + args[5] + "', 'email': '" + args[7] + "', 'quota': '" + args[9] + "' })";
      }
      else if (args[2] == '--newdata' && args[4] == '--source') {
        if (args.length != 6) return "Invalid command format";
        else return "Calling newdata('https://localhost:8765/energy/api/Admin/" + args[3] + "', '" + args[5] + "')";
      }
      else return "Invalid command format";;
    }
    else if ((args[1] == 'ActualTotalLoad' || args[1] == 'DayAheadTotalLoadForecast' || args[1] == 'AggregatedGenerationPerType' || args[1] == 'ActualvsForecast') && (args[2] == '--area' && args[4] == '--timeres')) {
      // no date no format no type
      if (args.length == 6) {
        let url = "https://localhost:8765/energy/api/" + args[1] + "/" + args[3] + "/" + args[5] + "/date";
        return "Calling fetchData('" + url + "')";
      } // no format yes date no type
      else if (args.length == 8 && args.indexOf('--format') == -1 && (args[6] == '--date' || args[6] == '--month' || args[6] == '--year')) {
        let url = "https://localhost:8765/energy/api/" + args[1] + "/" + args[3] + "/" + args[5] + "/" + args[6].substring(2) + "/" + args[7];
        return "Calling fetchData('" + url + "')";
      } // yes format no date no type
      else if (args.length == 8 && args[6] == '--format' && (args.indexOf('--date') == -1 || args.indexOf('--month') == -1 || args.indexOf('--year') == -1)) {
        let url = "https://localhost:8765/energy/api/" + args[1] + "/" + args[3] + "/" + args[5] + "/date";
        url += '?format=' + args[7];
        return "Calling fetchData('" + url + "')";
      } // yes format yes date no type
      else if (args.length == 10 && args[8] == '--format' && (args[6] == '--date' || args[6] == '--month' || args[6] == '--year')) {
        let url = "https://localhost:8765/energy/api/" + args[1] + "/" + args[3] + "/" + args[5] + "/" + args[6].substring(2) +  "/" + args[7];
        url += '?format=' + args[9];
        return "Calling fetchData('" + url + "')";
      } // no format no date yes type
      else if (args.length == 8 && args.indexOf('--format') == -1 && args[6] == '--prodtype' && (args.indexOf('--date') == -1 || args.indexOf('--month') == -1 || args.indexOf('--year') == -1)){
        let url = "https://localhost:8765/energy/api/" + args[1] + "/" + args[3] + "/" + args[7] + "/" + args[5] + "/date";
        return "Calling fetchData('" + url + "')";
      } // no format yes date yes type
      else if (args.length == 10 && args.indexOf('--format') == -1 && args[6] == '--prodtype' && (args[8] == '--date' || args[8] == '--month' || args[8] == '--year')) {
        let url = "https://localhost:8765/energy/api/" + args[1] + "/" + args[3] + "/" + args[7] + "/" + args[5] + "/" + args[8].substring(2) +  "/" + args[9];
        return "Calling fetchData('" + url + "')";
      } // yes format no date yes type
      else if (args.length == 10 && args[8] == '--format' && args[6] == '--prodtype' && (args.indexOf('--date') == -1 || args.indexOf('--month') == -1 || args.indexOf('--year') == -1)) {
        let url = "https://localhost:8765/energy/api/" + args[1] + "/" + args[3] + "/" + args[7] + "/" + args[5] + "/date";
        url += '?format=' + args[9];
        return "Calling fetchData('" + url + "')";
      } // yes format yes date yes type
      else if (args.length == 12 && args[10] == '--format' && args[6] == '--prodtype' && (args[8] == '--date' || args[8] == '--month' || args[8] == '--year')) {
        let url = "https://localhost:8765/energy/api/" + args[1] + "/" + args[3] + "/" + args[7] + "/" + args[5] + "/" + args[8].substring(2) +  "/" + args[9];
        url += '?format=' + args[11];
        return "Calling fetchData('" + url + "')";
      }
      else return "Invalid command format";;
    }
    else if (args[1] == 'HealthCheck') return "Calling healthCheck('https://localhost:8765/energy/api/HealthCheck')";
    else if (args[1] == 'Reset')  return "Calling reset('https://localhost:8765/energy/api/Reset')";
    else if (args[1] == 'Login' && args[2] == '--username' && args[4] == '--passw') return "Calling login('https://localhost:8765/energy/api/Login', '" + args[3] + "', '" + args[5] + "')";
    else if (args[1] == 'Logout') return "Calling logout('https://localhost:8765/energy/api/Logout')";
    else return "Invalid command format";
  }
  else if (args[0] == 'clear') return "Calling console.clear()";
  else if (args[0] == 'help') return "Calling cliManual()";
  else return "Invalid command format";
}

describe('Client Tests', () => {
  //Admin commands Tests
  describe('Client Admin commands', () => {
    it('--newuser - Should call newuser function', () => {
      assert.equal(main("energy_group63 Admin --newuser test --passw 123 --email test@mail.com --quota 1000"), "Calling newuser('https://localhost:8765/energy/api/Admin/users', { 'username': 'test', 'password': '123', 'email': 'test@mail.com', 'quota': '1000' })");
    });
    it('--newuser - Should return message for invalid command', () => {
      assert.equal(main("energy_group63 Admin --newuser test --passw 123 --email test@mail.com--quota 1000"), "Invalid command format");
    });
    it('--userstatus - Should call userstatus function', () => {
      assert.equal(main("energy_group63 Admin --userstatus admin"), "Calling userstatus('https://localhost:8765/energy/api/Admin/users/admin')");
    });
    it('--userstatus - Should return message for invalid command', () => {
      assert.equal(main("energy_group63 Admin --userstatusadmin"), "Invalid command format");
    });
    it('--moduser - Should call moduser function', () => {
      assert.equal(main("energy_group63 Admin --moduser test --passw 1234 --email test2@mail.com --quota 800"), "Calling moduser('https://localhost:8765/energy/api/Admin/users/test', { 'password': '1234', 'email': 'test2@mail.com', 'quota': '800' })");
    });
    it('--moduser - Should return message for invalid command', () => {
      assert.equal(main("energy_group63Admin --moduser test --passw 1234 --email test2@mail.com --quota 800"), "Invalid command format");
    });
    it('--newdata - Should call newdata function', () => {
      assert.equal(main("energy_group63 Admin --newdata ActualTotalLoad --source newdata/ActualTotalLoad-10days.csv"), "Calling newdata('https://localhost:8765/energy/api/Admin/ActualTotalLoad', 'newdata/ActualTotalLoad-10days.csv')");
    });
    it('--newdata - Should return message for invalid command', () => {
      assert.equal(main("energy_group63 Admin --newdata ActualTotalLoad --sourcenewdata/ActualTotalLoad-10days.csv"), "Invalid command format");
    });
  });
  //Basic commands Tests
  describe('Client base commands', () => {
    it('HealthCheck - Should call healthCheck function', () => {
      assert.equal(main("energy_group63 HealthCheck"), "Calling healthCheck('https://localhost:8765/energy/api/HealthCheck')");
    });
    it('HealthCheck - Should return message for invalid command', () => {
      assert.equal(main("energy_group63HealthCheck"), "Invalid command format");
    });
    it('Reset - Should call reset function', () => {
      assert.equal(main("energy_group63 Reset"), "Calling reset('https://localhost:8765/energy/api/Reset')");
    });
    it('Reset - Should return message for invalid command', () => {
      assert.equal(main("energy_group63Reset"), "Invalid command format");
    });
    it('Login - Should call login function', () => {
      assert.equal(main("energy_group63 Login --username test --passw 123"), "Calling login('https://localhost:8765/energy/api/Login', 'test', '123')");
    });
    it('Login - Should return message for invalid command', () => {
      assert.equal(main("energy_group63 Login --username test --passw123"), "Invalid command format");
    });
    it('Logout - Should call logout function', () => {
      assert.equal(main("energy_group63 Logout"), "Calling logout('https://localhost:8765/energy/api/Logout')");
    });
    it('Logout - Should return message for invalid command', () => {
      assert.equal(main("energy_group63Logout"), "Invalid command format");
    });
  });
  //Data fetch commands Tests
  describe('Client data fetech commands', () => {
    it('ActualTotalLoad - Should call fetchData function', () => {
      assert.equal(main("energy_group63 ActualTotalLoad --area Greece --timeres PT60M"), "Calling fetchData('https://localhost:8765/energy/api/ActualTotalLoad/Greece/PT60M/date')");
    });
    it('ActualTotalLoad - Should call fetchData function', () => {
      assert.equal(main("energy_group63 ActualTotalLoad --area Greece --timeres PT60M --date 2018-01-04"), "Calling fetchData('https://localhost:8765/energy/api/ActualTotalLoad/Greece/PT60M/date/2018-01-04')");
    });
    it('ActualTotalLoad - Should call fetchData function', () => {
      assert.equal(main("energy_group63 ActualTotalLoad --area Greece --timeres PT60M --format json"), "Calling fetchData('https://localhost:8765/energy/api/ActualTotalLoad/Greece/PT60M/date?format=json')");
    });
    it('ActualTotalLoad - Should call fetchData function', () => {
      assert.equal(main("energy_group63 ActualTotalLoad --area Greece --timeres PT60M --date 2018-01-04 --format json"), "Calling fetchData('https://localhost:8765/energy/api/ActualTotalLoad/Greece/PT60M/date/2018-01-04?format=json')");
    });
    it('AggregatedGenerationPerType - Should call fetchData function', () => {
      assert.equal(main("energy_group63 AggregatedGenerationPerType --area Greece --timeres PT60M --prodtype 1"), "Calling fetchData('https://localhost:8765/energy/api/AggregatedGenerationPerType/Greece/1/PT60M/date')");
    });
    it('AggregatedGenerationPerType - Should call fetchData function', () => {
      assert.equal(main("energy_group63 AggregatedGenerationPerType --area Greece --timeres PT60M --prodtype 1 --date 2018-01-04"), "Calling fetchData('https://localhost:8765/energy/api/AggregatedGenerationPerType/Greece/1/PT60M/date/2018-01-04')");
    });
    it('AggregatedGenerationPerType - Should call fetchData function', () => {
      assert.equal(main("energy_group63 AggregatedGenerationPerType --area Greece --timeres PT60M --prodtype 1 --format json"), "Calling fetchData('https://localhost:8765/energy/api/AggregatedGenerationPerType/Greece/1/PT60M/date?format=json')");
    });
    it('AggregatedGenerationPerType - Should call fetchData function', () => {
      assert.equal(main("energy_group63 AggregatedGenerationPerType --area Greece --timeres PT60M --prodtype 1 --date 2018-01-04 --format json"), "Calling fetchData('https://localhost:8765/energy/api/AggregatedGenerationPerType/Greece/1/PT60M/date/2018-01-04?format=json')");
    });
    it('AggregatedGenerationPerType - Should return message for invalid command', () => {
      assert.equal(main("energy_group63 AggregatedGenerationPerType --area Greece --timeres PT60M --prodtype 1 --format json --date 2018-01-04 "), "Invalid command format");
    });
  });
});    
