var ApiController   = require('./apiController');
var commonHelper    = require(HELPER_PATH+'commonHelper.js');

class RegistrationController extends ApiController{
    constructor() {
        super();
    }
}
    
RegistrationController.getRegistration = async function(req, res){
    var query = {};
    var errors = new Array();
    req.elk.module      = 'Registration';
    req.elk.sub_module  = 'getRegistration'; 
    if(req.query.registration_number){
        query.registration_number = req.query.registration_number;
    }else{
        var error = commonHelper.formatError('ERR10020', 'registration_number');
        errors.push(error);
    }

    var options = {
                    //protocol: config.autodb.protocol,
                    host    : config.autodb.host,
                    path    : '/v1/registration',
                    headers: {
                            'Authorization' : 'Bearer '+config.autodb.token
                        }
                };

    try{
        if(!errors.length){
            let result = await commonHelper.sendGetRequest(query, options);
            if(result.data){
                this.sendResponse(req, res, 200, false, result.data, false);
            }else if(result.errors){
                throw result.errors;                       
            }else{
                throw ERROR.DEFAULT_ERROR;                        
            }  
        }else{
            throw errors;
        }
    }catch(e){
        this.sendResponse(req, res, 400, false, false, e);
    }                
}
    
module.exports = RegistrationController;
