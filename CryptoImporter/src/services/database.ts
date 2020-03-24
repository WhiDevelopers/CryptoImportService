import MongoClient from 'mongodb';
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'CryptoImporter';

class Database implements IDatabase {
    getLastDataFromDb(onSuccess: (json: any) => void, onFail: (err: any) => void): void {
        MongoClient.connect(mongoUrl, function(err: any, client: any) {
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
                        collection.find({}).toArray(function(err: any, result: any) {
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
        MongoClient.connect(mongoUrl, function(err: any, client: any) {
            const db = client.db(dbName);
    
            if (err) {
                console.log('Unable to connect to the db', err);
                onFail(err);
            } else {
                db.collection('CryptoImporter', (err: any, collection: any) => {
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
}

export let database = new Database();
