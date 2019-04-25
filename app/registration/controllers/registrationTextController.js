var path            = require('path');
var qs              = require('qs');
var ApiController           = require('../../common/controllers/apiController');
var registrationModel       = require('../models/registrationModel');
var registrationTextModel   = require('../models/registrationTextModel');
var commonModel             = require('../../common/models/commonModel');
var commonHelper            = require(HELPER_PATH+'commonHelper.js');

class RegistrationTextController extends ApiController{
    constructor() {
        super();
    }
}

RegistrationTextController.getRegistrationText = async function(req, res){
//        if(req.isAuthenticated()){
            var page  = 1;
            var start = 0;
            var limit = 100;
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
                filterCategory.category = filterCategory;
            }
             if(req.query.filter_status){
                filterStatus  = req.query.filter_status; 
                filterQuery.status = filterStatus;
            }
            
            start = parseInt((page*limit) - limit);
            let carMakes    = await commonModel.getCarMake();
            let bikeMakes   = await commonModel.getBikeMake();
            let recordCount = await registrationTextModel.countDocumentsAsync(filterQuery);
            let rows = await registrationTextModel.find(filterQuery).skip(start).limit(limit).execAsync();
            res.render(path.join(BASE_DIR, 'app/registration/views/registration', 'registration_text'),{registrations:rows, bikeMakes:bikeMakes, bikeModels:[], bikeVariants:[], carMakes:carMakes, carModels:[], carVariants:[], filterStatus:filterStatus, filterCategory:filterCategory, filterText:filterText, url:'/registration-text', page:page, limit:limit, recordCount:recordCount, query:query});     
//        }else{
//            res.redirect('/login');
//        }
    }
 
RegistrationTextController.updateRegistrationText = function(req, res){  
    // if(req.isAuthenticated()){
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
    data.status     = 3;
    data.sub_status = 2;
    
    if(req.body.id.length > 24){
        data.id = JSON.parse(req.body.id);
        data.id.shift();
    }else{
        data.id = req.body.id;
    }
    
    registrationTextModel.updateRegistrationText(data);
    //update registration status approved
    var registration_data = {};
    registration_data.status = 3;
    registration_data.central_make_id = req.body.make? req.body.make:'';
    registration_data.central_make_name = req.body.make_name? req.body.make_name:'';
    registration_data.central_model_id = req.body.model? req.body.model:'';
    registration_data.central_model_name = req.body.model_name? req.body.model_name:'';
    registration_data.central_version_id     = req.body.variant_id?req.body.variant_id:'';
    registration_data.central_version_name   = req.body.variant_name?req.body.variant_name:'';

    registrationModel.findOneAndUpdateAsync({maker_model:req.body.text},registration_data);

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
          
//        }else{
//            res.redirect('/login');
//        }
    }
    
/*    
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
*/

module.exports = RegistrationTextController;

