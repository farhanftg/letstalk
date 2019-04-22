var ApiController           = require('../../common/controllers/apiController');
var registrationModel       = require('../models/registrationModel');
var registrationTextModel   = require('../models/registrationTextModel');
var commonHelper            = require(HELPER_PATH+'commonHelper.js');

class RegistrationTextController extends ApiController{
    constructor() {
        super();
    }
}

RegistrationTextController.getRegistrationText = function(req, res){
        if(req.isAuthenticated()){
            var page  = 1;
            var start = 0;
            var limit = 100;
            var filterStatus    = '';
            var filterCategory  = '';
            var filterText      = '';
            var query = req.query;
            var data = new Object(); 
            if(req.query.page){
                page  = req.query.page;        
            }
            if (query.hasOwnProperty('page')){
                delete query.page;
            }    
            query = qs.stringify(query);   
            if(req.query.filter_status){
                filterStatus  = req.query.filter_status;        
            }
            if(req.query.filter_category){
                filterCategory  = req.query.filter_category;        
            }
            if(req.query.filter_text){
                filterText  = req.query.filter_text;        
            }
            start = parseInt((page*limit) - limit);
            
            async.waterfall([
                function(callback){                 
                    bike.getAllMake(function(makes){
                        bike.getAllModel(function(models){
                            bike.getAllVariant(function(variants){                             
                                data.bikeMakes      = makes;
                                data.bikeModels     = models;
                                data.bikeVariants   = variants;
                                callback(null, data);
                            });
                        });
                    });           
                },
                function(data, callback){                 
                    usedCar.getAllMake(function(makes){
                        usedCar.getAllParentModel(function(models){
                            usedCar.getAllVariant(function(variants){
                                data.carMakes   = makes;
                                data.carModels  = models;
                                data.carVariants= variants;
                                callback(null, data);
                            });
                        });
                    });                   
                }
            ], function (err, data) {
                vehicleRegistration.getRegistrationTextCount(filterText, filterCategory, filterStatus,function(recordCount){ 
                    vehicleRegistration.getRegistrationText(filterText, filterCategory, filterStatus, start, limit,function(rows){ 
                        res.render(path.join(BASE_DIR, 'views/registration', 'registration_text'),{registrations:rows, bikeMakes:data.bikeMakes, bikeModels:data.bikeModels, bikeVariants:data.bikeVariants, carMakes:data.carMakes, carModels:data.carModels, carVariants:data.carVariants, filterStatus:filterStatus, filterCategory:filterCategory, filterText:filterText, url:'/registration/text', page:page, limit:limit, recordCount:recordCount, query:query});     
                    });
                });
            });   
        }else{
            res.redirect('/login');
        }
    }
    
RegistrationTextController.approveRegistrationText = function(req, res){       
        if(req.isAuthenticated()){
            var status      = 3;
            var subStatus   = 2;
            var textId      = req.body.text_id;
            var filterText  = req.body.filter_text;
            var filterCategory  = req.body.filter_category;
            var filterStatus    = req.body.filter_status;
           
            async.each(textId,
                function(id, callback){
                    vehicleRegistration.updateVehicleRegistrationTextStatus(id, status, subStatus, function(rows){ 
                        callback();
                    }); 
                },
                function(err){
                    var url = '/registration/text';
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
                        query.page=req.body.page; 
                    }
                    query = qs.stringify(query);
                    url += '?'+query;
                    return res.redirect(url);
                }
            );
        }else{
            res.redirect('/login');
        }
    }
    
