var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//Mongo Client
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://breekly-admin:breekly-admin@cluster0.zt2zg.mongodb.net/breekly?retryWrites=true&w=majority";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Database connected"))
    .catch(err => console.log(err))

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');
var subscriptionsRouter = require('./routes/subscriptions');
var addressesRouter = require('./routes/addresses');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);
app.use('/api/subscriptions', subscriptionsRouter);
app.use('/api/addresses', addressesRouter);

module.exports = app;
