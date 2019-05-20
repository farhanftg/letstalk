var path                    = require('path');
var qs                      = require('qs');
var registrationModel       = require('../../registration/models/registrationModel');
var registrationTextModel   = require('../../registration/models/registrationTextModel');
var requestRegistrationModel= require('../../registration/models/requestRegistrationModel');

class ConsoleController{
    constructor() {
    }
}

ConsoleController.autoMapRegistrationText = async function(req, res){ 
    try{
        let limit = req.query && req.query.limit?req.query.limit:config.autoMapping.limit;
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
