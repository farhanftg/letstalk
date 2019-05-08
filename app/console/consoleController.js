var path                    = require('path');
var qs                      = require('qs');
const registrationModel     = require('../registration/models/registrationModel');
const requestRegistrationModel = require('../registration/models/requestRegistrationModel');

class ConsoleController{
    constructor() {
    }
}

ConsoleController.getRegistrationFromRegistrationRequest = async function(req, res){

    try{
        let pendingRegistration = await requestRegistrationModel.getPendingRequestRegistration();
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