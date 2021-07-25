var uniqueValidator     = require('mongoose-unique-validator');
var validationHelper    = require(HELPER_PATH+'validationHelper');
var commonHelper        = require(HELPER_PATH+'commonHelper');
var commonModel         = require('../../common/models/commonModel');
var vehicleClassModel       = require('../models/vehicleClassModel');
var registrationTextModel   = require('../models/registrationTextModel');

var RegistrationSchema = new Schema({
    registration_number         : {type: String, validate:[validationHelper.validateRegistrationNumber,'{VALUE} is not valid'], unique:true}, 
    maker_model                 : {type: String},
    central_make_id             : {type: Number},
    central_model_id            : {type: Number}, 
    central_version_id          : {type: Number},
    central_make_name           : {type: String},
    central_model_name          : {type: String}, 
    central_version_name        : {type: String},
    manufacturing_date          : {type: Date},
    manufacturing_year          : Number,
    registration_date           : {type: Date},
    registration_year           : Number,
    owner_name                  : {type: String, required:true},  
    vehicle_class               : {type: String},
    vehicle_category            : {type: String},
    vehicle_category_code       : {type: Number},
    chassis_number              : String,
    engine_number               : String,
    cc                          : String,
    fuel_type                   : {type: String},
    rto_code                    : {type: String},
    rto_name                    : String,
    rto_city_id                 : String,
    rto_city_name               : String,
    autodb_registration_id      : String,
    pushed_to_autodb            : {type:Number, default:0}, 
    pushed_to_autodb_by         : String,
    source                      : {type: String, required:true},
    sub_source                  : {type: String},
    status                      : {type:Number, default:1},   
    sub_status                  : {type:Number, default:1},   
    updated_by                  : String,
    created_at                  : {type: Date},
    updated_at                  : {type: Date, default: Date.now}
},{collection:'registration'});

RegistrationSchema.plugin(uniqueValidator);

RegistrationSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

RegistrationSchema.virtual('registration_date_ymd').get(function(){   
    return this.registration_date?this.registration_date.toISOString().substring(0, 10):'';
});

RegistrationSchema.virtual('manufacturing_date_ymd').get(function(){
    return this.manufacturing_date?this.manufacturing_date.toISOString().substring(0, 10):'';
});

RegistrationSchema.set('toJSON', {
    virtuals: true
});

RegistrationSchema.pre('findOneAndUpdate', function(next) {
  this.options.runValidators = true;
  this.options.context = 'query';
  next();
});

var Registration = mongoose.model('Registration', RegistrationSchema);

Registration.addRegistration =  function(data){
    return new Promise( async function(resolve, reject) {
        var registration    = new Registration();
        
        registration.registration_number        = data.registration_number?data.registration_number.toUpperCase():'';
        registration.maker_model                = data.maker_model?data.maker_model.trim():'';             
        registration.central_make_id            = data.central_make_id?data.central_make_id:'';
        registration.central_make_name          = data.central_make_name?data.central_make_name:'';
        registration.central_model_id           = data.central_model_id?data.central_model_id:'';
        registration.central_model_name         = data.central_model_name?data.central_model_name:'';
        registration.central_version_id         = data.central_version_id?data.central_version_id:'';
        registration.central_version_name       = data.central_version_name?data.central_version_name:'';
        registration.registration_date          = data.registration_date?data.registration_date:'';
        registration.registration_year          = data.registration_year?data.registration_year:'';
        registration.manufacturing_date         = data.manufacturing_date?data.manufacturing_date:'';
        registration.manufacturing_year         = data.manufacturing_year?data.manufacturing_year:'';
        registration.chassis_number             = data.chassis_number?data.chassis_number:'';
        registration.engine_number              = data.engine_number?data.engine_number:'';
        registration.cc                         = data.cc?data.cc:'';
        registration.fuel_type                  = data.fuel_type?data.fuel_type:'';
        registration.vehicle_class              = data.vehicle_class?data.vehicle_class:'';
        registration.vehicle_category           = data.vehicle_category?data.vehicle_category:'';
        registration.owner_name                 = data.owner_name?data.owner_name.trim():'';
        registration.rto_code                   = data.rto_code?data.rto_code:'';
        registration.rto_name                   = data.rto_name?data.rto_name:'';
        registration.rto_city_id                = data.rto_city_id?data.rto_city_id:'';
        registration.rto_city_name              = data.rto_city_name?data.rto_city_name:''; 
        registration.status                     = data.status?data.status:1;
        registration.sub_status                 = data.sub_status?data.sub_status:1;
        registration.source                     = data.source?data.source:'';
        registration.sub_source                 = data.sub_source?data.sub_source:'';
        registration.updated_by                 = data.updated_by?data.updated_by:'';
        registration.created_at                 = Date.now(); 
         
        try{
            let result = await registration.saveAsync();
            resolve(result);
        }catch(e){
            reject(e);
        }
    });
}

