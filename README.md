# CryptoImportService

Webapp that imports crypto data to database

Install node & npm

https://nodejs.org/en/

Install npm dependecies
```
cd CryptoImporter
npm install
```

Run app in the same folder with script by typing
```
npm run dev
```

Run db in data folder
```
mongod --dbpath /YOUR/FULL/PATH/TO/DATAFOLDER
```

Run in a new terminal
```
mongo # opens mongo shell
use CryptoImporter # creates collection (I think)
```

When the server is running, you don't need to restart after changes, saving triggers rebuild, then just refresh
