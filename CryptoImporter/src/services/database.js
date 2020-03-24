"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = __importDefault(require("mongodb"));
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'CryptoImporter';
class Database {
    getLastDataFromDb(onSuccess, onFail) {
        mongodb_1.default.connect(mongoUrl, function (err, client) {
            const db = client.db(dbName);
            if (err) {
                console.log('Unable to connect to the db', err);
                onFail(err); // db connection fail
            }
            else {
                db.collection('CryptoImporter', (err, collection) => {
                    if (err) {
                        console.log('db err', err);
                        db.close();
                        onFail(err); // getting db collection fail
                    }
                    else
                        collection.find({}).toArray(function (err, result) {
                            if (err) {
                                onFail(err); // getting from collection fail
                            }
                            else if (result.length) {
                                onSuccess(result[0]["data"]);
                            }
                            else {
                                onFail("db empty");
                            }
                            client.close();
                        });
                });
            }
        });
    }
    insertDataToDb(json, onSuccess, onFail) {
        mongodb_1.default.connect(mongoUrl, function (err, client) {
            const db = client.db(dbName);
            if (err) {
                console.log('Unable to connect to the db', err);
                onFail(err);
            }
            else {
                db.collection('CryptoImporter', (err, collection) => {
                    if (err) {
                        console.log('db err', err);
                        onFail(err);
                    }
                    else
                        collection.insertOne(json, () => {
                            onSuccess(json);
                        });
                });
            }
        });
    }
}
exports.database = new Database();
