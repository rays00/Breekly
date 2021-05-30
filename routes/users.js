var express = require('express');
var router = express.Router();
var User = require('../models/User');
var bcrypt = require('bcrypt');
var saltRounds = 10;
var jwt = require('jsonwebtoken');
var jwtSecret = require('../config/keys').JWT_KEY;
var emailPassword = require('../config/keys').EMAIL_PASS;
var checkAuth = require('../middleware/check-auth.js');
var nodemailer = require('nodemailer');

/* GET users listing. */
router.get('/', function (req, res, next) {
  User.find()
    .then(users => res.json(users));
});

router.get('/user-data', checkAuth, function (req, res, next) {
  return res.status(200).json({ userData: jwt.decode(req.headers.authorization.split(" ")[1]) })
})

router.put('/', function (req, res, next) {
  User.findOne({ email: req.body.email })
  .then(user => {
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
      // Update hash as a password in DB
      user.password = hash
      user.save()
      .then(user => {
        res.status(200).json({ message: "New user data saved." })
      })
      .catch(err => res.status(500).json({ error: err }));
    });
  })
  .catch(err => res.status(500).json({ error: err }));
})

router.get('/validate-request', checkAuth, function (req, res, next) {
  return res.status(200).json({ message: 'Valid' })
})

router.get('/validate-admin-request', checkAuth, function (req, res, next) {
  decoded = jwt.verify(req.headers.authorization.split(" ")[1], jwtSecret);
  if (decoded.isAdmin) {
    return res.status(200).json({ message: 'Valid' })
  }
  return res.status(401).json({ message: 'Invalid' })
})

/* POST users create new user */
router.post('/', function (req, res) {
  User.findOne({ email: req.body.email })
    .exec()
    .then(user => {
      if (user) {
        return res.status(409).json({ message: 'Email address already exists.' })
      }
      saveUser(res, req.body.email, req.body.password, req.body.firstName, req.body.lastName, req.body.isAdmin);
    })
});

/* POST users login */
router.post('/login', function (req, res) {
  User.findOne({ email: req.body.email })
    .exec()
    .then(user => {
      if (!user) {
        return res.status(401).json({ message: 'Auth failed.' })
      }
      loginUser(req, res, user);
    })
});

router.post('/reset', function (req, res) {
  User.findOne({ email: req.body.email })
    .exec()
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'Couldn\'t find an account associated with this email.' })
      }
      resetPassword(req, res, user);
    })
})

function resetPassword(req, res, user) {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'bdangabriel@gmail.com',
      pass: emailPassword
    }
  });

  let code = ""
  for (let i = 0; i < 4; i++) {
    code += parseInt(Math.floor(Math.random() * 9) + 0)
  }

  var mailOptions = {
    from: 'bdangabriel@gmail.com',
    to: req.body.email,
    subject: 'Breekly - Password reset',
    text: 'Foloseste codul ' + code + ' pentru a-ti reseta parola pe Breekly.'
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return res.status(500).json({ err: error })
    } else {
      return res.status(200).json({ message: "An email with the code was sent." })
    }
  });

  user.resetPasswordCode = code
  user.save()
    .then(user => {
      res.status(200).json({ message: "Reset password code applied on user." })
    })
    .catch(err => res.status(500).json({ error: err }));
}

function loginUser(req, res, user) {
  bcrypt.compare(req.body.password, user.password, function (err, result) {
    if (result === false) {
      return res.status(401).json({ message: "Auth failed." });
    }
    // Generate user token
    var token = jwt.sign({
      userId: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isAdmin: user.isAdmin,
    }, jwtSecret, {
      expiresIn: "1h"
    });
    return res.status(202).json({
      message: "Success!",
      token: token
    });
  });
}

function saveUser(res, email, password, firstName, lastName, isAdmin) {
  bcrypt.hash(password, saltRounds, function (err, hash) {
    let newUser = new User({
      email: email,
      password: hash,
      firstName: firstName,
      lastName: lastName,
      isAdmin: isAdmin,
    });
    newUser.save()
      .then(user => {
        var token = jwt.sign({
          userId: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isAdmin: user.isAdmin,
        }, jwtSecret, {
          expiresIn: "1h"
        });
        res.status(200).json({ message: "Success!", user: user, token: token })
      })
      .catch(err => res.status(500).json({ error: err }));
  })
}

module.exports = router;