Registration.updateRegistration =  function(data){
    return new Promise( async function(resolve, reject) {
        var registration    = {};
              
        if(data.hasOwnProperty('registration_number')){
            registration.registration_number = data.registration_number.toUpperCase();
        }
        if(data.hasOwnProperty('maker_model')){
            registration.maker_model = data.maker_model.toUpperCase();
        }        
        if(data.hasOwnProperty('central_make_id')){
            registration.central_make_id = data.central_make_id;
        }
        if(data.hasOwnProperty('central_make_name')){
            registration.central_make_name = data.central_make_name;
        }
        if(data.hasOwnProperty('central_model_id')){
            registration.central_model_id = data.central_model_id;
        }
        if(data.hasOwnProperty('central_model_name')){
            registration.central_model_name = data.central_model_name?data.central_model_name:'';
        }
        if(data.hasOwnProperty('central_version_id')){
            registration.central_version_id = data.central_version_id;
        }
        if(data.hasOwnProperty('central_version_name')){
            registration.central_version_name = data.central_version_name;
        }
        if(data.hasOwnProperty('registration_date')){
            registration.registration_date = data.registration_date;
        }
        if(data.hasOwnProperty('registration_year')){
            registration.registration_year = data.registration_year;
        }
        if(data.hasOwnProperty('manufacturing_date')){
            registration.manufacturing_date = data.manufacturing_date;
        }
        if(data.hasOwnProperty('manufacturing_year')){
            registration.manufacturing_year = data.manufacturing_year;
        }
        if(data.hasOwnProperty('chassis_number')){
            registration.chassis_number = data.chassis_number;
        }
        if(data.hasOwnProperty('engine_number')){
            registration.engine_number = data.engine_number;
        }
        if(data.hasOwnProperty('cc')){
            registration.cc = data.cc;
        }
        if(data.hasOwnProperty('fuel_type')){
            registration.fuel_type = data.fuel_type;
        }        
        if(data.hasOwnProperty('vehicle_class')){
            registration.vehicle_class = data.vehicle_class.trim();
        }
        if(data.hasOwnProperty('vehicle_category')){
            registration.vehicle_category = data.vehicle_category;
        }
        if(data.hasOwnProperty('owner_name')){            
            registration.owner_name  = data.owner_name?data.owner_name.trim():'';
        }
        if(data.hasOwnProperty('rto_code')){
            registration.rto_code = data.rto_code;
        }
        if(data.hasOwnProperty('rto_name')){
            registration.rto_name = data.rto_name;
        }
        if(data.hasOwnProperty('rto_city_id')){
            registration.rto_city_id = data.rto_city_id;
        }
        if(data.hasOwnProperty('rto_city_name')){
            registration.rto_city_name = data.rto_city_name;
        }
        if(data.hasOwnProperty('status')){
            registration.status = data.status;  
        }
        if(data.hasOwnProperty('sub_status')){
            registration.sub_status = data.sub_status;  
        }
        if(data.hasOwnProperty('autodb_registration_id')){
            registration.autodb_registration_id = data.autodb_registration_id;  
        }
        if(data.hasOwnProperty('pushed_to_autodb_by')){
            registration.pushed_to_autodb_by = data.pushed_to_autodb_by; 
        }
        if(data.hasOwnProperty('updated_by')){
            registration.updated_by = data.updated_by;
        }
        if(data.hasOwnProperty('source')){
            registration.source = data.source;
        }

        registration.pushed_to_autodb = 0; 
        try{
            let result = await Registration.findOneAndUpdateAsync({_id:data.id}, registration);
            resolve(result._id);
        }catch(e){
            reject(e);
        }
    });
}

