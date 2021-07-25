//var express = require('express');
var path = require('path');
var multer = require('multer')
var router = express.Router();
var jwt = require('jsonwebtoken');

var awsHelper = require('../helpers/awsHelper');

// Require controller modules
var commonController = require('../app/common/controllers/commonController');
var paymentController = require('../app/api/payment/controllers/paymentController');
var usersController = require('../app/api/user/controllers/usersController');
var storage = multer.diskStorage({
    //    destination: function (req, file, callback) {
    //        callback(null, UPLOAD_PATH);
    //    },
    filename: function (req, file, callback) {
        var fileName = path.parse(file.originalname).name + '_' + Date.now() + path.parse(file.originalname).ext;
        callback(null, fileName);
    }
});

var storageWithDestination = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, UPLOAD_PATH);
    },
    filename: function (req, file, callback) {
        var fileName = path.parse(file.originalname).name + '_' + Date.now() + path.parse(file.originalname).ext;
        callback(null, fileName);
    }
});

// ensure that auth is required for route
var ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/user/login')
}

var upload = multer({ storage: storage })
var uploadWithDestination = multer({ storage: storageWithDestination });

const verifyToken = (req, res, next) => {
    const token =
        req.body.token || req.query.token || req.headers["x-access-token"];
    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        const decoded = jwt.verify(token, config.jwt.tokenKey);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
};

router.post('/payment/save-card', verifyToken ,function (req, res) {
    paymentController.saveCard(req, res);
});

router.post('/user', function (req, res) {
    usersController.register(req, res);
});

router.post('/user/login', function (req, res) {
    usersController.login(req, res);
});

router.post('/payment/transfer', verifyToken , function (req, res) {
    paymentController.transferAmount(req, res);
})

module.exports = router;