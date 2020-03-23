var express = require('express');
var router = express.Router();
var importer = require('../services/importer');

/* GET users listing. */
router.get('/latest', (req, res, next) => {
  importer.getDataAndInsertToDb((response) => {
      res.send(response)
  });
});

module.exports = router;
