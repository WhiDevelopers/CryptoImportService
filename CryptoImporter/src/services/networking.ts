import { database } from './database';
const https = require('https');
const config = require('../config/conf')
const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?CMC_PRO_API_KEY=${config.COINMARKETCAP_API_KEY}&start=1&limit=50`;

export function getDataAndInsertToDb(onSuccess, onFail) {
    getCryptoJsonFromWeb((json) => {
        database.insertDataToDb(json, () => {
            onSuccess();
        }, (err) => {
            onFail(err); // insert to db failed
        });
    }, (err) => {
        onFail(err); // get data from web failed
    });
}

export function startDataUpdateInterval() {
    function updateData() {
        var today = new Date();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

        getDataAndInsertToDb(() => {
            console.log(time + " - Data inserted");
        }, (err) => {
            console.log(time + ` - Crypto data get failed: ${err}`);
        });
    }

    updateData();
    setInterval(updateData, config.DATA_REQUEST_INTERVAL_TIME);
}

function getCryptoJsonFromWeb(onSuccess, onFail) {
    https.get(url, (resp) => {
        let data = '';

        resp.on('data', (chunk) => {
            data += chunk; // A chunk of data has been recieved.
        });

        resp.on('end', () => { // The whole response has been received.
            var json = JSON.parse(data); // FIXME parse might fail
            onSuccess(json);
        });
    }).on("error", err => {
        console.log("Error getting json crypto data: " + err.message);
        onFail(err);
    });
}
