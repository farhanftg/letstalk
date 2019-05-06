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
        let registrationRequest = await RequestRegistration.registrationRequestByRegistrationNo(requestData.registration_number);
        
        if(!registrationRequest){
            RequestRegistration.create(requestData,(err , result) => {
                if(err){
                    reject(err);
                }else{
                    resolve(result);
                }
            });
        }else{
            resolve(registrationRequest);
        }
    });
}

RequestRegistration.registrationRequestByRegistrationNo = function(registrationNo){

    return new Promise(async function(resolve, reject){
        RequestRegistration.findOne({registration_number:registrationNo},(err, result) => {
            if(err){
                reject(err);
            }else{
                resolve(result);
            }
        });
    });
}

RequestRegistration.getPandingRequestRegistration = function(){
    return new Promise(async function(resolve, reject){
        RequestRegistration.find(
            {status:0},
            {registration_number:1},
            (err,result) => {
                if(err){
                    reject(err);
                }else{
                    resolve(result);
                }
            }) 
    });
}

module.exports = RequestRegistration;
