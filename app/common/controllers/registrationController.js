var ApiController       = require('./apiController');
var registrationModel   = require('../models/registrationModel');
var commonHelper        = require(HELPER_PATH+'commonHelper.js');

class RegistrationController extends ApiController{
    constructor() {
        super();
    }
}
    
RegistrationController.getRegistration = async function(req, res){
    let query = {};
    let errors = new Array();
    req.elk.module      = 'Registration';
    req.elk.sub_module  = 'getRegistration'; 
    if(req.query.registration_number){
        query.r1 = new Array();
        let r1 = req.query.registration_number.substring(0,6);
        let r2 = req.query.registration_number.substring(6,10)
        query.r1.push(r1);
        query.r2 = r2;
    }else{
        var error = commonHelper.formatError('ERR10020', 'registration_number');
        errors.push(error);
    }
    try{
        let registration = await registrationModel.findOne({registration_number:req.query.registration_number});
        if(!registration){
            var options = {
//                        protocol: config.rtoVehicle.protocol,
                        host    : config.rtoVehicle.host,
                        path    : '/batman.php'
                    };
            query.auth = config.rtoVehicle.authToken;  

                if(!errors.length){
                    let result = await commonHelper.sendPostRequest(query, options);
                    if(result.reason = 'active'){
                        let registration = {};
                        registration.registration_number = result.regn_no;
                        registration.maker_model = result.vehicle_name;
                        registration.owner_name = result.owner_name;
                        registration.registration_date = new Date(result.regn_dt);
                        registration.fuel_type = result.f_type;
                        registration.chassis_number = result.c_no;
                        registration.engine_number = result.e_no;
                        registration.vehicle_category = result.vh_class;
                        registration.source = 'rtoVehicle';
                        let data = await registrationModel.addRegistration(registration);
                        this.sendResponse(req, res, 200, false, data, false);
                    }else{
                        throw ERROR.DEFAULT_ERROR;                        
                    }  
                }else{
                    throw errors;
                }           
        }else{
            this.sendResponse(req, res, 200, false, registration, false);
        }    
    }catch(e){
        this.sendResponse(req, res, 400, false, false, e);
    }   
}
    
module.exports = RegistrationController;
