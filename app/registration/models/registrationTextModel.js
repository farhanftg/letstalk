var uniqueValidator     = require('mongoose-unique-validator');
var validationHelper    = require(HELPER_PATH+'validationHelper');
var commonHelper        = require(HELPER_PATH+'commonHelper');

var RegistrationTextSchema = new Schema({    
    text                 : {type: String, unique:true},
    make_id             : {type: String},
    model_id            : {type: String}, 
    variant_id          : {type: String},
    make_name           : {type: String},
    model_name          : {type: String}, 
    variant_name        : {type: String},
    variant_display_name: {type: String},
    category            : {type: String},
    registration_count  : Number,
    registration_updated: Number,
    source                      : {type: String, required:true},
    sub_source                  : {type: String},
    status                      : {type:String, default:1},   
    sub_status                  : {type:String, default:1},   
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
        registrationText.category           = data.category?data.category:'';           
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

module.exports = RegistrationText;