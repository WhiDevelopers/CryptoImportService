interface IDatabase {
    getLastDataFromDb(onSuccess: (json: any) => void, onFail: (err: any) => void): void;
    insertDataToDb(json: any, onSuccess: (json: any) => void, onFail: (err: any) => void): void;
}