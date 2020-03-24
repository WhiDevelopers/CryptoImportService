# CryptoImportService

Webapp that imports crypto data to database

Install node & npm

https://nodejs.org/en/

Install npm dependecies
```
cd CryptoImporter
npm install
```

Run in CryptoImporter folder
```
npm run dev
```

Run db in data folder (.../CryptoImportService/CryptoImporter/data)
```
mongod --dbpath "/YOUR/FULL/PATH/TO/DATAFOLDER"
```

Run in a new terminal (once)
```
mongo # opens mongo shell
use CryptoImporter # creates collection
```

When the server is running, you don't need to restart after changes, saving triggers rebuild, then just refresh
