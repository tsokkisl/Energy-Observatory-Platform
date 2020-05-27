module.exports = {
  genApiKey: function(arr) {
    let key = '';
    let chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let flag = true;
    while(flag) {
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 4; j++) key += chars.charAt(Math.floor(Math.random() * chars.length));
        key += '-';
      }
      key = key.slice(0, -1);
      if (arr.indexOf(key) == -1) flag = false;
    }
    return key;
  }
};
