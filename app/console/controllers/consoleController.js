var registrationModel       = require('../../registration/models/registrationModel');
var registrationTextModel   = require('../../registration/models/registrationTextModel');
var requestRegistrationModel= require('../../registration/models/requestRegistrationModel');
var commonModel             = require('../../common/models/commonModel');
var redisHelper             = require(HELPER_PATH+'redisHelper');

class ConsoleController{
    constructor() {
    }
}

ConsoleController.getAllMMV = async function(req, res){ 
    let modelLength = 0;
    let variantLength = 0;
    try{
        let carMakes    = await commonModel.getCarMake();
        let carModels   = await commonModel.getCarModel();
        let carVariants = await commonModel.getCarVariant();

        carMakes.forEach(async function (carMake, index) {
            let model = new Array();
//            console.log('MakeId: ', carMake.make_id);
            carModels.forEach(async function (carModel, index) { 
                let variant = new Array();
//                console.log('ModelId: ', carModel.model_id);
                if(carMake.make_id == carModel.make_id){
                    carVariants.forEach(function (carVariant, index) {  
//                        console.log('VariantId: ', carVariant.version_id);
                        if(carModel.model_id == carVariant.model_id){
                            variant.push(carVariant);
                        }                        
                    });
                    model.push(carModel);
                    variantLength += variant.length;
//                     console.log('variant: ', variant.length);
                    redisHelper.setJSON('car_variants_'+carModel.model_id, variant); 
                }                       
            });
            modelLength += model.length;
//            console.log('model: ', model.length);
           
            redisHelper.setJSON('car_models_'+carMake.make_id, model); 
        });       
        console.log(modelLength);
        console.log(variantLength);
        //res.send('Done');
    }catch(err){
        console.log(err);
        res.send("Error");
    }
}

ConsoleController.autoMapRegistrationText = async function(req, res){ 
    try{
        let limit = req.query && req.query.limit?req.query.limit:config.autoMapRegistrationText.limit;
        let count = await registrationTextModel.autoMapRegistrationText(limit);
        res.send('Auto Mapped Registration Text : '+count);
    }catch(err){
        console.log(err);
        res.send("Error");
    }
}

ConsoleController.getRegistrationFromRegistrationRequest = async function(req, res){
    try{
        let pendingRegistration = await requestRegistrationModel.findAsync({status:0},{registration_number:1});
        if(pendingRegistration.length){
            pendingRegistration.forEach(async function(element, index){
                registrationModel.processRegistration(element.registration_number)
                    .then(function(registration){
                        if(registration){
                            requestRegistrationModel.findOneAndUpdateAsync({_id:element._id},{status:1}).catch(function(e){
                                console.log(e);
                            });
                        }
                    })
                    .catch(e => {
                        console.log(e);
                    })
            });
        }
        res.send('Done');
    }catch(err){
        console.log(err);
        res.send("Error");
    }
}

module.exports = ConsoleController;