Registration.formatAndSendRegistrationToAutoDB = function(registration){
    return new Promise(async function(resolve, reject) {
        try{
            registrationData = Registration.formatRegistrationDataForAutoDB(registration);
            let response = await Registration.sendRegistrationToAutoDB(registrationData);
            if(response){
                let data = await Registration.updateAsync({_id:registration._id}, {autodb_registration_id:response._id, pushed_to_autodb:1});
                resolve(data);
            }else{
                throw ERROR.DEFAULT_ERROR;
            }
        }catch(e){
            reject(e);
        }
    }); 
}

Registration.formatRegistrationDataForAutoDB= function(data, subSource){  
    if(data){              
        let registration = {};       
        registration.registration_number        = data.registration_number?data.registration_number.toUpperCase():'';
        registration.maker_model                = data.maker_model?data.maker_model.trim():'';             
        registration.make_id                    = data.central_make_id?data.central_make_id:0;
        registration.make_name                  = data.central_make_name?data.central_make_name:'';
        registration.model_id                   = data.central_model_id?data.central_model_id:0;
        registration.model_name                 = data.central_model_name?data.central_model_name:'';
        registration.version_id                 = data.central_version_id?data.central_version_id:0;
        registration.version_name               = data.central_version_name?data.central_version_name:'';
        registration.registration_date          = data.registration_date?data.registration_date:'';
        registration.registration_year          = data.registration_year?data.registration_year:0;
        registration.manufacturing_date         = data.manufacturing_date?data.manufacturing_date:'';
        registration.manufacturing_year         = data.manufacturing_year?data.manufacturing_year:0;
        registration.registration_date_ymd      = data.registration_date_ymd?data.registration_date_ymd:'';
        registration.manufacturing_date_ymd     = data.manufacturing_date_ymd?data.manufacturing_date_ymd:'';
        registration.chassis_number             = data.chassis_number?data.chassis_number:'';
        registration.engine_number              = data.engine_number?data.engine_number:'';
        registration.cc                         = data.cc?data.cc:'';
        registration.fuel_type                  = data.fuel_type?data.fuel_type:'';
        registration.vehicle_class              = data.vehicle_class?data.vehicle_class:'';
        registration.vehicle_category           = data.vehicle_category?config.autoDBVehicleCategory[data.vehicle_category]:'';
        registration.owner_name                 = data.owner_name?data.owner_name.trim():'';
        registration.rto_code                   = data.rto_code?data.rto_code:'';
        registration.rto_name                   = data.rto_name?data.rto_name:'';
        registration.rto_city_id                = data.rto_city_id?data.rto_city_id:'';
        registration.rto_city_name              = data.rto_city_name?data.rto_city_name:''; 
        if(!config.showMaskedDataForSubsource.includes(subSource)){
            registration.chassis_number             = '';
            registration.engine_number              = '';
        }
        return registration;
    }
    return;
}

