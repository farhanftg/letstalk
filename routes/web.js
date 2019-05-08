//var express = require('express');
var path    = require('path');
var multer  = require('multer')
var router  = express.Router();

var awsHelper = require(HELPER_PATH+'awsHelper');

// Require controller modules
var commonController            = require('../app/common/controllers/commonController');
var registrationController      = require('../app/registration/controllers/registrationController');
var registrationTextController  = require('../app/registration/controllers/registrationTextController');
var vehicleClassController      = require('../app/registration/controllers/vehicleClassController');
var userController              = require('../app/user/controllers/userController');
var registrationRequestController = require('../app/registration/controllers/registrationRequestController');

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

// ensure that auth is required for route
var ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/user/login')
}  

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

router.get('/', ensureAuthenticated ,function (req, res) {	
    registrationController.index(req, res);
});

router.get('/registration/list', ensureAuthenticated, function (req, res) {	
    registrationController.getRegistrationList(req, res);
});

router.get('/registration', function (req, res) {	
    registrationController.getRegistration(req, res);
});

router.post('/update-registration', function(req, res){
    registrationController.updateRegistration(req, res);
});

router.get('/registration-text', ensureAuthenticated,function (req, res) {	
    registrationTextController.getRegistrationText(req, res);
});

router.post('/update-registration-text', function (req, res) {	
    registrationTextController.updateRegistrationText(req, res);
});

router.get('/file/:registrationNumber/:fileName', function (req, res) {
    awsHelper.readFile(req, res);
});

router.get('/vehicle-class', ensureAuthenticated ,function(req,res){
    vehicleClassController.getVehicleClassList(req, res);
});

router.post('/update-vehicle-class',ensureAuthenticated,function(req,res){
    vehicleClassController.updateVehicleClass(req, res);
});

router.get('/user/login',function(req, res){
    userController.getLogin(req, res);
});

router.post('/user/login',function(req, res, next){
    userController.postLogin(req, res, next);
});

router.get('/user/create',ensureAuthenticated,function(req,res){
    return res.status(409).render(path.join(BASE_DIR, 'app/user/views', 'signup'),{message: req.flash('message')});
});

router.post('/user/signup',ensureAuthenticated,function(req, res){
    userController.postSignup(req, res);
});

router.post('/validation/username',function(req, res){
    userController.checkUsername(req,res);
})

router.get('/user',function(req, res){
    userController.userList(req, res);
});

router.post('/update-user',ensureAuthenticated, function(req, res){
    userController.userUpdate(req, res);
});

router.get('/user/logout',function(req, res){
    userController.logout(req, res);
});

router.get('/registration-request',ensureAuthenticated,function(req, res){
    registrationRequestController.index(req, res);
})

router.get('/favicon.ico',function (req, res) {	
    res.status(204).send();
});

module.exports = router;