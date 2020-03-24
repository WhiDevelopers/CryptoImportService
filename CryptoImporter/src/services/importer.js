const mongodb = require('mongodb');
const https = require('https');
const MongoClient = mongodb.MongoClient;
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'CryptoImporter';
const url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?CMC_PRO_API_KEY=0f20bc2d-4094-487d-911c-b3299b2218aa&start=1&limit=50';
const dataRequestIntervalTime = 60 * 1000;

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

function getDataFromDb(onSuccess, onFail) {
    MongoClient.connect(mongoUrl, function(err, client) {
        const db = client.db(dbName);

        if (err) {
            console.log('Unable to connect to the db', err);
            onFail(err); // db connection fail
        } else {
            db.collection('CryptoImporter', (err, collection) => {
                if (err) {
                    console.log('db err', err);
                    db.close();
                    onFail(err); // getting db collection fail
                } else
                    collection.find({}).toArray(function(err, result) {
                        if (err) {
                            onFail(err); // getting from collection fail
                        } else if (result.length) {
                            onSuccess(result[0]["data"]);
                        } else {
                            onFail("db empty");
                        }
                        client.close();
                    });
            });
        }
    });
}

function insertDataToDb(json, onSuccess, onFail) {
    MongoClient.connect(mongoUrl, function(err, client) {
        const db = client.db(dbName);

        if (err) {
            console.log('Unable to connect to the db', err);
            onFail(err);
        } else {
            db.collection('CryptoImporter', (err, collection) => {
                if (err) {
                    console.log('db err', err);
                    onFail(err);
                } else
                    collection.insertOne(json, () => {
                        onSuccess(json)
                    });
            });
        }
    });
}

function getDataAndInsertToDb(onSuccess, onFail) {
    getCryptoJsonFromWeb((json) => {
        insertDataToDb(json, () => {
            onSuccess();
        }, (err) => {
            onFail(err); // insert to db failed
        });
    }, (err) => {
        onFail(err); // get data from web failed
    });
}

function startDataUpdateInterval() {
    var i = 0;
    getDataAndInsertToDb(() => {
        console.log("Data inserted");
    }, (err) => {
        console.log(`Crypto data get failed: ${err}`);
    });

    setInterval(() => {
        getDataAndInsertToDb(() => {
            console.log("Data inserted");
        }, (err) => {
            console.log(`Crypto data get failed: ${err}`);
        });
    }, dataRequestIntervalTime);
}

module.exports = {
    getDataAndInsertToDb,
    getDataFromDb,
    startDataUpdateInterval
}