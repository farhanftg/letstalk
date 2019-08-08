var registrationModel       = require('../../registration/models/registrationModel');
var registrationTextModel   = require('../../registration/models/registrationTextModel');
var requestRegistrationModel= require('../../registration/models/requestRegistrationModel');
var commonModel             = require('../../common/models/commonModel');
var commonHelper            = require(HELPER_PATH+'commonHelper.js');
var redisHelper             = require(HELPER_PATH+'redisHelper');

class ConsoleController{
    constructor() {
    }
}

ConsoleController.getAllMMV = async function(req, res){ 
    try{
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
                    if(variants.length){
                        redisHelper.setJSON('car_variants_'+carModel.model_id, variants); 
                    }
                    carModel.model_values = [];
                    let carModelStr = carModel.model.replace('-', ' ').replace(/\s\s+/g, ' ').trim();
                    let carModelArr = carModelStr.split(' ');
                    if(carModelArr.length > 1){
                        carModel.model_values = [carModelStr, carModelArr.join(''), carModelArr.join('-')];
                    }
                    models.push(carModel);
                }                       
            });   
            if(models.length){
                redisHelper.setJSON('car_models_'+carMake.make_id, models); 
            }
            carMake.make_values = [];
            let carMakeStr = carMake.make.replace('-', ' ').replace(/\s\s+/g, ' ').trim();
            let carMakeArr = carMakeStr.split(' ');
            if(carMakeArr.length > 1){
                carMake.make_values = [carMakeStr, carMakeArr.join(''), carMakeArr.join('-')];
            }
        });      
        redisHelper.setJSON('car_makes', carMakes); 
        
        let [bikeMakes, bikeModels, bikeVariants] = await Promise.all([commonModel.getBikeMake(), commonModel.getBikeModel(), commonModel.getBikeVariant()]);
        
        bikeMakes.forEach(function (bikeMake, index) {
            let models = new Array();
            bikeModels.forEach(function (bikeModel, index) { 
                let variants = new Array();
                if(bikeMake.make_id == bikeModel.make_id){
                    bikeVariants.forEach(function (bikeVariant, index) {  
                        if(bikeModel.model_id == bikeVariant.model_id){
                            variants.push(bikeVariant);
                        }                        
                    });
                    if(variants.length){
                        redisHelper.setJSON('bike_variants_'+bikeModel.model_id, variants); 
                    }
                    bikeModel.model_values = [];
                    let bikeModelStr = commonHelper.removeMakeNameFromModelName(bikeModel.make, bikeModel.model);
                    bikeModelStr     = bikeModelStr.replace('-', ' ').replace(/\s\s+/g, ' ').trim();
                    let bikeModelArr = bikeModelStr.split(' ');
                    if(bikeModelArr.length > 1){
                        bikeModel.model_values = [bikeModelStr, bikeModelArr.join(''), bikeModelArr.join('-')];
                    }
                    models.push(bikeModel);
                }                       
            });   
            if(models.length){
                redisHelper.setJSON('bike_models_'+bikeMake.make_id, models); 
            }
            bikeMake.make_values = [];
            let bikeMakeStr = bikeMake.make.replace('-', ' ').replace(/\s\s+/g, ' ').trim();
            let bikeMakeArr = bikeMakeStr.split(' ');
            if(bikeMakeArr.length > 1){
                bikeMake.make_values = [bikeMakeStr, bikeMakeArr.join(''), bikeMakeArr.join('-')];
            }
        });     
        redisHelper.setJSON('bike_makes', bikeMakes); 
        
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
