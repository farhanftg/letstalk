var path = require('path');
var qs = require('qs');
var ApiController = require('../../../common/controllers/apiController');
var paymentModel = require('../models/paymentModel');
var commonHelper = require(HELPER_PATH + 'commonHelper.js');
const commonModel = require('../../../common/models/commonModel');
var PaymentService = require('../../payment/services/paymentService');
const Razorpay = require('razorpay');
class PaymentController extends ApiController {
    constructor() {
        super();
    }
}

PaymentController.saveCard = async function (req, res) {
    var query = {};
    var errors = new Array();

    if (!req.body.number){
        error = this.formatError('ERR10001', 'number','Card number required');
        errors.push(error);
    }
    
    if (!req.body.exp_month) {
        error = this.formatError('ERR10001', 'exp_month','Exp Month is required');
        errors.push(error);
    }

    if (!req.body.exp_year) {
        error = this.formatError('ERR10001', 'exp_year', 'Exp Year is required');
        errors.push(error);
    }

    if (!req.body.cvc) {
        error = this.formatError('ERR10001', 'cvc', 'CVC is required');
        errors.push(error);
    }
    
    try {
        if(errors.length) throw errors;

        req.body.userId = req.user.user_id;
        let response = await PaymentService.saveCard(req.body);
        
        this.sendResponse(req, res, 200, false, response, false);
    } catch (err) {
        this.sendResponse(req, res, 400, false, false, err);
    }   
}

PaymentController.transferAmount = async function (req, res) {
    var query = {};
    var errors = new Array();

    if (!req.body.amount) {
        error = this.formatError('ERR10001', 'amount', 'Amount required');
        errors.push(error);
    }

    if (!req.body.customer_id) {
        error = this.formatError('ERR10001', 'customer_id', 'User is required');
        errors.push(error);
    }

    try {
        if (errors.length) throw errors;

        req.body.userId = req.user.user_id;
        let response = await PaymentService.transferAmount(req.body);

        this.sendResponse(req, res, 200, false, response, false);
    } catch (err) {
        this.sendResponse(req, res, 400, false, false, err);
    }   
}

PaymentController.createOrder = async function (req , res) {
    var query = {};
    var errors = new Array();
    let that = this;
    if (!req.body.amount) {
        error = this.formatError('ERR10001', 'amount', 'Amount required');
        errors.push(error);
    }

    try {
        if (errors.length) throw errors;

        var instance = new Razorpay({ key_id: 'rzp_test_tAiMTJ6VsSm85J', key_secret: '0HRbLewCDemBfEXtmfnwrsEM' });

        var options = {
            amount: req.body.amount,  // amount in the smallest currency unit
            currency: "INR",
            receipt: "order_rcptid_11"
        };
        instance.orders.create(options, function (err, order) {
            that.sendResponse(req, res, 200, false, order, false);
        });

    } catch (err) {
        this.sendResponse(req, res, 400, false, false, err);
    }
}

PaymentController.creditRecharge = async function (req , res) {
    var query = {};
    var errors = new Array();
    let that = this;
    if (!req.body.amount) {
        error = this.formatError('ERR10001', 'amount', 'Amount required');
        errors.push(error);
    }

    try {
        if (errors.length) throw errors;
        let response = await PaymentService.creditRecharge(req.body.amount , req.user.user_id);
        that.sendResponse(req, res, 200, false, response, false);

    } catch (err) {
        this.sendResponse(req, res, 400, false, false, err);
    }
}

module.exports = PaymentController;