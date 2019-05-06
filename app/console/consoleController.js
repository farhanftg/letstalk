var path                    = require('path');
var qs                      = require('qs');
const registrationModel     = require('../registration/models/registrationModel');
const requestRegistrationModel = require('../registration/models/requestRegistrationModel');

class ConsoleController{
    constructor() {
    }
}

ConsoleController.getRegistrationFromRegistrationRequest = async function(req, res){

    let pendingRegistration = await requestRegistrationModel.getPendingRequestRegistration();
    if(pendingRegistration.length)
    {
        pendingRegistration.forEach(async function(element,index){
            registrationModel.processRegistration(element.registration_number)
                .then(function(registration){
                    if(registration){
                        // update flag registration request status
                        requestRegistrationModel.findOneAndUpdateAsync({_id:element._id},{status:1});
                    }
                })
                .catch(e => {
                    console.log(e);
                })
        });
    }
    res.send('Done');
}

module.exports = ConsoleController;