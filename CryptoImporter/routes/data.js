var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
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
      console.log(JSON.parse(data));
    });

  }).on("error", err => {
    console.log("Error: " + err.message);
  });

  res.send('respond with a resource');

});

module.exports = router;
