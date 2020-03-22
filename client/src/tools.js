export function importCryptoData(apiKey) {
    const https = require("https");
    
    const Stream = require("stream").Transform;
    const fs = require("fs");
    // const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?CMC_PRO_API_KEY=${apiKey}&start=1&limit=50`;
    const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?CMC_PRO_API_KEY=0f20bc2d-4094-487d-911c-b3299b2218aa&start=1&limit=50`;

    console.log(url);

    https
        .get(url, resp => {
            let data = "";

            // A chunk of data has been recieved.
            resp.on("data", chunk => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on("end", () => {
                let url = JSON.parse(data).hdurl;
                console.log(url);

                https.get(url, res => {
                    //the response should be  an image
                    console.log(res.headers);
                    console.log(res.headers["content-type"], res.headers["content-length"]);

                    if (
                        res.statusCode == 200 &&
                        res.headers["content-type"] == "image/jpeg"
                    ) {
                        let img = new Stream();

                        res.on("data", chunk => {
                            img.push(chunk);
                        });

                        res.on("end", () => {
                            let filename = __dirname + "/apod.jpg";
                            fs.writeFileSync(filename, img.read());
                        });
                    }
                });
            });
        })
        .on("error", err => {
            console.log("Error: " + err.message);
        });
}