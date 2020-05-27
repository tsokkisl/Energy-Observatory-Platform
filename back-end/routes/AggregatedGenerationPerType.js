const express = require('express')
const router = express.Router()
const connection = require('../server').connection;
const { checkForResources } = require('../utils/resources');
const { useAPIResource } = require('../utils/resources');
const { resetQuota } = require('../utils/resources');
const { sendData } = require('../utils/response');
const { deleteFile } = require('../utils/deletefile');
const { isAuthenticated } = require('../middlewares/auth');

//get data on server date
router.get('/:areaName/:productionType/:resolution/date/', isAuthenticated, resetQuota, checkForResources, (req, res) => {
  let date = new Date();
  let condition = "' AND a.ProductionTypeId = '" + req.params.productionType;
  if (req.params.productionType === 'AllTypes') condition = "";
  connection.query("SELECT Id FROM resolutioncode WHERE ResolutionCodeText = '" + req.params.resolution + "'", function (err, result, fields) {
    if (result.length == 0 || result == undefined) {
      res.sendStatus(400);
      deleteFile();
      return;
    }
    connection.query("SELECT a.*, b.AreaTypeCodeText, c.MapCodeText, d.ResolutionCodeText, e.ProductionTypeText FROM aggregatedgenerationpertype a join areatypecode b on a.AreaTypeCodeId = b.Id join mapcode c on a.MapCodeId = c.Id join resolutioncode d on a.ResolutionCodeId = d.Id join productiontype e on a.ProductionTypeId = e.Id WHERE a.AreaName = '" + req.params.areaName + condition + "' AND a.ResolutionCodeId = '" + result[0].Id + "' AND a.Year = '" + date.getFullYear() + "' AND a.Month = '" + date.getMonth() + 1 +
    "' AND a.Day = '" + date.getDate() + "' ORDER BY a.DateTime ASC", function (err, result, fields) {
      if (err) throw err;
      let data = [];
      if (result.length == 0 || result == undefined) {
        sendData(req, res, null);
        deleteFile();
        return;
      }
      else {
        for (var x in result) {
          data.push({ "Source" : "entso-e", "Dataset" : "AggregatedGenerationPerType", "AreaName" : result[x].AreaName, "AreaTypeCode" : result[x].AreaTypeCodeText, "MapCode" : result[x].MapCodeText,
          "ResolutionCode" : result[x].ResolutionCodeText, "Year" : result[x].Year, "Month" : result[x].Month, "Day" : result[x].Day, "DateTimeUTC" : result[x].DateTime,
          "ProductionType" : result[x].ProductionTypeText, "ActualGenerationOutputValue" : result[x].ActualGenerationOutput, "UpdateTimeUTC" : result[x].UpdateTime  });
        }
        sendData(req, res, data);
      }
      useAPIResource(JSON.parse(localStorage.getItem('authUser'))['username']);
    });
  });
});

//get data on given date
router.get('/:areaName/:productionType/:resolution/date/:date/', isAuthenticated, resetQuota, checkForResources, (req, res) => {
  let date = req.params.date.split('-');
  if (date.length != 3) res.sendStatus(400)
  else {
    let year = date[0];
    let month = date[1];
    let day = date[2];
    let condition = "' AND a.ProductionTypeId = '" + req.params.productionType;
    if (req.params.productionType === 'AllTypes') condition = "";
    connection.query("SELECT Id FROM resolutioncode WHERE ResolutionCodeText = '" + req.params.resolution + "'", function (err, result, fields) {
      if (result.length == 0 || result == undefined) {
        res.sendStatus(400);
        deleteFile();
        return;
      }
      connection.query("SELECT a.*, b.AreaTypeCodeText, c.MapCodeText, d.ResolutionCodeText, e.ProductionTypeText FROM aggregatedgenerationpertype a join areatypecode b on a.AreaTypeCodeId = b.Id join mapcode c on a.MapCodeId = c.Id join resolutioncode d on a.ResolutionCodeId = d.Id join productiontype e on a.ProductionTypeId = e.Id WHERE a.AreaName = '" + req.params.areaName + condition + "' AND a.ResolutionCodeId = '" + result[0].Id + "' AND a.Year = '" + year + "' AND a.Month = '" + month +
      "' AND a.Day = '" + day + "' ORDER BY a.DateTime ASC", function (err, result, fields) {
        if (err) throw err;
        let data = [];
        if (result.length == 0 || result == undefined) {
          sendData(req, res, null);
          deleteFile();
          return;
        }
        else {
          for (var x in result) {
            data.push({ "Source" : "entso-e", "Dataset" : "AggregatedGenerationPerType", "AreaName" : result[x].AreaName, "AreaTypeCode" : result[x].AreaTypeCodeText, "MapCode" : result[x].MapCodeText,
            "ResolutionCode" : result[x].ResolutionCodeText, "Year" : result[x].Year, "Month" : result[x].Month, "Day" : result[x].Day, "DateTimeUTC" : result[x].DateTime,
            "ProductionType" : result[x].ProductionTypeText, "ActualGenerationOutputValue" : result[x].ActualGenerationOutput, "UpdateTimeUTC" : result[x].UpdateTime });
          }
          sendData(req, res, data);
        }
        useAPIResource(JSON.parse(localStorage.getItem('authUser'))['username']);
      });
    });
  }
});

