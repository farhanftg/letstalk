var ApiController           = require('../../common/controllers/apiController');
var registrationModel       = require('../models/registrationModel');
var registrationTextModel   = require('../models/registrationTextModel');
var commonHelper            = require(HELPER_PATH+'commonHelper.js');

class RegistrationController extends ApiController{
    constructor() {
        super();
    }
}
    
RegistrationController.getRegistration = async function(req, res){
    let errors = new Array();
    req.elk.module      = 'Registration';
    req.elk.sub_module  = 'getRegistration'; 
    if(!req.query.registration_number){
        var error = commonHelper.formatError('ERR10011', 'registration_number');
        errors.push(error);
    }
    try{
        if(!errors.length){
            let registration = await registrationModel.findOne({registration_number:req.query.registration_number});
            if(!registration || registration.status < 1){
                registration = await this.getRegistrationFromRtoVehicle(req.query.registration_number);
                let textData = await registrationTextModel.findOne({text:registration.maker_model});
                if(textData){
                    if(textData.status == 3){
                        registration.central_make_id            = textData.make_id?textData.make_id:'';
                        registration.central_make_name          = textData.make_name?textData.make_name:'';
                        registration.central_model_id           = textData.model_id?textData.model_id:'';
                        registration.central_model_name         = textData.model_name?textData.model_name:'';
                        registration.central_version_id         = textData.variant_id?textData.variant_id:'';
                        registration.central_version_name       = textData.variant_name?textData.variant_name:'';
                        registration.status                     = 3;
                    }
                }else{
                    registrationTextModel.addRegistrationText({text:registration.maker_model, source:'rtoVehicle'}).catch(function(e){
                        console.log(e);
                    });
                }
               
                let data =  registrationModel.addRegistration(registration).catch(function(e){
                    console.log(e);
                });   
            }
            if(registration.status == 3){
                this.sendResponse(req, res, 200, false, registration, false);
            }else{
                throw ERROR.REGISTRATION_DETAILS_NOT_VERIFIED;
            }
        }else{
            throw errors;
        }  
    }catch(e){
        this.sendResponse(req, res, 400, false, false, e);
    }   
}

RegistrationController.getRegistrationFromRtoVehicle = async function(registrationNumber){
    let query = {};
    if(registrationNumber){
        query.r1 = new Array();
        let r1 = registrationNumber.substring(0,6);
        let r2 = registrationNumber.substring(6,10)
        query.r1.push(r1);
        query.r2 = r2;
    }
    try{     
        var options = {
                    host    : config.rtoVehicle.host,
                    path    : '/batman.php'
                };
        query.auth = config.rtoVehicle.authToken;  
        let result = await commonHelper.sendPostRequest(query, options);
        if(result.reason = 'active'){
            let registration = {};
            registration.registration_number= result.regn_no;
            registration.maker_model        = result.vehicle_name;
            registration.owner_name         = result.owner_name;
            registration.registration_date  = new Date(result.regn_dt);
            registration.fuel_type          = result.f_type;
            registration.chassis_number     = result.c_no;
            registration.engine_number      = result.e_no;
            registration.vehicle_class      = result.vh_class;
            registration.source             = 'rtoVehicle';
            return registration;
        }else{
            throw ERROR.DEFAULT_ERROR;                        
        }        
    }catch(e){
        throw e;
    }   
}
    
module.exports = RegistrationController;
