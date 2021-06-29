var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var emailPassword = require('./config/keys').EMAIL_PASS;

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'upsidedown519@gmail.com',
    pass: emailPassword
  }
});

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

app.use(express.static('Breekly-FE/dist/Breekly-FE'))

var http = require('http');

cron.schedule('*/5 * * * *', () => {
  var options = {
    host: '',
    path: '/api/subscriptions',
    port: 8080
  };

  callback = function (response) {
    var str = '';

    response.on('data', function (chunk) {
      let subscriptions = JSON.parse(chunk)
      console.log(subscriptions.length)
      subscriptions.forEach(function (item, index) {
        var mailOptions = {}
        if (item.isActive && item.productId.availability) {
          mailOptions = {
            from: 'upsidedown519@gmail.com',
            to: item.userId.email,
            subject: 'Breekly - Comanda noua',
            text:
              'O noua comanda pentru subscriptia ta a fost creata! Produs: '
              + item.productId.name + ' Cantitate: ' + item.qty
              + ' Pret: ' + item.productId.price
          };
          postNewOrder(item._id)
        } else {
          mailOptions = {
            from: 'upsidedown519@gmail.com',
            to: item.userId.email,
            subject: 'Breekly - Comanda esuata',
            text: 'Nu am putut trimite comanda pentru ca produsul este indisponibil. Produs: ' + item.productId.name
          };
        }
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error)
          }
        });
      })
    });
  }

  http.request(options, callback).end();
});

function postNewOrder(id) {
  var options = {
    host: '',
    path: '/api/orders',
    port: '8080',
    method: 'POST',
    headers:
    {
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MGIyNmQzNjMwOGU3YzhhMWNiNzZiMTQiLCJlbWFpbCI6ImFkbWluQGJyZWVrbHkuY29tIiwiZmlyc3ROYW1lIjoiQWRtaW4iLCJsYXN0TmFtZSI6IkFkbWluIiwiaXNBZG1pbiI6dHJ1ZSwiaWF0IjoxNjIyMzg0NjIyLCJleHAiOjE3MDg3ODQ2MjJ9.dD5S7hF_nA9V7MzNROACILELu7K-QOv9Iz_YBJCwtGA',
      'Content-Type': 'application/json'
    },
  };

  callback = function (response) {
    var str = ''
    response.on('data', function (chunk) {
      str += chunk;
    });

    response.on('end', function () {
      console.log(str);
    });
  }

  var req = http.request(options, callback);
  var body = { subscriptionId: id }
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

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'Breekly-FE/dist/Breekly-FE/index.html'));
});

module.exports = app;
