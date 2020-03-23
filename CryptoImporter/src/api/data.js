var express = require('express');
var router = express.Router();
var importer = require('../services/importer');

/* GET show last crypto data */
// router.get('/', (req, res, next) => {
//   importer.getLastDataFromDb((response) => {
//     res.render('index');
//     // res.send('test');
//   });
// });

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET instert crypto data to db */
router.get('/insertNew', (req, res, next) => {
  importer.getDataAndInsertToDb((response) => {
    res.send(response)
  });
});

module.exports = router;
