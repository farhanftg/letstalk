// Configuring Passport
var path            = require('path');
var md5             = require('md5');
var userModel       = require('../models/userModel.js');
var authHelper      = require(HELPER_PATH+'authHelper.js');
var passport = require('passport');
module.exports = {
 
    getLogin: function(req, res){
        if(!req.isAuthenticated()){
            res.render(path.join(BASE_DIR, 'views/user', 'login'),{layout:false,message: req.flash('message')});
        }else{
            res.redirect('/');
        }
    },

    postLogin: function(req, res,next){     
        passport.authenticate('login', function(err, user, info) {
            if (err) {
                return next(err); // will generate a 500 error
            }
            if (!user) {
                return res.status(409).render(path.join(BASE_DIR, 'views/user', 'login'),{layout:false,message: req.flash('message')});
            }
            req.login(user, function(err){
                if(err){
                    console.error(err);
                    return next(err);
                }
                return res.redirect('/');
            });
        })(req, res, next);
    },

    getSignup: function(req, res){
        if(!req.isAuthenticated()){
            res.render('register',{message: req.flash('message')});
        }else{
            res.redirect('/registration/text');
        }
    },
 
    postSignup: function(req,res){
        passport.authenticate('signup', {
            successRedirect: '/home',
            failureRedirect: '/signup',
            failureFlash : true 
        })
    },
    
    logout:function(req, res){
        req.logout();
        res.redirect('/login');
    },
    
    getUserToken: function(req, res){
        var data    = new Object();
        //var key     = {'name':'carDekho',insurance:true};
        if(req.body.email){
            userModel.getUserByEmail(req.body.email, function(err, user){ 
                if(user){
                    authHelper.generateToken(user.toJSON(), function(token){
                        if(token){
                            data.token     = token;
                            authHelper.sendResponse(res, 200, false, data);
                        }else{
                            authHelper.sendResponse(res, 400, 'Error can not be generated.');
                        }
                    });
                }else{
                    authHelper.sendResponse(res, 204, 'User does not exist.');
                }
            });
        }else{
            authHelper.sendResponse(res, 400, 'Email is required.');
        }
    }
}