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
    try{
//        let carMakes    = await commonModel.getCarMake();
//        let carModels   = await commonModel.getCarModel();
//        let carVariants = await commonModel.getCarVariant();
        let [carMakes, carModels, carVariants] = await Promise.all([commonModel.getCarMake(), commonModel.getCarModel(), commonModel.getCarVariant()]);
        carMakes.forEach(function (carMake, index) {
            let models = new Array();
            carModels.forEach(function (carModel, index) { 
                let variants = new Array();
                if(carMake.make_id == carModel.make_id){
                    carVariants.forEach(function (carVariant, index) {  
                        if(carModel.model_id == carVariant.model_id){
                            variants.push(carVariant);
                        }                        
                    });
                    models.push(carModel);
                    if(variants.length){
                        redisHelper.setJSON('car_variants_'+carModel.model_id, variants); 
                    }
                }                       
            });   
            if(models.length){
                redisHelper.setJSON('car_models_'+carMake.make_id, models); 
            }
        });       
        res.send('Done');
    }catch(err){
        console.log(err);
        res.send('Error');
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
