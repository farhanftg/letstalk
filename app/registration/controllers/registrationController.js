var path                    = require('path');
var qs                      = require('qs');
var ApiController           = require('../../common/controllers/apiController');
var registrationModel       = require('../models/registrationModel');
var registrationTextModel   = require('../models/registrationTextModel');
var commonHelper            = require(HELPER_PATH+'commonHelper.js');
const commonModel           = require('../../common/models/commonModel');
const vehicleClassModel     = require('../models/vehicleClassModel');
const requestRegistrationModel = require('../models/requestRegistrationModel');


class RegistrationController extends ApiController{
    constructor() {
        super();
    }
}

RegistrationController.index = async function(req, res){
    let twPendingRegCount  = registrationModel.countDocumentsAsync({vehicle_category:config.vehicleCategory.twoWheeler, status:1});
    let twAutomaticRegCount= registrationModel.countDocumentsAsync({vehicle_category:config.vehicleCategory.twoWheeler, status:2});
    let twApprovedRegCount = registrationModel.countDocumentsAsync({vehicle_category:config.vehicleCategory.twoWheeler, status:3});
    let twTotalRegCount    = registrationModel.countDocumentsAsync({vehicle_category:config.vehicleCategory.twoWheeler, status:{$ne:0}});
    let fwPendingRegCount  = registrationModel.countDocumentsAsync({vehicle_category:config.vehicleCategory.fourWheeler, status:1});
    let fwAutomaticRegCount= registrationModel.countDocumentsAsync({vehicle_category:config.vehicleCategory.fourWheeler, status:2});
    let fwApprovedRegCount = registrationModel.countDocumentsAsync({vehicle_category:config.vehicleCategory.fourWheeler, status:3});
    let fwTotalRegCount    = registrationModel.countDocumentsAsync({vehicle_category:config.vehicleCategory.fourWheeler, status:{$ne:0}});

    let twPendingRegTextCount   = registrationTextModel.countDocumentsAsync({category:config.vehicleCategory.twoWheeler, status:1});
    let twAutomaticRegTextCount = registrationTextModel.countDocumentsAsync({category:config.vehicleCategory.twoWheeler, status:2});
    let twApprovedRegTextCount  = registrationTextModel.countDocumentsAsync({category:config.vehicleCategory.twoWheeler, status:3});
    let twTotalRegTextCount     = registrationTextModel.countDocumentsAsync({category:config.vehicleCategory.twoWheeler, status:{$ne:0}});
    let fwPendingRegTextCount   = registrationTextModel.countDocumentsAsync({category:config.vehicleCategory.fourWheeler, status:1});
    let fwAutomaticRegTextCount = registrationTextModel.countDocumentsAsync({category:config.vehicleCategory.fourWheeler, status:2});
    let fwApprovedRegTextCount  = registrationTextModel.countDocumentsAsync({category:config.vehicleCategory.fourWheeler, status:3});
    let fwTotalRegTextCount     = registrationTextModel.countDocumentsAsync({category:config.vehicleCategory.fourWheeler, status:{$ne:0}});
    
    Promise.all([
        twPendingRegCount, 
        twAutomaticRegCount, 
        twApprovedRegCount,
        twTotalRegCount,
        fwPendingRegCount,
        fwAutomaticRegCount,
        fwApprovedRegCount,
        fwTotalRegCount,
        twPendingRegTextCount,
        twAutomaticRegTextCount,
        twApprovedRegTextCount,
        twTotalRegTextCount,
        fwPendingRegTextCount,
        fwAutomaticRegTextCount,
        fwApprovedRegTextCount,
        fwTotalRegTextCount
    ]).then(function(data){
        res.render(path.join(BASE_DIR, 'app/registration/views/registration', 'index'),{
            twPendingRegCount:data[0], 
            twAutomaticRegCount:data[1], 
            twApprovedRegCount:data[2], 
            twTotalRegCount:data[3],
            fwPendingRegCount:data[4], 
            fwAutomaticRegCount:data[5], 
            fwApprovedRegCount:data[6], 
            fwTotalRegCount:data[7],
            twPendingRegTextCount:data[8], 
            twAutomaticRegTextCount:data[9], 
            twApprovedRegTextCount:data[10], 
            twTotalRegTextCount:data[11],
            fwPendingRegTextCount:data[12], 
            fwAutomaticRegTextCount:data[13], 
            fwApprovedRegTextCount:data[14],
            fwTotalRegTextCount:data[15]
        });
    });   
//    res.render(path.join(BASE_DIR, 'app/registration/views/registration', 'index'),{twPendingRegCount:twPendingRegCount, twAutomaticRegCount:twAutomaticRegCount, twApprovedRegCount:twApprovedRegCount, fwPendingRegCount:fwPendingRegCount, fwAutomaticRegCount:fwAutomaticRegCount, fwApprovedRegCount:fwApprovedRegCount, twPendingRegTextCount:twPendingRegTextCount, twAutomaticRegTextCount:twAutomaticRegTextCount, twApprovedRegTextCount:twApprovedRegTextCount, fwPendingRegTextCount:fwPendingRegTextCount, fwAutomaticRegTextCount:fwAutomaticRegTextCount, fwApprovedRegTextCount:fwApprovedRegTextCount});     
}

