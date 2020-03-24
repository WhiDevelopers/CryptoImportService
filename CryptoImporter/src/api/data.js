var express = require('express');
var router = express.Router();
var networking = require('../services/networking');
var database = require('../services/database').database;

/* GET | show last crypto data */
router.get('/', (req, res, next) => {
    database.getLastDataFromDb((json) => {
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
    networking.getDataAndInsertToDb(() => {
        res.send('Data inserted')
    }, (err) => {
        res.send(err)
    });
});

module.exports = router;