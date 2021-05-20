var express = require('express');
var router = express.Router();
var Order = require('../models/Order');
var checkAuth = require('../middleware/check-auth.js');
var jwtSecret = require('../config/keys').JWT_KEY;
var jwt = require('jsonwebtoken');

router.get('/', function(req, res) {
    Order.find()
    .then(orders => res.json(orders));
})

router.get('/mine', checkAuth, function(req, res) {
    decoded = jwt.decode(req.headers.authorization.split(" ")[1], jwtSecret);
    const userId = decoded.userId
    Order.find()
    .populate({ path: 'subscriptionId', model: Subscription,
        populate: [{ path: 'productId', model: Product }, { path: 'addressId', model: Address}] })
    .then(orders => {
        var myOrders = orders.filter(function(order){
            return order.subscriptionId.userId == userId;
        });
        res.json(myOrders)
    });
})

router.post('/', checkAuth, function(req, res) {
    const subscriptionId = req.body.subscriptionId;
    
    decoded = jwt.decode(req.headers.authorization.split(" ")[1], jwtSecret);
    const userId = decoded.userId

    Subscription.findById(subscriptionId)
    .exec()
    .then(subscription => {
        let newOrder = new Order({
            subscriptionId: subscription._id,
        });
        newOrder.save()
        .then(order => res.status(200).json({ message: "Success!", order: order }))
        .catch(err => res.status(500).json({ error: err }));

    })
    .catch(err => res.status(500).json({ message: 'Specified subscription doesn\'t exist!'}))
});

module.exports = router;
