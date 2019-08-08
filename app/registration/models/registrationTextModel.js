var uniqueValidator     = require('mongoose-unique-validator');
var validationHelper    = require(HELPER_PATH+'validationHelper');
var commonHelper        = require(HELPER_PATH+'commonHelper');
var registrationModel   = require('../models/registrationModel');
var vehicleClassModel   = require('../models/vehicleClassModel');
var CommonModel         = require('../../common/models/commonModel');

var RegistrationTextSchema = new Schema({    
    text                : {type: String, unique:true},
    make_id             : {type: String},
    model_id            : {type: String}, 
    variant_id          : {type: String},
    make_name           : {type: String},
    model_name          : {type: String}, 
    variant_name        : {type: String},
    variant_display_name: {type: String},
    vehicle_class       : {type:String},
    category            : {type: String},
    registration_count  : Number,
    registration_updated: Number,
    source                      : {type: String, required:true},
    sub_source                  : {type: String},
    status                      : {type:Number, default:1},   
    sub_status                  : {type:Number, default:1},   
    updated_by                  : String,
    created_at                  : {type: Date},
    updated_at                  : {type: Date, default: Date.now}
},{collection:'registration_text'});

RegistrationTextSchema.plugin(uniqueValidator);

RegistrationTextSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

RegistrationTextSchema.set('toJSON', {
    virtuals: true
});

RegistrationTextSchema.pre('findOneAndUpdate', function(next) {
  this.options.runValidators = true;
  this.options.context = 'query';
  next();
});

var RegistrationText = mongoose.model('RegistrationText', RegistrationTextSchema);

RegistrationText.addRegistrationText =  function(data){
    return new Promise( async function(resolve, reject) {
        var registrationText = new RegistrationText();
               
        registrationText.text               = data.text?data.text.trim():'';             
        registrationText.make_id            = data.make_id?data.make_id:'';
        registrationText.make_name          = data.make_name?data.make_name:'';
        registrationText.model_id           = data.model_id?data.model_id:'';
        registrationText.model_name         = data.model_name?data.model_name:'';
        registrationText.variant_id         = data.variant_id?data.variant_id:'';
        registrationText.variant_name       = data.variant_name?data.variant_name:'';       
        registrationText.variant_display_name= data.variant_display_name?data.variant_display_name:'';     
        registrationText.vehicle_class       = data.vehicle_class ? data.vehicle_class:'';
        registrationText.category           = data.category?data.category:'';    
        registrationText.status             = data.status?data.status:1;
        registrationText.sub_status         = data.sub_status?data.sub_status:1;
        registrationText.source             = data.source?data.source:'';
        registrationText.sub_source         = data.sub_source?data.sub_source:'';
        registrationText.updated_by         = data.updated_by?data.updated_by:'';
        registrationText.created_at         = Date.now(); 
         
        try{
            let result = await registrationText.saveAsync();
            resolve(result);
        }catch(e){
            reject(e);
        }
    });
}

RegistrationText.updateRegistrationText =  function(data){
    return new Promise( async function(resolve, reject) {
        var registrationText    = {};
              
        if(data.hasOwnProperty('maker_model')){
            registrationText.maker_model = data.maker_model.toUpperCase();
        }        
        if(data.hasOwnProperty('make_id')){
            registrationText.make_id = data.make_id;
        }
        if(data.hasOwnProperty('make_name')){
            registrationText.make_name = data.make_name;
        }
        if(data.hasOwnProperty('model_id')){
            registrationText.model_id = data.model_id;
        }
        if(data.hasOwnProperty('model_name')){
            registrationText.model_name = data.model_name?data.model_name:'';
        }
        if(data.hasOwnProperty('variant_id')){
            registrationText.variant_id = data.variant_id;
        }
        if(data.hasOwnProperty('variant_name')){
            registrationText.variant_name = data.variant_name;
        }
        if(data.hasOwnProperty('variant_display_name')){
            registrationText.variant_display_name = data.variant_display_name;
        }
        if(data.hasOwnProperty('category')){
            registrationText.category = data.category;
        }
        if(data.hasOwnProperty('registration_count')){
            registrationText.registration_count = data.registration_count;
        }  
        if(data.hasOwnProperty('registration_updated')){
            registrationText.registration_updated = data.registration_updated;
        }  
        if(data.hasOwnProperty('status')){
            registrationText.status = data.status;  
        }
        if(data.hasOwnProperty('sub_status')){
            registrationText.sub_status = data.sub_status;  
        }
        if(data.hasOwnProperty('updated_by')){
            registrationText.updated_by = data.updated_by;
        }
        try{
            let result = await RegistrationText.updateManyAsync({_id:{$in:data.id}}, registrationText);
            resolve(result._id);
        }catch(e){
            reject(e);
        }
    });
}

RegistrationText.autoMapRegistrationText = function(limit){
    var registrationModel = require('../models/registrationModel');
    return new Promise( async function(resolve, reject) {
        try{
            let count = 0;
            let pendingRegistrationTexts = await RegistrationText.find({status:config.status.pending}).limit(limit).execAsync();
            for(var i=0;  i<pendingRegistrationTexts.length; i++){
                let autoMappedRegistrationText = await RegistrationText.getAutoMappedRegistrationText(pendingRegistrationTexts[i].text);
                if(autoMappedRegistrationText.make_id && autoMappedRegistrationText.model_id){
                    let registration    = {};
                    let registrationText= {};
                    
                    registrationText.make_id    = autoMappedRegistrationText.make_id;
                    registrationText.make_name  = autoMappedRegistrationText.make_name;
                    registrationText.model_id   = autoMappedRegistrationText.model_id;
                    registrationText.model_name = autoMappedRegistrationText.model_name;
                    registrationText.category   = autoMappedRegistrationText.category;
                    registrationText.status     = config.status.autoMapped;
                    RegistrationText.updateOneAsync({_id:pendingRegistrationTexts[i]._id}, registrationText);
                    
                    registration.central_make_id    = autoMappedRegistrationText.make_id;;
                    registration.central_make_name  = autoMappedRegistrationText.make_name;
                    registration.central_model_id   = autoMappedRegistrationText.model_id;;
                    registration.central_model_name = autoMappedRegistrationText.model_name;
                    registration.vehicle_category   = autoMappedRegistrationText.category;
                    registration.status             = config.status.autoMapped;
                    registrationModel.updateManyAsync({maker_model:pendingRegistrationTexts[i].text, status:config.status.pending}, registration);
                    count++;
                }
            }     
            resolve(count);
        }catch(e){
            reject(e);
        }
    });
}

