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

function convertJson(onSuccess, jsonArray) {
    for (let i = 0; i < 51; i++) {
        let newJson = convertCoinToJson(onSuccess, jsonArray.data[i]);
      //  insertToDB(newJson);
    }
}

function convertCoinToJson(onSuccess, coinData_json) {
    const data = {
        coin_id:  coinData_json.slug,
        name: coinData_json.name,
        symbol: coinData_json.symbol,
        rank: coinData_json.cmc_rank,
        price_usd: coinData_json.quote.USD.price,
        '24h_volume_usd': coinData_json.quote.USD.volume_24h,
        market_cap_usd: coinData_json.quote.USD.market_cap,
        available_supply: coinData_json.circulating_supply,
        total_supply: coinData_json.total_supply,
        max_supply: coinData_json.max_supply,
        percent_change_1h: coinData_json.quote.USD.percent_change_1h,
        percent_change_24h: coinData_json.quote.USD.percent_change_24h,
        percent_change_7d: coinData_json.quote.USD.percent_change_7d,
        last_updated: coinData_json.last_updated,
        "Market Pairs": coinData_json.num_market_pairs,
        "Platform ID": coinData_json.platform,
        "date Time": coinData_json.last_updated.toLocaleString(), //needed format dd.mm.yyyy hh:mm
        day: coinData_json.last_updated.getDate(),
        "day name": coinData_json.last_updated.getDay(), //0=Sunday, 1= Monday .. etc should be converted to letters
        date: coinData_json.last_updated.getDate() + '.' + coinData_json.last_updated.getMonth() + '.' + coinData_json.last_updated.getFullYear(), 
        month: coinData_json.last_updated.getMonth(),
        year: coinData_json.last_updated.getFullYear(),
        hour: coinData_json.last_updated.getHours(),
    };
    onSuccess(JSON.stringify(data));
}