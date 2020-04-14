import { Database } from "./services/database";

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var networking = require('./services/networking');
var database: Database = require('./services/database').database;
var indexRouter = require('./api/index');
var dataRouter = require('./api/data');
var app = express();
var fs = require('fs');

// view engine setup
app.set('views', __dirname + '/../views');  
app.set('view engine', 'jade');

var accessLogStream = fs.createWriteStream(path.join(__dirname, '/../access.log'), { flags: 'a' })
var morganDateFormat = ':date[clf] :method :url :status :response-time ms - :res[content-length]'
app.use(morgan(morganDateFormat)); // to console
app.use(morgan(morganDateFormat, { stream: accessLogStream })); // create a write stream (in append mode)

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/../public')));

app.use('/', indexRouter);
app.use('/data', dataRouter);

// catch 404 and forward to error handler
app.use(function (req: any, res: any, next: (arg0: any) => void) {
    next(createError(404));
});

// error handler
app.use(function (err: { message: any; status: any; }, req: { app: { get: (arg0: string) => string; }; }, res: { locals: { message: any; error: any; }; status: (arg0: any) => void; render: (arg0: string) => void; }, next: any) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

networking.startDataUpdateInterval();
let rawData = fs.readFileSync(__dirname + '/../../Initial Crypto Data.json');
let json = JSON.parse(rawData);

database.initCollection2(json, () => {
    console.log("insert to col2 worked");
}, (err) => {
    console.log(`error: ${err}`);
});

module.exports = app;