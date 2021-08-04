var ApiModel = require('../../../common/models/ApiModel');
var commonHelper = require('../../../../helpers/commonHelper')
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var moment = require('moment');
var stripe = require('stripe')(config.stripe.secretkey);

class UsersModel extends ApiModel {
    constructor() {
        super();
    }
}

UsersModel.authenticate = function (username , password) {
    let that = this;
    return new Promise(async function (resolve, reject) {
        try {
            const user = await that.findOne(` username = '${username}' `, config.mysqlTable.users);
            if (user && (await bcrypt.compare(password, user.password))) {
                // Create token
                const token = jwt.sign(
                    { user_id: user.id, username },
                    config.jwt.tokenKey,
                    {
                        expiresIn: "2h",
                    }
                );

                // save user token
                user.token = token;
                resolve(user);
            }else{
                throw 'Invalid Credential';
            }
        }catch (e) {
            reject(e);
        }
    });
}

UsersModel.register = function(query) {
    let that = this;
    return new Promise(async function (resolve, reject) {
        try {
            let user = {};
            let username = query.username;
            const oldUser = await that.findOne(` username = '${query.username}' `, config.mysqlTable.users);
            if (oldUser) {
                throw ("User Already Exist. Please Login");
            }

            //Encrypt user password
            encryptedPassword = await bcrypt.hash(query.password, 10);

            // Create user in our database
            query.password = encryptedPassword;
            const userId = await that.insertOne(query, config.mysqlTable.users);
            user.id = userId;
            // Create token
            const token = jwt.sign(
                { user_id: userId, username },
                config.jwt.tokenKey,
                {
                    expiresIn: "2h",
                }
            );
            // save user token
            user.token = token;
            
            resolve(user);
        } catch (err){
            reject(err);
        }
    });
}

UsersModel.user = function (id) {
    let that = this;
    return new Promise(async function (resolve, reject) {
        try {
            let data = await that.findOne(` id = ${id} `, config.mysqlTable.users);
            resolve(data);
        }catch(err){
            reject(err);
        }
    });
}

UsersModel.createStripeCustomer = function (query) {
    let that = this;
    return new Promise(async function (resolve, reject) {
        try{
            const customer = await stripe.customers.create({
                name:query.name,
                email:query.email,
                phone:'',
                description: 'My First Test Customer (created for API docs)',
            });

            if(customer && customer.id){
                await that.update(` id = ${query.user_id} `, {customer:customer.id}, config.mysqlTable.users);
            }
            resolve(customer);

        }catch(err){
            reject(err);
        }
    });
}

UsersModel.userList = function () {
    let that = this;
    return new Promise(async function (resolve, reject) {
        try {
            let data = await that.find(` is_deleted = 0 `, config.mysqlTable.users);
            resolve(data);
        } catch (err) {
            reject(err);
        }
    });
}

module.exports = UsersModel;