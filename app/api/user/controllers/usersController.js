var path = require('path');
var qs = require('qs');
var ApiController = require('../../../common/controllers/apiController');
var commonHelper = require(HELPER_PATH + 'commonHelper.js');
const commonModel = require('../../../common/models/commonModel');
const UsersService = require('../services/usersService');
const stripe = require('stripe')(config.stripe.secretkey);
const STRIPE_CUSTOMER = 'cus_JsBO0lhrNOKNPo';
class UsersController extends ApiController {
    constructor() {
        super();
    }
}

UsersController.login = async function(req , res) {
    let that = this;
    try {
        var errors = new Array();
        if (errors.length) throw error;

        let data = await UsersService.login(req.body);
        that.sendSuccessResponse(req, res, data);
    } catch (e) {
        that.sendErrorResponse(req, res, e)
    }
}

UsersController.register = async function (req, res) {
    var query = {};
    var errors = new Array();
    let that = this;

    if (!req.body.name) {
        error = this.formatError('ERR10001', 'name', 'Name is required');
        errors.push(error);
    }

    if (!req.body.password) {
        error = this.formatError('ERR10001', 'password', 'Password is required');
        errors.push(error);
    }

    if (!req.body.username) {
        error = this.formatError('ERR10001', 'username', 'Username is required');
        errors.push(error);
    }

    if (!req.body.email) {
        error = this.formatError('ERR10001', 'email', 'Email is required');
        errors.push(error);
    }

    try {
        if (errors.length) throw errors;

        let { name , username , email , password } = req.body;
        let data = await UsersService.register({name,username,email,password});
        that.sendSuccessResponse(req, res, data);
    } catch (e) {
        that.sendErrorResponse(req, res, e)
    }
}

module.exports = UsersController;