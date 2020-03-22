Tutorial: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/


1. Download mongoDB server
https://fastdl.mongodb.org/win32/mongodb-win32-x86_64-2012plus-4.2.3-signed.msi

2. Install as network service
How to use CMD in visual studio code: https://code.visualstudio.com/docs/editor/integrated-terminal

3. CMD Commands, Create path to local database and run mongodb service
```
cd C:\
```
```
md "\data\db"
```
```
"C:\Program Files\MongoDB\Server\4.2\bin\mongod.exe" --dbpath="c:\data\db"
```

4. Create new CMD instance and run mongo console
```
"C:\Program Files\MongoDB\Server\4.2\bin\mongo.exe"
```

5. create new database
```
use cryptodata
```

6. create new CMD instance and navigate to mongoDB bin folder
```
cd C:\Program Files\MongoDB\Server\4.2\bin\
```

7. import data
```
mongoimport --db cryptodata --collection coinmarketcap --drop --jsonArray --file "<GIT path>\Initial Crypto Data.json"
```

You can visualize the data with MongoDBCompassCommunity.exe which by defualt is located in your local file
C:\Users\<username>\AppData\Local\MongoDBCompassCommunity