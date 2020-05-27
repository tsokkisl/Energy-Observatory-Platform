module.exports = {
  createCSV: function(obj) {
    const arr = typeof obj !== 'object' ? JSON.parse(obj) : obj;
    let str = `${Object.keys(arr[0]).map(value => `"${value}"`).join(",")}` + '\r\n';

    return arr.reduce((str, next) => {
      str += `${Object.values(next).map(value => `"${value}"`).join(",")}` + '\r\n';
      return str;
    }, str);
  }
};