Registration.sendRegistrationToAutoDB = async function(query){
    return new Promise(async function(resolve, reject) {
        var options = {
                        protocol: config.autodb.protocol,
                        host: config.autodb.host,
                        path    : '/v1/registration',
                        headers: {
                            'Authorization' : 'Bearer '+config.autodb.token
                        }
                    };
        try{
            let result = await commonHelper.sendPostRequest(query, options);
            if(result.status == 200){
                console.log('Registration added in AutoDB');
                resolve(result);            
            }else if(result.status == 400){
                throw result.message;                       
            }else{
                throw ERROR.DEFAULT_ERROR;                        
            }                     
        }catch(e){
            reject(e);
        }   
    });
}

Registration.formatRegistrationData = function(data){  
    if(data){          
        let registration = {};       
        registration.registration_number        = data.registration_number?data.registration_number.toUpperCase():'';
        registration.maker_model                = data.maker_model?data.maker_model.trim():'';             
        registration.central_make_id            = data.central_make_id?data.central_make_id:'';
        registration.central_make_name          = data.central_make_name?data.central_make_name:'';
        registration.central_model_id           = data.central_model_id?data.central_model_id:'';
        registration.central_model_name         = data.central_model_name?data.central_model_name:'';
        registration.central_version_id         = data.central_version_id?data.central_version_id:'';
        registration.central_version_name       = data.central_version_name?data.central_version_name:'';
        registration.registration_date          = data.registration_date?data.registration_date:'';
        registration.registration_year          = data.registration_year?data.registration_year:'';
        registration.manufacturing_date         = data.manufacturing_date?data.manufacturing_date:'';
        registration.manufacturing_year         = data.manufacturing_year?data.manufacturing_year:'';
        registration.registration_date_ymd      = data.registration_date_ymd?data.registration_date_ymd:'';
        registration.manufacturing_date_ymd     = data.manufacturing_date_ymd?data.manufacturing_date_ymd:'';
        registration.chassis_number             = data.chassis_number?data.chassis_number:'';
        registration.engine_number              = data.engine_number?data.engine_number:'';
        registration.cc                         = data.cc?data.cc:'';
        registration.fuel_type                  = data.fuel_type?data.fuel_type:'';
        registration.vehicle_class              = data.vehicle_class?data.vehicle_class:'';
        registration.vehicle_category           = data.vehicle_category?data.vehicle_category:'';
        registration.owner_name                 = data.owner_name?data.owner_name.trim():'';
        registration.rto_code                   = data.rto_code?data.rto_code:'';
        registration.rto_name                   = data.rto_name?data.rto_name:'';
        registration.rto_city_id                = data.rto_city_id?data.rto_city_id:'';
        registration.rto_city_name              = data.rto_city_name?data.rto_city_name:''; 
        return registration;
    }
    return;
}

