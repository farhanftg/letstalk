//var express = require('express');
var path    = require('path');
var multer  = require('multer')
var router  = express.Router();

var awsHelper = require(HELPER_PATH+'awsHelper');

// Require controller modules
var commonController            = require('../app/common/controllers/commonController');
var registrationController      = require('../app/registration/controllers/registrationController');
var registrationTextController  = require('../app/registration/controllers/registrationTextController');

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

router.get('/common/get-rto-detail', function (req, res) {	
    commonController.getRtoDetail(req, res);
});

router.get('/common/get-mapped-data', function (req, res) {	
    commonController.getMappedData(req, res);
});

router.get('/common/get-car-make', function (req, res) {	
    commonController.getCarMake(req, res);
});

router.get('/common/get-car-model', function (req, res) {	
    commonController.getCarModel(req, res);
});

router.get('/common/get-car-variant', function (req, res) {	
    commonController.getCarVariant(req, res);
});

router.get('/common/get-bike-make', function (req, res) {	
    commonController.getBikeMake(req, res);
});

router.get('/common/get-bike-model', function (req, res) {	
    commonController.getBikeModel(req, res);
});

router.get('/common/get-bike-variant', function (req, res) {	
    commonController.getBikeVariant(req, res);
});

router.get('/registration', function (req, res) {	
    registrationController.getRegistration(req, res);
});

router.get('/registration-text', function (req, res) {	
    registrationTextController.getRegistrationText(req, res);
});

router.post('/update-registration-text', function (req, res) {	
    registrationTextController.updateRegistrationText(req, res);
});

router.get('/file/:registrationNumber/:fileName', function (req, res) {
    awsHelper.readFile(req, res);
});

router.get('/favicon.ico',function (req, res) {	
    res.status(204).send();
});

module.exports = router;