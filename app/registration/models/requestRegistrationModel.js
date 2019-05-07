var validationHelper    = require(HELPER_PATH+'validationHelper');
var commonHelper        = require(HELPER_PATH+'commonHelper');

var RegistrationRequestSchema = new Schema({    
    source                      : {type: String, required:true},
    sub_source                  : {type: String},
    registration_number         : {type: String, validate:[validationHelper.validateRegistrationNumber,'{VALUE} is not valid'], unique:true}, 
    status                      : {type:Number, default:0},   
    created_at                  : {type: Date, default: Date.now},
    updated_at                  : {type: Date, default: Date.now}
},{collection:'registration_request'});

RegistrationRequestSchema.set('toJSON', {
    virtuals: true
});

var RegistrationRequest = mongoose.model('RegistrationRequest', RegistrationRequestSchema);

RegistrationRequest.logRegistrationRequest = function(requestData){
    return new Promise(async function(resolve, reject){
        try{
            let registrationRequest = await RegistrationRequest.registrationRequestByRegistrationNo(requestData.registration_number);
            if(!registrationRequest){
                await RegistrationRequest.createAsync(requestData);
            }else{
                resolve(registrationRequest);
            }
        }
        catch(e){
            console.log(e);
            reject(e);
        }
    });
}

RegistrationRequest.registrationRequestByRegistrationNo = function(registrationNo){

    return new Promise(async function(resolve, reject){
        try{
            let registrationRequest = await RegistrationRequest.findOneAsync({registration_number:registrationNo});
            resolve(registrationRequest);
        }catch(e){
            console.log(e);
            reject(e);
        }
    });
}

RegistrationRequest.getPendingRequestRegistration = function(){
    return new Promise(async function(resolve, reject){
        try{
            let pendingRegistrationRequest = await RegistrationRequest.findAsync({status:0},{registration_number:1});
            resolve(pendingRegistrationRequest);
        }
        catch(e){
            console.log(e);
            reject(e);
        }
    });
}

module.exports = RegistrationRequest;
