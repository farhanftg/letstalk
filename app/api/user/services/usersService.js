const commonHelper = require('../../../../helpers/commonHelper'),
    UsersModel = require('../models/usersModel'),
    commonModel = require('../../../common/models/commonModel'),
    fs = require('fs'),
    moment = require('moment');

const MINUTES_LIMIT = 5;

class UsersService {
    constructor() {
    }
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

UsersService.validateCall = function (userId, celebrityId) {
    let that = this;
    return new Promise(async function (resolve, reject) {
        try {

            let celebrity = await UsersModel.user(celebrityId);
            let user = await UsersModel.user(userId);
            if (celebrity && celebrity.id) {
                if (user.amount < (MINUTES_LIMIT * celebrity.per_minuts)){
                    throw `Minimum balance of 5 minutes (INR ${(MINUTES_LIMIT * celebrity.per_minuts)}) is required to start call with ${celebrity.name}`;
                }
            }
            resolve(celebrity);
        } catch (err) {
            reject(err);
        }
    });
}

UsersService.userList = function () {
    let that = this;
    return new Promise(async function (resolve, reject) {
        try {

            let data = await UsersModel.userList();
            resolve(data);
        } catch (err) {
            reject(err);
        }
    });
}

UsersService.userDetail = function (userId) {
    let that = this;
    return new Promise(async function (resolve, reject) {
        try {

            let data = await UsersModel.user(userId);
            resolve(data);
        } catch (err) {
            reject(err);
        }
    });
}

module.exports = UsersService;