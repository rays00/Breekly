var express = require('express');
var router = express.Router();
var Subscription = require('../models/Subscription');
var Product = require('../models/Product');
var User = require('../models/User');
var checkAuth = require('../middleware/check-auth.js');
var jwtSecret = require('../config/keys').JWT_KEY;
var jwt = require('jsonwebtoken');

router.get('/', function(req, res) {
    Subscription.find()
    .populate({ path: 'addressId', model: Address })
    .populate({ path: 'productId', model: Product })
    .then(subscriptions => res.json(subscriptions));
})

router.delete('/:id', function(req, res) {
    const subscriptionId = req.params.id
    Subscription.deleteOne({_id: subscriptionId})
    .then(subscription => res.json({"success": "true"}))
    .catch(err => res.json({"success": "false"}))
})

router.get('/mine', checkAuth, function(req, res) {
    decoded = jwt.decode(req.headers.authorization.split(" ")[1], jwtSecret);
    const userId = decoded.userId
    Subscription.find({userId: userId})
    .populate({ path: 'addressId', model: Address })
    .populate({ path: 'productId', model: Product })
    .then(subscriptions => {
        res.json(subscriptions)
    });
})

router.put('/', function(req, res) {
    const subscriptionId = req.body.subscriptionId;
    const newAvailability = req.body.newAvailability;

    Subscription.findById(subscriptionId)
    .exec()
    .then(subscription => {
        subscription.isActive = newAvailability;
        subscription.save()
        .then(subscription => res.status(200).json({ message: "Success!", subscription: subscription }))
        .catch(err => res.status(500).json({ error: err }));
    })
    .catch(err => res.status(500).json({ message: 'Specified subscription doesn\'t exist!', error: err }))
})

router.post('/', checkAuth, function(req, res) {
    const productId = req.body.productId;
    const period = req.body.period;
    const qty = req.body.qty;
    const addressId = req.body.addressId;
    
    decoded = jwt.decode(req.headers.authorization.split(" ")[1], jwtSecret);
    const userId = decoded.userId

    User.findById(userId)
    .exec()
    .then(user => {
        Product.findById(productId)
        .exec()
        .then(product => {
            let newSubscription = new Subscription({
                userId: userId,
                productId: productId,
                period: period,
                qty: qty,
                addressId: addressId
            });
            newSubscription.save()
            .then(subscription => res.status(200).json({ message: "Success!", subscription: subscription }))
            .catch(err => res.status(500).json({ error: err }));
        })
        .catch(err => res.status(500).json({ message: 'Specified product doesn\'t exist!'}))

    })
    .catch(err => res.status(500).json({ message: 'Specified user doesn\'t exist!'}))
});

module.exports = router;
