const commonHelper = require('../../../../helpers/commonHelper'),
    UsersModel = require('../models/usersModel'),
    commonModel = require('../../../common/models/commonModel'),
    fs = require('fs'),
    moment = require('moment');

class UsersService {
    constructor() {}
}

UsersService.login = function (params) {
    let that = this;
    return new Promise(async function (resolve, reject) {
        try {
            let { username, password } = params;
            let data = await UsersModel.authenticate(username, password);
            resolve(data);
        }catch(err){
            reject(err);
        }
    });
}

UsersService.register = function (params) {
    let that = this;
    return new Promise(async function (resolve, reject) {
        try{
            let data = await UsersModel.register(params);
            if (data && data.id) {
                params.user_id = data.id;
                await UsersModel.createStripeCustomer(params);
            }
            resolve(data);
        }catch(err){
            reject(err);
        }
    });
}

module.exports = UsersService;