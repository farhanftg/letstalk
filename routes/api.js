//var express = require('express');
var router = express.Router();

var authHelper       = require(HELPER_PATH+'authHelper');
// Require controller modules
var commonController= require('../app/common/controllers/commonController');
var leadController  = require('../app/common/controllers/leadController');


router.post('/common/add', function(req, res){   
    commonController.add(req,res);
});

//router.get('/registration', function(req, res){   
//    RegistrationController.getRegistrationInfo(req,res);
//});

module.exports = router;