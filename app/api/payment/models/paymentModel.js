var ApiModel = require('../../../common/models/ApiModel');
var path = require('path');
var qs = require('qs');
var commonHelper = require(HELPER_PATH + 'commonHelper.js');
const commonModel = require('../../../common/models/commonModel');
const _TABLE = config.mysqlTable.cards;

class PaymentModel extends ApiModel {
    constructor() {
        super();
    }
}
PaymentModel.addCard = async function (query) {
    let that = this;
    return new Promise(async function (resolve, reject) {
        try {
            let card = await that.insertOne({ user_id: query.userId, card_id: query.cardId }, _TABLE);
            resolve(card);
        }catch(err){
            reject(err);
        }
    });
}

PaymentModel.card = function (id) {
    let that = this;
    return new Promise(async function (resolve, reject) {
        try {
            let data = await that.findOne(` user_id = ${id} `, _TABLE);
            resolve(data);
        } catch (err) {
            reject(err);
        }
    });
}

PaymentModel.creditRecharge = function (amount , userId) {
    let that = this;
    return new Promise(async function (resolve, reject) {
        try {
            let data = await that.executeQuery(`UPDATE users SET amount= amount+${amount} WHERE id = ${userId}` , false)
            resolve(data);
        } catch (err) {
            reject(err);
        }
    });
}

module.exports = PaymentModel;