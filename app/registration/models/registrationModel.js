var uniqueValidator     = require('mongoose-unique-validator');
var validationHelper    = require(HELPER_PATH+'validationHelper');
var commonHelper        = require(HELPER_PATH+'commonHelper');

var RegistrationSchema = new Schema({
    registration_number         : {type: String, validate:[validationHelper.validateRegistrationNumber,'{VALUE} is not valid'], unique:true}, 
    maker_model                 : {type: String},
    central_make_id             : {type: String},
    central_model_id            : {type: String}, 
    central_version_id          : {type: String},
    central_make_name           : {type: String},
    central_model_name          : {type: String}, 
    central_version_name        : {type: String},
    manufacturing_date          : {type: Date},
    manufacturing_year          : String,
    registration_date           : {type: Date},
    registration_year           : String,
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
    pushed_to_autodb            : Number,
    pushed_to_autodb_by         : String,
    source                      : {type: String, required:true},
    sub_source                  : {type: String},
    status                      : Number,   
    sub_status                  : Number,   
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
        registration.status                     = 1;  
        registration.sub_status                 = 1;
        registration.autodb_registration_id     = '';  
        registration.pushed_to_autodb           = 0    
        registration.pushed_to_autodb_by        = ''; 
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

Registration.formatRegistrationDataForAutoDB= function(registration){  
    if(registration){          
        registration = registration.toJSON();       
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

module.exports = Registration;