Registration.processRegistration = function(registrationNumber){

    return new Promise(async function(resolve, reject){

        try{
            let registration = await Registration.findOneAsync({registration_number:registrationNumber});
            if(!registration){
                registration = await Registration.getRegistrationFromRtoVehicle(registrationNumber);
                let textData = await registrationTextModel.findOne({text:registration.maker_model});

                if(textData){
                    if(textData.status == config.status.autoMapped || textData.status == config.status.approved){
                        registration.central_make_id            = textData.make_id?textData.make_id:'';
                        registration.central_make_name          = textData.make_name?textData.make_name:'';
                        registration.central_model_id           = textData.model_id?textData.model_id:'';
                        registration.central_model_name         = textData.model_name?textData.model_name:'';
                        registration.central_version_id         = textData.version_id?textData.version_id:'';
                        registration.central_version_name       = textData.version_name?textData.version_name:'';
                        registration.vehicle_category           = textData.category?textData.category:'';
                        registration.status                     = textData.status;
                    }
                }else{
                    let registrationText = {};
                    registrationText.text           = registration.maker_model,
                    registrationText.category       = registration.vehicle_category, 
                    registrationText.vehicle_class  = registration.vehicle_class;
                    registrationText.source         = config.source.rtoVehicle;

                    let autoMappedRegistrationText = await registrationTextModel.getAutoMappedRegistrationText(registration.maker_model, registrationText.category);
        
                    if(autoMappedRegistrationText.make_id && autoMappedRegistrationText.model_id){
                        registrationText.make_id    = autoMappedRegistrationText.make_id;
                        registrationText.make_name  = autoMappedRegistrationText.make_name;
                        registrationText.model_id   = autoMappedRegistrationText.model_id;
                        registrationText.model_name = autoMappedRegistrationText.model_name;
                        registrationText.category   = autoMappedRegistrationText.category;
                        registrationText.status = config.status.autoMapped;

                        registration.central_make_id    = autoMappedRegistrationText.make_id;;
                        registration.central_make_name  = autoMappedRegistrationText.make_name;
                        registration.central_model_id   = autoMappedRegistrationText.model_id;;
                        registration.central_model_name = autoMappedRegistrationText.model_name;
                        registration.vehicle_category   = autoMappedRegistrationText.category;
                        registration.status = config.status.autoMapped;
                    }
                    
                    registrationTextModel.addRegistrationText(registrationText).catch(function(e){
                        console.log(e);
                    });
                }

                let data =  Registration.addRegistration(registration).catch(function(e){
                    console.log(e);
                });  
                       
                if(!registration.vehicle_category){
                    vehicleClassModel.createAsync({vehicle_class:registration.vehicle_class}).catch(function(e){
                        console.log(e);
                    });
                }
            }
            resolve(registration);
        }catch(e){
            reject(e);
        }
    });
}

Registration.getRegistrationFromRtoVehicle = function(registrationNumber){

    return new Promise(async function(resolve, reject){
        try{     
            let query = {};
            if(registrationNumber){
                query.r1 = new Array();
                let r2 = registrationNumber.match(/\d{4}$/);
                if(r2){
                    let r1 = registrationNumber.substring(0, r2['index']); 

                    query.r1.push(r1);
                    query.r2 = r2[0];
                }else{
                    throw ERROR.REGISTRATION_NUMBER_NOT_VALID;   
                }
            }else{
                throw ERROR.REGISTRATION_NUMBER_REQUIRED;   
            }
        
            var options = {
                        host    : config.rtoVehicle.host,
                        path    : '/batman.php'
                    };
            query.auth = config.rtoVehicle.authToken;  
            let result = await commonHelper.sendPostRequest(query, options);
            if(result && result.reason == 'active'){
                let rtoCode                = commonHelper.getRtoCodeByRegistrationNumber(registrationNumber);
                let [rtoDetail, vehicleClass] = await Promise.all([
                                                    commonModel.getRtoDetail({ rto_code: rtoCode }),
                                                    vehicleClassModel.findOneAsync({ vehicle_class: result.vh_class, status: 2 })
                                                ]);
                                                
                let registration = {};
                registration.registration_number    = registrationNumber;
                registration.maker_model            = result.vehicle_name;
                registration.owner_name             = result.owner_name;
                registration.registration_date      = new Date(result.regn_dt);
                registration.registration_date_ymd  = registration.registration_date?registration.registration_date.toISOString().substring(0, 10):'';
                registration.registration_year      = registration.registration_date.getFullYear();
                registration.fuel_type              = result.f_type;
                registration.chassis_number         = result.c_no;
                registration.engine_number          = result.e_no;
                registration.vehicle_class          = result.vh_class;
                registration.vehicle_category       = vehicleClass && vehicleClass.vehicle_category ? vehicleClass.vehicle_category: '';
                registration.rto_code               = rtoCode;
                registration.rto_name               = rtoDetail[0].rtoName;
                registration.rto_city_id            = rtoDetail[0].cityId;
                registration.rto_city_name          = rtoDetail[0].city;
                registration.source                 = config.source.rtoVehicle;
                
                resolve(registration);
            }else{
                throw ERROR.DEFAULT_ERROR;                        
            }        
        }catch(e){
            reject(e);
        }
    });
}

module.exports = Registration;