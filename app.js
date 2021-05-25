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
var ordersRouter = require('./routes/orders');

var cron = require('node-cron');

var app = express();

var http = require('http');

cron.schedule('0 1 * * *', () => {
  var options = {
    host: '',
    path: '/api/subscriptions',
    port: 3000
  };
  
  callback = function(response) {
    var str = '';
  
    //another chunk of data has been received, so append it to `str`
    response.on('data', function (chunk) {
      let subscriptions = JSON.parse(chunk)
      subscriptions.forEach(function(item, index) {
          postNewOrder(item._id)
      })
    });
  }
  
  http.request(options, callback).end();
});

function postNewOrder(id) {
  var options = {
      host: '',
      path: '/api/orders',
      port: '3000',
      method: 'POST',
      headers: 
        {'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MDlhZWJmYWI1YjU4MGI0MDdjNDAxODEiLCJlbWFpbCI6InVwc2lkZWRvd25AZ21haWwuY29tIiwiZmlyc3ROYW1lIjoiRGFuIiwibGFzdE5hbWUiOiJCcmV6ZWFudSIsImlhdCI6MTYyMTkzNzAzMiwiZXhwIjoxNjIxOTQwNjMyfQ.kuQcU5w0Pquf41VC2dnajClzemkhBG5K1vF3yDQ0F70',
        'Content-Type': 'application/json'},
    };
    
    callback = function(response) {
      var str = ''
      response.on('data', function (chunk) {
        str += chunk;
      });
    
      response.on('end', function () {
        console.log(str);
      });
    }
    
    var req = http.request(options, callback);
    //This is the data we are posting, it needs to be a string or a buffer
    var body = {subscriptionId: id}
    req.write(JSON.stringify(body));
    req.end();
}

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
app.use('/api/orders', ordersRouter);

module.exports = app;
