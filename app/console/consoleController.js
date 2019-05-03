var path                    = require('path');
var qs                      = require('qs');
const commonModel           = require('../common/models/commonModel');
const registrationModel     = require('../registration/models/registrationModel');
const registrationTextModel = require('../registration/models/registrationTextModel');
const registrationController = require('../registration/controllers/registrationController');
const requestRegistrationModel = require('../registration/models/requestRegistrationModel');

class ConsoleController{
    constructor() {
    }
}

ConsoleController.cronGetRegistrationFromRtoVehicleByRegistrationRequest = async function(req, res){

    let pendingRegistration = await requestRegistrationModel.getPandingRequestRegistration();
    if(pendingRegistration.length)
    {
        pendingRegistration.forEach(async function(element,index){
            
            let registration = await registrationController.getRegistrationFromRtoVehicle(element.registration_number); 
            // add to registration and text
            registrationTextModel.addRegistrationText({
                source:registration.source,
                text:registration.maker_model,
                vehicle_class: registration.vehicle_class,
                category:registration.vehicle_category
            }).catch(function(e){
                console.log(e);
            });

            registrationModel.addRegistration(registration).catch(function(e){
                console.log(e);
            });

            // update flag registration request status
            requestRegistrationModel.findOneAndUpdateAsync({_id:element._id},{status:1});
        });
    }
    res.send('Done');
}

module.exports = ConsoleController;