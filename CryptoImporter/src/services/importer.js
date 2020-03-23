const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'CryptoImporter';
const mongodb = require('mongodb');

function getDataFromDb(callback) {
    var MongoClient = mongodb.MongoClient;

    console.log('Connecting to db');
    MongoClient.connect(mongoUrl, function (err, client) {
        const db = client.db(dbName);

        if (err) {
            console.log('Unable to connect to the db', err);
            callback(err, null);
        } else {
            db.collection('CryptoImporter', (err, collection) => {
                if (err) {
                    console.log('db err', err);
                    db.close();
                    callback(err, null);
                } else
                    collection.find({}).toArray(function (err, result) {
                        if (err) {
                            callback(err, null);
                        } else if (result.length) {
                            callback(null, result[0]["data"]);
                        } else {
                            callback("db empty", null);
                        }
                        client.close();
                    });
            });
        }
    });
}

function insertDataToDb(json, callback) {
    var MongoClient = mongodb.MongoClient;

    console.log('Connecting to db');
    MongoClient.connect(mongoUrl, function (err, client) {
        const db = client.db(dbName);

        if (err) {
            console.log('Unable to connect to the db', err);
            callback(err);
        } else {
            db.collection('CryptoImporter', (err, collection) => {
                if (err) {
                    console.log('db err', err);
                    callback(err);
                } else
                    collection.insertOne(json, () => {
                        console.log('json inserted');
                        callback(json)
                    });
            });
        }
    });
}

module.exports = {
    getDataAndInsertToDb: function (callback) {
        const url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?CMC_PRO_API_KEY=0f20bc2d-4094-487d-911c-b3299b2218aa&start=1&limit=50';
        const https = require('https');

        https.get(url, (resp) => {
            let data = '';

            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                var json = JSON.parse(data);
                insertDataToDb(json, (response) => {
                    callback(response)
                });
            });

        }).on("error", err => {
            console.log("Error getting json crypto data: " + err.message);
            callback(err);
        });
    },
    getLastDataFromDb: function (callback) {
        getDataFromDb((err, json) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, json);
            }
        });
    }
}