RegistrationController.getRegistrationList = async function(req, res){
    
    var page  = 1;
    var start = 0;
    var limit = config.pagination.limit;
    var filterRegNumber = '';
    var filterStatus    = '';
    var filterCategory  = '';
    var filterText      = '';
    var query = req.query; 
    let filterQuery ={};
    if(req.query.page){
        page  = req.query.page;        
    }
    if (query.hasOwnProperty('page')){
        delete query.page;
    }    
    query = qs.stringify(query);   
    filterQuery["$or"] = [];
    if(req.query.filter_reg_number){
        filterRegNumber  = req.query.filter_reg_number;               
        filterQuery["$or"].push({registration_number:new RegExp(filterRegNumber, 'i')});  
        filterQuery["$or"].push({central_make_name:new RegExp(filterRegNumber, 'i')});  
        filterQuery["$or"].push({central_model_name:new RegExp(filterRegNumber, 'i')});
        filterQuery["$or"].push({central_version_name:new RegExp(filterRegNumber, 'i')});
    }
    if(req.query.filter_category){
        filterCategory  = req.query.filter_category;
        filterQuery.vehicle_category = filterCategory;
    }
     if(req.query.filter_status){
        filterStatus  = req.query.filter_status; 
        filterQuery.status = filterStatus;
    }
    if(!filterQuery["$or"].length){
        delete filterQuery["$or"];
    }
    start = parseInt((page*limit) - limit);

    let carMakes    = await commonModel.getCarMake();
    let bikeMakes   = await commonModel.getBikeMake();
    let recordCount     = await registrationModel.countDocumentsAsync(filterQuery);
    let registrations   = await registrationModel.find(filterQuery).skip(start).sort({status:1,created_at:-1}).limit(limit).execAsync();
    
    res.render(
        path.join(BASE_DIR, 'app/registration/views/registration', 'registration'),
        {
            registrations:registrations, 
            filterRegNumber:filterRegNumber, 
            filterStatus:filterStatus, 
            filterCategory:filterCategory, 
            filterText:filterText, 
            carMakes:carMakes,
            bikeMakes:bikeMakes,
            start:start,
            url:'/registration/list', 
            page:page, 
            limit:limit, 
            recordCount:recordCount, 
            query:query
        });     
}
    
