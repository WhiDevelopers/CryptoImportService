var express = require('express');
var router = express.Router();
var importer = require('../services/importer');

/* GET | show last crypto data */
router.get('/', (req, res, next) => {
    importer.getLastDataFromDb((json) => {
        res.render('datalist', {
            title: "Data",
            data: json
        });
    }, (err) => {
        res.send(err);
    });
});

/* GET | download crypto data and insert to db */
router.get('/insertNew', (req, res, next) => {
    importer.getDataAndInsertToDb(() => {
        res.send('Data inserted')
    }, (err) => {
        res.send(err)
    });
});

module.exports = router;