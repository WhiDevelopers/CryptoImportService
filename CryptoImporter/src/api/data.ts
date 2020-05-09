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

/* GET | download crypto data and insert to db */
router.get('/convertAllImportedDataToCustomFormat', (req, res, next) => {
    database.getAllCoinDataFromDb((json) => {
        convertJson(json);
        res.send('Data converted')
    }, (err) => {
        console.log(err);
    });
});

function convertJson(jsonArray) {
    var out = [];

    for (var i = 0; i < jsonArray.length; i++) {
        console.log(JSON.stringify(jsonArray[i]));
        var customCoinData = convertCoinDataToCustomFormat(jsonArray[i]);
        console.log(JSON.stringify(customCoinData));
        out.push(customCoinData);
    }

    database.insertCustomCoinArray(out, () => {
        console.log("coin db convert done!");
    }, (err) => {
        console.log(err);
    });
}

function convertCoinDataToCustomFormat(coinData) {
    var lastUpdated = new Date(coinData.last_updated);

    function getDayName(dayNumber) {
        switch (dayNumber) {
            case 0:
                return 'P';
            case 1:
                return 'E';
            case 2:
                return 'T';
            case 3:
                return 'K';
            case 4:
                return 'N';
            case 5:
                return 'R';
            case 6:
                return 'L';
            default:
                return dayNumber; // fordebug and crashing purposes
        }
    }

    return {
        coin_id: coinData.slug,
        name: coinData.name,
        symbol: coinData.symbol,
        rank: coinData.cmc_rank,
        price_usd: coinData.quote.USD.price,
        '24h_volume_usd': coinData.quote.USD.volume_24h,
        market_cap_usd: coinData.quote.USD.market_cap,
        available_supply: coinData.circulating_supply,
        total_supply: coinData.total_supply,
        max_supply: coinData.max_supply,
        percent_change_1h: coinData.quote.USD.percent_change_1h,
        percent_change_24h: coinData.quote.USD.percent_change_24h,
        percent_change_7d: coinData.quote.USD.percent_change_7d,
        last_updated: coinData.last_updated,
        "Market Pairs": coinData.num_market_pairs,
        "Platform ID": coinData.platform,
        day: lastUpdated.getDate(),
        "day name": getDayName(lastUpdated.getDay()),
        date: lastUpdated.getDate() + '.'
            + lastUpdated.getMonth() + 1 + '.'
            + lastUpdated.getFullYear(),
        month: lastUpdated.getMonth() + 1,
        year: lastUpdated.getFullYear(),
        hour: lastUpdated.getHours(),
    }
}

module.exports = router;