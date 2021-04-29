var express = require('express');
var router = express.Router();
var Product = require('../models/Product');

/* GET products listing. */
router.get('/', function(req, res, next) {
    Product.find()
    .then(products => res.json(products));
});

/* POST products create new product */
router.post('/', function(req, res) {
    saveProduct(req, res);
});

/* GET product by id */
router.get('/:id', function(req, res, next) {
    Product.findById(req.params.id)
    .then(product => res.json(product))
    .catch(err => res.status(404).json({message: "We couldn't find your product."}));
});

/* PUT products edit product */
router.put('/:id', function(req, res) {
    Product.findById(req.params.id)
      .exec()
      .then(product => {
        if (!product) {
          return res.status(404).json({ message: 'We couldn\'t find your product.'})
        }
        product.name = req.body.name;
        product.description = req.body.description;
        product.price = req.body.price;
        product.availability = req.body.availability;
        product.save()
        .then(product => res.status(200).json({ message: "Success!", product: product }))
        .catch(err => res.status(500).json({ error: err }))
      })
  });

function saveProduct(req, res) {
    let newProduct = new Product({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        availability: req.body.availability
    });
    newProduct.save()
    .then(product => res.status(200).json({ message: "Success!", product: product }))
    .catch(err => res.status(500).json({ error: err }));
}

module.exports = router;