RegistrationTextController.updateRegistrationText = function(req, res){      
        if(req.isAuthenticated()){
            async.waterfall([
                function(callback){
                    if(req.body.category == 'Two Wheeler'){
                        bike.getAllMake(function(makes){
                            bike.getAllModel(function(models){
                                bike.getAllVariant(function(variants){
                                    var data = new Object(); 
                                    data.make_id        = req.body.make;
                                    data.make_name      = '';
                                    data.model_id       = req.body.model;
                                    data.model_name     = '';
                                    data.variant_id     = req.body.variant;
                                    data.variant_name   = '';
                                    data.variant_display_name    = '';
                                    data.category   = req.body.category;
                                    data.status     = 3;
                                    data.sub_status = 2;
                                    data.updated_at = registrationHelper.getCurrentDateTime();
                                    for(var i=0; i<makes.length; i++){
                                        if(data.make_id == makes[i].id){
                                            data.make_name = makes[i].name;
                                            break;
                                        }
                                    }
                                    for(var i=0; i<models.length; i++){
                                        if(data.model_id == models[i].id){
                                            data.model_name = models[i].short_name;
                                            break;
                                        }
                                    }
                                    for(var i=0; i<variants.length; i++){
                                        if(data.variant_id == variants[i].id){
                                            data.variant_name = variants[i].name;
                                            data.variant_display_name = variants[i].display_name;
                                            break;
                                        }
                                    }
                                    callback(null, data);
                                });
                            });
                        }); 
                    }else  if(req.body.category == 'Four Wheeler'){
                        usedCar.getAllMake(function(makes){
                            usedCar.getAllModel(function(models){
                                usedCar.getAllVariant(function(variants){
                                    var data = new Object(); 
                                    data.make_id        = req.body.make;
                                    data.make_name      = '';
                                    data.model_id       = req.body.model;
                                    data.model_name     = '';
                                    data.variant_id     = req.body.variant;
                                    data.variant_name   = '';
                                    data.variant_display_name    = '';
                                    data.category   = req.body.category;
                                    data.status     = 3;
                                    data.sub_status = 2;
                                    data.updated_at = registrationHelper.getCurrentDateTime();
                                    for(var i=0; i<makes.length; i++){
                                        if(data.make_id == makes[i].make_id){
                                            data.make_name = makes[i].make_name;
                                            break;
                                        }
                                    }
                                    for(var i=0; i<models.length; i++){
                                        if(data.model_id == models[i].model_id){
                                            data.model_name = models[i].model_short_name;
                                            break;
                                        }
                                    }
                                    for(var i=0; i<variants.length; i++){
                                        if(data.variant_id == variants[i].version_id){
                                            data.variant_name = variants[i].varient_name;
                                            data.variant_display_name = variants[i].varient_name;
                                            break;
                                        }
                                    }  
                                    callback(null, data);
                                });
                            });
                        }); 
                    }else{
                        var data = new Object(); 
                        data.make_id        = 0;
                        data.make_name      = '';
                        data.model_id       = 0;
                        data.model_name     = '';
                        data.variant_id     = 0;
                        data.variant_name   = '';
                        data.variant_display_name    = '';
                        data.category   = req.body.category;
                        data.status     = 0;
                        data.sub_status = 0;
                        data.updated_at = registrationHelper.getCurrentDateTime();
                        callback(null, data);
                    }
                }
            ], function (err, data) {
                var ids = '';
                if(isNaN(req.body.id)){
                   ids = JSON.parse(req.body.id); 
                }else{
                   ids = req.body.id;
                }
                vehicleRegistration.updateVehicleRegistrationText(ids,data,function(rows){
                    var filterText      = req.body.filter_text;
                    var filterCategory  = req.body.filter_category;
                    var filterStatus    = req.body.filter_status;
                    var url = '/registration/text';
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
                    return res.redirect(url);
                });   
            });            
        }else{
            res.redirect('/login');
        }
    }
    
    
RegistrationTextController.getAutoMapping = function(req, res){
        var vehicleRegistrations    = new Array();
        var vehicleRegistrationText = new Object();               
        vehicleRegistrationTextModel.getRegistrationText('status=3 AND category="Four Wheeler"', 'make_name, model_name', 'CHAR_LENGTH(model_name) DESC',false, function(approvedRows){ 
            vehicleRegistrationTextModel.getRegistrationText('(status >= 0 AND status <= 2) AND (sub_status IS NULL OR sub_status=0 OR sub_status !=2) AND category="Four Wheeler"',false,'registration_count DESC',false, function(rows){                             
                for(i=0; i<approvedRows.length; i++){
                    var approvedRow = approvedRows[i];
                    if(approvedRows[i].make_id && approvedRows[i].model_id){
                        for(j=0; j<rows.length; j++){                
                            var row = rows[j];
                            var rowArr = row.text.toLowerCase().split(' ');
                            if((row.text.toLowerCase().indexOf(approvedRow.make_name.toLowerCase()) >= 0 && (approvedRow.model_name.length > 1 && row.text.toLowerCase().indexOf(approvedRow.model_name.toLowerCase()) >= 0)) || (approvedRow.model_name.length>=3 && rowArr.indexOf(approvedRow.model_name.toLowerCase()) >=0)){                    
                                var exists = false;
                                if(vehicleRegistrations.length > 0){
                                    for(k=0; k<vehicleRegistrations.length;k++){
                                        if(vehicleRegistrations[k].id == row.id){
                                            exists = true;
                                            break;
                                        }                               
                                    }
                                }
                                if(!exists){                                 
                                    vehicleRegistrationText = new Object();
                                    vehicleRegistrationText.id          = row.id;
                                    vehicleRegistrationText.text        = row.text;
                                    vehicleRegistrationText.make_id     = approvedRow.make_id;
                                    vehicleRegistrationText.make_name   = approvedRow.make_name;
                                    vehicleRegistrationText.model_id    = approvedRow.model_id;
                                    vehicleRegistrationText.model_name  = approvedRow.model_name;
                                    vehicleRegistrationText.category    = approvedRow.category;
                                    vehicleRegistrationText.text_id     = approvedRow.id;                                   
                                    vehicleRegistrationText.status      = 2;
                                    vehicleRegistrationText.sub_status  = 2; 
                                    vehicleRegistrationText.updated_at  = registrationHelper.getCurrentDateTime();
                                    console.log(vehicleRegistrationText);
                                    vehicleRegistrations.push(vehicleRegistrationText);
                                }
                            }
                        }
                    }
                }
                if(vehicleRegistrations.length > 0){
                    vehicleRegistrationTextModel.setVehicleRegistrationText(vehicleRegistrations, function(result){
                        console.log('AutoQC done for '+vehicleRegistrations.length+' records');
                        res.send(vehicleRegistrations); 
                    });   
                }else{
                    console.log('No data found');
                    res.send('No data found');
                }
            }); 
        }); 
    }
}

RegistrationTextController.getStatus = function(registration){
    var status = 0; 
    if(registration.make_id != '' && registration.model_id != ''){
        status = 2;
        return status;
    }else if(registration.make_id != ''){
        status = 1;
        return status;
    }else{
        return status;
    }
}

module.exports = RegistrationTextController;

