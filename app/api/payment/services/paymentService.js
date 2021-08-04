const commonHelper = require('../../../../helpers/commonHelper'),
    UsersModel = require('../../user/models/usersModel'),
    PaymentModel = require('../models/paymentModel'),
    commonModel = require('../../../common/models/commonModel'),
    fs = require('fs'),
    stripe = require('stripe')(config.stripe.secretkey),
    moment = require('moment');

class PaymentService {
    constructor() {}
}

PaymentService.saveCard = function (params) {
    let that = this;
    return new Promise(async function (resolve, reject) {
        try {
            let response = {};
            let user = await UsersModel.user(params.userId);
            let { number, exp_month, exp_year, cvc} = params;
            if (user && user.customer) {
                const token = await stripe.tokens.create({
                    card: { number, exp_month, exp_year, cvc},
                });

                if (token && token.id) {
                    const card = await stripe.customers.createSource(
                        user.customer,
                        { source: token.id }
                    );
                    if(card && card.id){
                        params.cardId = card.id;
                        await PaymentModel.addCard(params);
                    }
                    response = card;
                }
            }
            resolve(response);
        }catch(err){
            reject(err);
        }
    });
}

PaymentService.transferAmount = function (params) {
    let that = this;
    return new Promise(async function (resolve, reject) {
        try {
            let response = {};
            let { amount , customer_id } = params;
            let card = await PaymentModel.card(customer_id);

            const account = await stripe.accounts.create({
                type: 'custom',
                country: 'US',
                email: 'jenny.rosen@example.com',
                external_account: card.card_id,
                capabilities: {
                    card_payments: { requested: true },
                    transfers: { requested: true },
                },
            });
            console.log(account);
            /* const transfer = await stripe.transfers.create({
                amount: amount,
                currency: 'usd',
                destination: card.card_id,
                transfer_group: 'ORDER_95',
            }); */
            resolve(transfer);

        }catch(err){
            reject(err);
        }
    });
}

module.exports = PaymentService;