RegistrationController.getRegistration = async function(req, res){
    let errors = new Array();
    req.elk.module      = 'Registration';
    req.elk.sub_module  = 'getRegistration'; 
    if(!req.query.registration_number){
        var error = this.formatError('ERR10011', 'registration_number');
        errors.push(error);
    }
    if(!req.query.source){
        var error = this.formatError('ERR10004', 'source');
        errors.push(error);
    }
    if(!req.query.sub_source){
        var error = this.formatError('ERR10005', 'sub_source');
        errors.push(error);
    }
    try{
        if(!errors.length){
            let registration = await registrationModel.findOne({registration_number:req.query.registration_number});
            if(!registration){
                if(!config.onDemandAllowedSubsource.includes(req.query.sub_source)){
                    // log request collection
                    requestRegistrationModel.logRegistrationRequest({
                        source: req.query.source,
                        sub_source: req.query.sub_source,
                        registration_number: req.query.registration_number
                    });
                    
                    throw ERROR.REGISTRATION_DETAILS_NOT_VERIFIED;
                }else{
                    registration = await registrationModel.processRegistration(req.query.registration_number);
                }
            }
            if(registration.status == 2 || registration.status == 3){
                registration = registrationModel.formatRegistrationDataForAutoDB(registration);
                if(req.query.vehicle_type && (req.query.vehicle_type.toLowerCase() != registration.vehicle_category.toLowerCase())){
                    throw ERROR.REGISTRATION_NOT_FOUND;
                }
                this.sendResponse(req, res, 200, false, registration, false);
            }else{
                throw ERROR.REGISTRATION_DETAILS_NOT_VERIFIED;
            }
        }else{
            throw errors;
        }  
    }catch(e){
        this.sendResponse(req, res, 400, false, false, e);
    }   
}

RegistrationController.updateRegistration = async function(req, res){
    let errors = new Array();
    if(!req.body.id){
        var error = this.formatError('ERR10017', 'id');
        errors.push(error);
    }
    if(!req.body.make){
        var error = this.formatError('ERR10008', 'make');
        errors.push(error);
    }
    if(!req.body.model){
        var error = this.formatError('ERR10009', 'model');
        errors.push(error);
    }
    try{
        if(!errors.length){
            let data = {}; 
            data.make_id        = req.body.make? req.body.make:'';
            data.make_name      = req.body.make_name?req.body.make_name:'';
            data.model_id       = req.body.model?req.body.model:'';
            data.model_name     = req.body.model_name?commonHelper.removeMakeNameFromModelName(req.body.make_name, req.body.model_name):'';
            data.variant_id     = req.body.variant?req.body.variant:'';
            data.variant_name   = req.body.variant_name?req.body.variant_name:'';
            data.variant_display_name = req.body.variant_name?req.body.variant_name:'';
            data.category   = req.body.category?req.body.category:'';
            data.status     = config.status.approved;

            if(req.body.id.length > 24){
                data.id = JSON.parse(req.body.id);
                data.id.shift();
            }else{
                data.id = req.body.id;
            }

            let registrationData = {};
            registrationData.central_make_id   = req.body.make? req.body.make:'';
            registrationData.central_make_name = req.body.make_name?req.body.make_name:'';
            registrationData.central_model_id  = req.body.model?req.body.model:'';
            registrationData.central_model_name= req.body.model_name?commonHelper.removeMakeNameFromModelName(req.body.make_name, req.body.model_name):'';
            registrationData.central_version_id= req.body.variant?req.body.variant:'';
            registrationData.central_version_name = req.body.variant_name?req.body.variant_name:'';
            registrationData.vehicle_category  = req.body.category?req.body.category:'';
            registrationData.status            = config.status.approved;

            await registrationModel.updateManyAsync({maker_model:req.body.text, status: {$in:[config.status.pending, config.status.autoMapped]}}, registrationData);
            await registrationTextModel.updateOneAsync({text:req.body.text, status: {$in:[config.status.pending, config.status.autoMapped]}}, data);

            let registration = await registrationModel.findOneAsync({_id:req.body.id});
            vehicleClassModel.updateOneAsync({vehicle_class:registration.vehicle_class, status:config.status.pending}, {vehicle_category:req.body.category}).catch(function(e){
                console.log(e);
            });       
        }else{
            throw errors;
        }
    }catch(e){
        console.log(e);
    }

    let filterText      = req.body.filter_text;
    let filterCategory  = req.body.filter_category;
    let filterStatus    = req.body.filter_status;
    let url = '/registration/list';
    let query = {};
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

module.exports = RegistrationController;