//get data per day
router.get('/:areaName/:productionType/:resolution/month/:date/', isAuthenticated, resetQuota, checkForResources, (req, res) => {
  let date = req.params.date.split('-');
  if (date.length != 2) res.sendStatus(400);
  else {
    let year = date[0];
    let month = date[1];
    let condition1 = "' AND a.ProductionTypeId = '" + req.params.productionType;
    let condition2 = "' GROUP BY a.Day";
    if (req.params.productionType === 'AllTypes') {
      condition1 = "";
      condition2 = "' GROUP BY a.Day, a.ProductionTypeId";
    }
    connection.query("SELECT Id FROM resolutioncode WHERE ResolutionCodeText = '" + req.params.resolution + "'", function (err, result, fields) {
      if (result.length == 0 || result == undefined) {
        res.sendStatus(400);
        deleteFile();
        return;
      }
      connection.query("SELECT a.*, SUM(a.ActualGenerationOutput) as sumPerDay, b.AreaTypeCodeText, c.MapCodeText, d.ResolutionCodeText, e.ProductionTypeText FROM aggregatedgenerationpertype a join areatypecode b on a.AreaTypeCodeId = b.Id join mapcode c on a.MapCodeId = c.Id join resolutioncode d on a.ResolutionCodeId = d.Id join productiontype e on a.ProductionTypeId = e.Id WHERE a.AreaName = '" + req.params.areaName + condition1 + "' AND a.ResolutionCodeId = '" + result[0].Id + "' AND a.Year = '" + year + "' AND a.Month = '" + month +
      condition2 + " ORDER BY a.DateTime ASC", function (err, result, fields) {
        if (err) throw err;
        let data = [];
        if (result.length == 0 || result == undefined) {
          sendData(req, res, null);
          deleteFile();
          return;
        }
        else {
          for (var x in result) {
            data.push({ "Source" : "entso-e", "Dataset" : "AggregatedGenerationPerType", "AreaName" : result[x].AreaName, "AreaTypeCode" : result[x].AreaTypeCodeText, "MapCode" : result[x].MapCodeText,
            "ResolutionCode" : result[x].ResolutionCodeText, "Year" : result[x].Year, "Month" : result[x].Month, "Day" : result[x].Day, "ProductionType" : result[x].ProductionTypeText,
            "ActualGenerationOutputByDayValue" : result[x].sumPerDay });
          }
          sendData(req, res, data);
        }
        useAPIResource(JSON.parse(localStorage.getItem('authUser'))['username']);
      });
    });
  }
});

//get data per month
router.get('/:areaName/:productionType/:resolution/year/:date/', isAuthenticated, resetQuota, checkForResources, (req, res) => {
  let date = req.params.date.split('-');
  if (date.length != 1) res.sendStatus(400);
  else {
    let year = req.params.date;
    let condition1 = "' AND a.ProductionTypeId = '" + req.params.productionType;
    let condition2 = "' GROUP BY a.Month";
    if (req.params.productionType === 'AllTypes') {
      condition1 = "";
      condition2 = "' GROUP BY a.Month, a.ProductionTypeId";
    }
    connection.query("SELECT Id FROM resolutioncode WHERE ResolutionCodeText = '" + req.params.resolution + "'", function (err, result, fields) {
      if (result.length == 0 || result == undefined) {
        res.sendStatus(400);
        deleteFile();
        return;
      }
      connection.query("SELECT a.*, SUM(a.ActualGenerationOutput) as sumPerMonth, b.AreaTypeCodeText, c.MapCodeText, d.ResolutionCodeText, e.ProductionTypeText FROM aggregatedgenerationpertype a join areatypecode b on a.AreaTypeCodeId = b.Id join mapcode c on a.MapCodeId = c.Id join resolutioncode d on a.ResolutionCodeId = d.Id join productiontype e on a.ProductionTypeId = e.Id WHERE a.AreaName = '" + req.params.areaName + condition1 + "' AND a.ResolutionCodeId = '" + result[0].Id + "' AND a.Year = '" + year +
      condition2 + " ORDER BY a.DateTime ASC", function (err, result, fields) {
        if (err) throw err;
        let data = [];
        if (result.length == 0 || result == undefined) {
          sendData(req, res, null);
          deleteFile();
          return;
        }
        else {
          for (var x in result) {
            data.push({ "Source" : "entso-e", "Dataset" : "AggregatedGenerationPerType", "AreaName" : result[x].AreaName, "AreaTypeCode" : result[x].AreaTypeCodeText, "MapCode" : result[x].MapCodeText,
            "ResolutionCode" : result[x].ResolutionCodeText, "Year" : result[x].Year, "Month" : result[x].Month, "ProductionType" : result[x].ProductionTypeText,
            "ActualGenerationOutputByMonthValue" : result[x].sumPerMonth });
          }
          sendData(req, res, data);
        }
        useAPIResource(JSON.parse(localStorage.getItem('authUser'))['username']);
      });
    });
  }
});

//bad requests
router.get('/*', isAuthenticated, resetQuota, checkForResources, (req, res, next) => {
  res.sendStatus(400);
});

module.exports = router
