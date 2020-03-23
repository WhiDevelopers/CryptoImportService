var express = require('express');
var router = express.Router();
var importer = require('../services/importer');

/* GET show last crypto data */
router.get('/', (req, res, next) => {
  importer.getLastDataFromDb((err, dataJson) => {
    console.log('data: ' + dataJson[0].name)
    if (err) {
      res.send(err);
    } else {
      res.render('datalist', { 
        title: "Data",
        data: dataJson
       });
    }
  });
});

/* GET instert crypto data to db */
router.get('/insertNew', (req, res, next) => {
  importer.getDataAndInsertToDb((response) => {
    res.send(response)
  });
});

module.exports = router;
