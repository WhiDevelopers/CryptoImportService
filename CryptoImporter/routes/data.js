var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');

/* GET users listing. */
router.get('/latest', (req, res, next) => {
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
      var MongoClient = mongodb.MongoClient;
      var url = 'mongodb://localhost:27017';
      var json = JSON.parse(data)
      const dbName = 'CryptoImporter';

      console.log(json);

      MongoClient.connect(url, function (err, client) {
        const db = client.db(dbName);

        if (err) {
          console.log('Unable to connect to the server', err)
        } else {
          console.log('db connected')

          db.collection('CryptoImporter', (err, collection) => {
            if (err) {
              console.log('db err')
              res.send(err)
            } else
              console.log('insert json')
            collection.insertOne(json, () => {
              console.log('json inserted')
            })
          })
        }
      });

      res.send(JSON.parse(data));
    });

  }).on("error", err => {
    console.log("Error: " + err.message);
    res.send('respond with a resource');
  });
});

module.exports = router;
