var express = require('express');
var router = express.Router();
var Subscription = require('../models/Subscription');
var Product = require('../models/Product');
var User = require('../models/User');

router.post('/', function(req, res) {
    const userId = req.body.userId;
    const productId = req.body.productId;
    const period = req.body.period;

    User.findById(userId)
    .exec()
    .then(user => {
        Product.findById(productId)
        .exec()
        .then(product => {
            let newSubscription = new Subscription({
                userId: userId,
                productId: productId,
                period: period
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
