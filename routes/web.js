//var express = require('express');
var path    = require('path');
var multer  = require('multer')
var router  = express.Router();

var awsHelper = require(HELPER_PATH+'awsHelper');

// Require controller modules
var commonController        = require('../app/common/controllers/commonController');
var registrationController  = require('../app/common/controllers/registrationController');

var storage = multer.diskStorage({
//    destination: function (req, file, callback) {
//        callback(null, UPLOAD_PATH);
//    },
    filename: function (req, file, callback) { 
        var fileName = path.parse(file.originalname).name+'_'+Date.now()+path.parse(file.originalname).ext;
        callback(null, fileName);
    }
});

var storageWithDestination = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, UPLOAD_PATH);
    },
    filename: function (req, file, callback) { 
        var fileName = path.parse(file.originalname).name+'_'+Date.now()+path.parse(file.originalname).ext;
        callback(null, fileName);
    }
});

var upload = multer({storage: storage })
var uploadWithDestination = multer({storage: storageWithDestination })

router.get('/common/get-city', function (req, res) {	
    commonController.getCity(req, res);
});

router.get('/common/get-mapped-data', function (req, res) {	
    commonController.getMappedData(req, res);
});


router.get('/file/:registrationNumber/:fileName', function (req, res) {
    awsHelper.readFile(req, res);
});

router.get('/make', function (req, res) {	
    commonController.getMakeContent(req, res);
});

router.get('/home', function (req, res) {	
    commonController.getHomeContent(req, res);
});

router.get('/registration', function (req, res) {	
    registrationController.getRegistration(req, res);
});

router.get('/favicon.ico',function (req, res) {	
    res.status(204).send();
});

module.exports = router;