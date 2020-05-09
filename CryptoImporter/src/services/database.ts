import MongoClient from "mongodb";
const mongoUrl = "mongodb://localhost:27017";
const dbName = "CryptoImporter";
const collection1 = "collection1";
const collection2 = "collection2"; // TODO better names

class Database implements IDatabase {
    getLastDataFromDb(onSuccess: (json: any) => void, onFail: (err: any) => void): void {
        MongoClient.connect(mongoUrl, function (err: any, client: any) {
            const db = client.db(dbName);

            if (err) {
                console.log('Unable to connect to the db', err);
                onFail(err); // db connection fail
            } else {
                db.collection('CryptoImporter', (err: any, collection: any) => {
                    if (err) {
                        console.log('db err', err);
                        db.close();
                        onFail(err); // getting db collection fail
                    } else
                        collection.find({}).toArray(function (err: any, result: any) {
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

    insertDataToDb(json: any, onSuccess: (json: any) => void, onFail: (err: any) => void): void {
        MongoClient.connect(mongoUrl, function (err: any, client: any) {
            const db = client.db(dbName);

            if (err) {
              console.log("db err", err);
              onFail(err);
              client.close();
            } else
              collection.insertOne(json, () => {
                onSuccess(json);
                client.close();
              });
          });
      }
    });
  }

  initCollection2(json, onSuccess, onFail) {
    MongoClient.connect(mongoUrl, function(err: any, client: any) {
      if (err) {
        onFail(err);
      } else {
        var db = client.db(dbName);
        db.collection(collection2)
          .find()
          .toArray(function(err, items) {
            if (items.length) {

            } else {
              client
                .db(dbName)
                .collection(collection2, (err: any, collection: any) => {
                  if (err) {
                    onFail(err);
                  } else {
                    collection.insertMany(json, () => {
                      onSuccess();
                    });
                  }
                });
            }
        });
    }

    insertCustomCoinArray(jsonArray: any, onSuccess: () => void, onFail: (err: any) => void): void {
        // TODO
        
        // MongoClient.connect(mongoUrl, function (err: any, client: any) {
        //     const db = client.db(dbName);
        //     if (err) {
        //         console.log('Unable to connect to the db', err);
        //         onFail(err);
        //     } else {
        //         db.collection('CryptoImporter', (err: any, collection: any) => {
        //             if (err) {
        //                 console.log('db err', err);
        //                 onFail(err);
        //             } else
        //                 collection.insertMany(jsonArray, () => {
        //                     onSuccess()
        //                 });
        //         });
        //     }
        // });
    }

    getAllCoinDataFromDb(onSuccess: (json: any) => void, onFail: (err: any) => void): void {
        MongoClient.connect(mongoUrl, function (err: any, client: any) {
            const db = client.db(dbName);

            if (err) {
                console.log('Unable to connect to the db', err);
                onFail(err); // db connection fail
            } else {
                db.collection('CryptoImporter', (err: any, collection: any) => {
                    if (err) {
                        console.log('db err', err);
                        db.close();
                        onFail(err); // getting db collection fail
                    } else
                        collection.find({}).toArray(function (err: any, result: any) {
                            if (err) {
                                onFail(err); // getting from collection fail
                            } else if (result.length) {
                                onSuccess(result);
                            } else {
                                onFail("db empty");
                            }
                            client.close();
                        });
                });
            }
        });
    }
}

export let database: Database = new Database();
