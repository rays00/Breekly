var express = require('express');
var router = express.Router();
var Address = require('../models/Address');
var jwt = require('jsonwebtoken');
var jwtSecret = require('../config/keys').JWT_KEY;
var checkAuth = require('../middleware/check-auth.js');

router.get('/', function(req, res, next) {
    Address.find()
    .then(addresses => res.json(addresses));
});

router.get('/mine', checkAuth, function(req, res, next){
    decoded = jwt.decode(req.headers.authorization.split(" ")[1], jwtSecret);
    const userId = decoded.userId
    Address.find({userId: userId})
    .then(addresses => res.json(addresses))
    .catch(err => res.status(500).json({ error: err }));
});

/* POST Create new address */
router.post('/', checkAuth, function(req, res) {
    saveAddress(req, res);
});

/* PUT Update exisitng address */

router.put('/:id', checkAuth, function(req, res){
    updateAddress(req, res)
})

function updateAddress(req, res) {
    decoded = jwt.decode(req.headers.authorization.split(" ")[1], jwtSecret);
    const userId = decoded.userId
    Address.findById(req.params.id)
    .exec()
    .then(address => {
        if (!address) {
            return res.status(404).json({ message: 'We couldn\'t find your address.'})
        }
        address.street = req.body.street;
        address.number = req.body.number;
        address.details = req.body.details;
        address.city = req.body.city;
        address.save()
        .then(address => res.status(200).json({ message: "Success!", address: address }))
        .catch(err => res.status(500).json({ error: err }))
    })
}

function saveAddress(req, res) {
    decoded = jwt.decode(req.headers.authorization.split(" ")[1], jwtSecret);
    const userId = decoded.userId

    let newAddress = new Address({
        street: req.body.street,
        number: req.body.number,
        details: req.body.details,
        city: req.body.city,
        userId: userId
    });
    newAddress.save()
    .then(address => res.status(200).json({ message: "Success!", address: address }))
    .catch(err => res.status(500).json({ error: err }));
}

module.exports = router;