RegistrationText.getAutoMappedRegistrationText = function(text, category = false, correctMmv = true){
    let that = this;
    return new Promise( async function(resolve, reject) {
        try{
            let data = {};
            let approvedRows = await RegistrationText.aggregateAsync([
                { $match: {status: config.status.approved,model_name:{$ne:null}}},
                {
                    $project: {
                    "make_id": 1,    
                    "make_name": 1,
                    "model_id": 1,    
                    "model_name": 1,
                    "category": 1,
                    "length": { $strLenCP: "$model_name" }
                    }
                },
                { $match: {length:{$gte:3}}},
                { $sort: { length: -1} },
            ]);
            
            for(var i=0;  i<approvedRows.length; i++){
                let approvedRow = approvedRows[i];
                if(approvedRow.make_id && approvedRow.model_id){
                    var textArr = text.toLowerCase().split(' ');
                    if((text.toLowerCase().indexOf(approvedRow.make_name.toLowerCase()) >= 0 && (approvedRow.model_name.length > 1 && text.toLowerCase().indexOf(approvedRow.model_name.toLowerCase()) >= 0)) || (approvedRow.model_name.length>=3 && textArr.indexOf(approvedRow.model_name.toLowerCase()) >=0)){                                                                  
                        data = approvedRow;
                        break;
                    }           
                }             
            }   
            
            if(config.autoMapRegistrationText.autoMapByMmv && !data.make_id && !data.model_id){
                data = await that.getAutoMappedRegistrationTextByMMV(category, text);
            }
            
            if(correctMmv && config.autoMapRegistrationText.autoMapByCorrectMMV && !data.make_id && !data.model_id){               
                for(let mmv of config.autoMapRegistrationText.mmv) {
                    if(mmv.values){
                        for (let value of mmv.values) {
                            if(value && text.toLowerCase().includes(value.toLowerCase())){
                                let valueRegex   = new RegExp(' '+value+' ', "ig");
                                text    = text.replace(valueRegex, ' '+mmv.name+' ');
                                data    = await that.getAutoMappedRegistrationText(text, false, false);
                                break;
                            }
                        }
                    }
                }                
            }    
            resolve(data);
        }catch(e){
            reject(e);
        }
    });
},
RegistrationText.getAutoMappedRegistrationTextByMMV = function (category, text) {
    return new Promise( async function(resolve, reject) {
        try{
            let mmv = {};
            mmv.category = category;
            if(category && (category == config.vehicleCategory.fourWheeler)){
                let carMakes = await CommonModel.getCarMake();
                for (let i = 0; i < carMakes.length; i++){
                    if(carMakes[i].make && (text.toLowerCase().indexOf(carMakes[i].make.toLowerCase()) >= 0)){
                        mmv.make_id   = carMakes[i].make_id;
                        mmv.make_name = carMakes[i].make;
                        break;
                    }
                }
                
                if(mmv.make_id){
                    carModels = await CommonModel.getCarModel(mmv.make_id);
                    carModels = carModels.filter(carModel => carModel.model && (carModel.model.length >= 3));
                    //sort array by model name desc
                    carModels.sort((a, b) => b.model.length - a.model.length);

                    for (let i = 0; i < carModels.length; i++){
                        if (text.toLowerCase().indexOf(carModels[i].model.toLowerCase()) >= 0) {
                            mmv.model_id   = carModels[i].model_id;
                            mmv.model_name = carModels[i].model;
                            break;
                        }
                    }
                }

            }else if(category && (category == config.vehicleCategory.twoWheeler)){
                let bikeMakes = await CommonModel.getBikeMake();

                for (let i = 0; i < bikeMakes.length; i++){
                    if (bikeMakes[i].make && (text.toLowerCase().indexOf(bikeMakes[i].make.toLowerCase()) >= 0)) {
                        mmv.make_id   = bikeMakes[i].make_id;
                        mmv.make_name = bikeMakes[i].make;
                        break;
                    }
                }

                if(mmv.make_id){
                    bikeModels = await CommonModel.getBikeModel(mmv.make_id);
                    bikeModels = bikeModels
                        .map(bikeModel => {
                            bikeModel.model = commonHelper.removeMakeNameFromModelName(bikeModel.make, bikeModel.model)
                            return bikeModel;
                        })
                        .filter(bikeModel => bikeModel.model && (bikeModel.model.length >= 3));

                    //sort array by model name desc
                    bikeModels.sort((a, b) => b.model.length - a.model.length);
                    
                    for (let i = 0; i < bikeModels.length; i++){
                        if (text.toLowerCase().indexOf(bikeModels[i].model.toLowerCase()) >= 0) {
                            mmv.model_id = bikeModels[i].model_id;
                            mmv.model_name = bikeModels[i].model;
                            break;
                        }
                    }
                }
            }
            resolve(mmv);
        }
        catch(err){
            reject(err);
        }
    })
}

module.exports = RegistrationText;