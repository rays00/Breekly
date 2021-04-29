const jwt = require('jsonwebtoken')
const jwtSecret = require('../config/keys').JWT_KEY

function unauthorizeUser(res) {
    return res.status(401).json({
        message: 'Unauthorized'
    })
}

module.exports = (req, res, next) => {
    if (!req.headers.authorization) {
        return unauthorizeUser(res);
    }
    try {
        decoded = jwt.verify(req.headers.authorization.split(" ")[1], jwtSecret);
    } catch(err) {
        return unauthorizeUser(res);
    }
    
    next()
};
