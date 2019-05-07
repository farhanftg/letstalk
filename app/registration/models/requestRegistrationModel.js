var validationHelper    = require(HELPER_PATH+'validationHelper');
var commonHelper        = require(HELPER_PATH+'commonHelper');

var RequestRegistrationSchema = new Schema({    
    source                      : {type: String, required:true},
    sub_source                  : {type: String},
    registration_number         : {type: String, validate:[validationHelper.validateRegistrationNumber,'{VALUE} is not valid'], unique:true}, 
    status                      : {type:Number, default:0},   
    created_at                  : {type: Date, default: Date.now},
    updated_at                  : {type: Date, default: Date.now}
},{collection:'request_registration'});

RequestRegistrationSchema.set('toJSON', {
    virtuals: true
});

var RequestRegistration = mongoose.model('RequestRegistration', RequestRegistrationSchema);

RequestRegistration.logRegistrationRequest = function(requestData){
    return new Promise(async function(resolve, reject){
        try{
            let registrationRequest = await RequestRegistration.registrationRequestByRegistrationNo(requestData.registration_number);
            if(!registrationRequest){
                await RequestRegistration.createAsync(requestData);
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

RequestRegistration.registrationRequestByRegistrationNo = function(registrationNo){

    return new Promise(async function(resolve, reject){
        try{
            let registrationRequest = await RequestRegistration.findOneAsync({registration_number:registrationNo});
            resolve(registrationRequest);
        }catch(e){
            console.log(e);
            reject(e);
        }
    });
}

RequestRegistration.getPendingRequestRegistration = function(){
    return new Promise(async function(resolve, reject){
        try{
            let pendingRegistrationRequest = await RequestRegistration.findAsync({status:0},{registration_number:1});
            resolve(pendingRegistrationRequest);
        }
        catch(e){
            console.log(e);
            reject(e);
        }
    });
}

module.exports = RequestRegistration;
