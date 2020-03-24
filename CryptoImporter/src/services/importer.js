const mongodb = require('mongodb');
const https = require('https');
const MongoClient = mongodb.MongoClient;
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'CryptoImporter';
const url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?CMC_PRO_API_KEY=0f20bc2d-4094-487d-911c-b3299b2218aa&start=1&limit=50';

function getCryptoJsonFromWeb(onSuccess, onFail) {
    https.get(url, (resp) => {
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            var json = JSON.parse(data); // FIXME parse might fail
            onSuccess(json);
        });

    }).on("error", err => {
        console.log("Error getting json crypto data: " + err.message);
        onFail(err);
    });
}

function getDataFromDb(onSuccess, onFail) {
    MongoClient.connect(mongoUrl, function (err, client) {
        const db = client.db(dbName);

        if (err) {
            console.log('Unable to connect to the db', err);
            // db connection fail
            onFail(err);
        } else {
            db.collection('CryptoImporter', (err, collection) => {
                if (err) {
                    console.log('db err', err);
                    db.close();
                    // getting db collection fail
                    onFail(err);
                } else
                    collection.find({}).toArray(function (err, result) {
                        if (err) {
                            // getting from collection fail
                            onFail(err);
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
    MongoClient.connect(mongoUrl, function (err, client) {
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
                        console.log('json inserted');
                        onSuccess(json)
                    });
            });
        }
    });
}

module.exports = {
    getDataAndInsertToDb: function (onSuccess, onFail) {
        getCryptoJsonFromWeb((json) => {
            insertDataToDb(json, () => {
                onSuccess(response);
            }, (err) => {
                // insert to db failed
                onFail(err);
            });
        }, (err) => {
            // get data from web failed
            onFail(err);
        });
    },
    getLastDataFromDb: function (onSuccess, onFail) {
        getDataFromDb((json) => {
            onSuccess(json);
        }, (err) => {
            // get from db failed
            onFail(err);
        });
    },
    startDataCallInterval: function (callback) {
        setInterval(yourFunction, 1000 * 60 * 60);
    }
}
