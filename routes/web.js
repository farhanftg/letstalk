//var express = require('express');
var path    = require('path');
var multer  = require('multer')
var router  = express.Router();

var awsHelper = require(HELPER_PATH+'awsHelper');

// Require controller modules
var commonController        = require('../app/common/controllers/commonController');
var leadController          = require('../app/common/controllers/leadController');
var insurerController       = require('../app/common/controllers/insurerController');
var quotesController        = require('../app/common/controllers/quotesController');
var proposalController      = require('../app/common/controllers/proposalController');
var inspectionController    = require('../app/common/controllers/inspectionController');
var registrationController  = require('../app/common/controllers/registrationController');
var contentController       = require('../app/common/controllers/contentController');
var newsController          = require('../app/common/controllers/newsController');
var newsArticleController   = require('../app/common/controllers/newsArticleController');

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

router.post('/lead-add', function (req, res) {	
    leadController.addLead(req, res);
});

router.post('/lead-add1', function (req, res) {	
    leadController.addLead1(req, res);
});

router.post('/lead-update', function (req, res) {	
    leadController.updateLead(req, res);
});

router.get('/insurer/get-validation', function (req, res) {	
    insurerController.getValidation(req, res);
});

router.post('/quotes', function (req, res) {	
    quotesController.getQuotes(req, res);
});

router.post('/proposal', function (req, res) {	
    proposalController.addProposal(req, res);
});

router.get('/proposal', function (req, res) {	
    proposalController.getProposal(req, res);
});

router.post('/inspection/schedule', function (req, res) {	
    inspectionController.scheduleInspection(req, res);
});

router.get('/file/:registrationNumber/:fileName', function (req, res) {
    awsHelper.readFile(req, res);
});

router.get('/lead', function (req, res) {	
    leadController.getLead(req, res);
});

router.get('/content/home', function (req, res) {	
    contentController.getHomeContent(req, res);
});

router.post('/set-user-status', function (req, res) {	
    leadController.setUserStatus(req, res);
});

router.get('/insurer', function (req, res) {	
    insurerController.getInsurerContent(req, res);
});

router.get('/content/make', function (req, res) {	
    contentController.getMakeContent(req, res);
});

router.get('/make', function (req, res) {	
    commonController.getMakeContent(req, res);
});

router.get('/home', function (req, res) {	
    commonController.getHomeContent(req, res);
});

router.get('/content/plan-confirmation', function (req, res) {	
    contentController.getPlanConfirmation(req, res);
});

router.post('/getInsurers', function (req, res) {	
    insurerController.getInsurers(req, res);
});

router.get('/v1/registration', function (req, res) {	
    registrationController.getRegistration(req, res);
});

router.get('/news-article', function (req, res) {	
    newsArticleController.getNewsArticle(req, res);
});

router.get('/news', function (req, res) {	
    newsController.getNews(req, res);
});

router.get('/content/privacy-policy', function (req, res) {	
    contentController.getPrivacyPolicyContent(req, res);
});

router.get('/lead/report', function (req, res) {	
    leadController.getReport(req, res);
});

router.get('/favicon.ico',function (req, res) {	
    res.status(204).send();
});

router.all(config.allowedBrokeragePath, function(req, res) {
    commonController.sendRequestToBrokerage(req, res);
});

module.exports = router;