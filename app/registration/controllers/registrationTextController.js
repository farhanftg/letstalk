var path            = require('path');
var qs              = require('qs');
var ApiController           = require('../../common/controllers/apiController');
var registrationModel       = require('../models/registrationModel');
var registrationTextModel   = require('../models/registrationTextModel');
var vehicleClassModel       = require('../models/vehicleClassModel');
var commonModel             = require('../../common/models/commonModel');
var commonHelper            = require(HELPER_PATH+'commonHelper.js');

class RegistrationTextController extends ApiController{
    constructor() {
        super();
    }
}

RegistrationTextController.getRegistrationText = async function(req, res){
    var page  = 1;
    var start = 0;
    var limit = config.pagination.limit;
    var filterStatus    = '';
    var filterCategory  = '';
    var filterText      = '';
    var query = req.query;
    var data = new Object(); 
    let filterQuery ={};
    if(req.query.page){
        page  = req.query.page;        
    }
    if (query.hasOwnProperty('page')){
        delete query.page;
    }    
    query = qs.stringify(query);   

    if(req.query.filter_text){
        filterText  = req.query.filter_text;               
        filterQuery.text = new RegExp(filterText, 'i');
    }
    if(req.query.filter_category){
        filterCategory  = req.query.filter_category;
        filterQuery.category = filterCategory;
    }
     if(req.query.filter_status){
        filterStatus  = req.query.filter_status; 
        filterQuery.status = filterStatus;
    }

    start = parseInt((page*limit) - limit);
    let carMakes    = await commonModel.getCarMake();
    let bikeMakes   = await commonModel.getBikeMake();
    let recordCount = await registrationTextModel.countDocumentsAsync(filterQuery);
    let rows = await registrationTextModel.find(filterQuery).skip(start).sort({status:1,created_at:-1}).limit(limit).execAsync();
    res.render(path.join(BASE_DIR, 'app/registration/views/registration', 'registration_text'),{registrations:rows, bikeMakes:bikeMakes, bikeModels:[], bikeVariants:[], carMakes:carMakes, carModels:[], carVariants:[], filterStatus:filterStatus, filterCategory:filterCategory, filterText:filterText, url:'/registration-text', page:page, limit:limit, recordCount:recordCount, query:query,start:start});     
}
 
RegistrationTextController.updateRegistrationText = async function(req, res){  
    let errors = new Array();
    if(!req.body.make){
        var error = commonHelper.formatError('ERR10008', 'make');
        errors.push(error);
    }
    if(!req.body.model){
        var error = commonHelper.formatError('ERR10009', 'model');
        errors.push(error);
    }
    try{
        if(!errors.length){
            let data = {}; 
            data.id             = req.body.id;
            data.make_id        = req.body.make;
            data.make_name      = req.body.make_name;
            data.model_id       = req.body.model;
            data.model_name     = req.body.model_name;
            data.variant_id     = req.body.variant;
            data.variant_name   = req.body.variant_name;
            data.variant_display_name    = '';
            data.category   = req.body.category;
            data.status     = config.status.approved;

            if(req.body.id.length > 24){
                data.id = JSON.parse(req.body.id);
                data.id.shift();
            }else{
                data.id = req.body.id;
            }

            //update registration status approved
            var registration_data = {};
            registration_data.central_make_id   = req.body.make? req.body.make:'';
            registration_data.central_make_name = req.body.make_name? req.body.make_name:'';
            registration_data.central_model_id  = req.body.model? req.body.model:'';
            registration_data.central_model_name= req.body.model_name? req.body.model_name:'';
            registration_data.central_version_id     = req.body.variant?req.body.variant:'';
            registration_data.central_version_name   = req.body.variant_name?req.body.variant_name:'';
            registration_data.vehicle_category  = req.body.category?req.body.category:'';
            registration_data.status            = config.status.approved;

            await registrationTextModel.updateRegistrationText(data)
            await registrationModel.updateManyAsync({maker_model:req.body.text, status: {$in:[config.status.pending, config.status.autoMapped]}}, registration_data);

            let registration = await registrationModel.findOneAsync({_id:req.body.id});
            if(registration){
                vehicleClassModel.updateAsync({vehicle_class:registration.vehicle_class, status:config.status.pending}, {vehicle_category:req.body.category});
            }
        }else{
            throw errors;
        }
    }catch(e){
        console.log(e);
    }
    
    var filterText      = req.body.filter_text;
    var filterCategory  = req.body.filter_category;
    var filterStatus    = req.body.filter_status;
    var url = '/registration-text';
    var query = new Object;
    if(filterText){
        query.filter_text = filterText; 
    }
    if(filterCategory){
        query.filter_category = filterCategory; 
    }
    if(filterStatus){
        query.filter_status = filterStatus; 
    }
    if(req.body.page){
        query.page = req.body.page; 
    }
    query = qs.stringify(query);
    url += '?'+query;
    res.redirect(url);     
}

RegistrationTextController.getDetailsByRegistrationText = async function(req, res){
    let errors = new Array();

    if(!req.query.registration_text){
        var error = commonHelper.formatError('ERR10016', 'registration_text');
        errors.push(error);
    }

    try{
        if(!errors.length){
            
            let registrationText = await registrationTextModel.findOneAsync(
                {
                    text:req.query.registration_text.trim(),
                    status:{$in:[config.status.autoMapped,config.status.approved]},
                },{make_id:1,make_name:1,model_id:1,model_name:1,category:1,variant_id:1,variant_name:1});

            let text = {};
            
            if(registrationText){
                text.make_id    = registrationText.make_id;
                text.make_name  = registrationText.make_name;
                text.model_id   = registrationText.model_id;
                text.model_name = registrationText.model_name;
                text.category   = registrationText.category;
            }else{                            
                let autoMappedRegistrationText = await registrationTextModel.getAutoMappedRegistrationText(req.query.registration_text);           
                if(autoMappedRegistrationText.make_id && autoMappedRegistrationText.model_id){
                    text.make_id    = autoMappedRegistrationText.make_id;
                    text.make_name  = autoMappedRegistrationText.make_name;
                    text.model_id   = autoMappedRegistrationText.model_id;
                    text.model_name = autoMappedRegistrationText.model_name;
                    text.category   = autoMappedRegistrationText.category;
                }
            }
            
            if(!text.make_id && !text.model_id){
                throw ERROR.REGISTRATION_TEXT_NOT_FOUND;
            }
            this.sendResponse(req, res, 200, false, text, false);

        }else{
            throw errors;
        }
    }
    catch(e){
        this.sendResponse(req, res, 400, false, false, e)
    }
}
    
module.exports = RegistrationTextController;

