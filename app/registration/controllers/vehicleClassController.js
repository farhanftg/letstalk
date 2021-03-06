var path                    = require('path');
var qs                      = require('qs');
var ApiController           = require('../../common/controllers/apiController');
var commonHelper            = require(HELPER_PATH+'commonHelper.js');
var commonModel             = require('../../common/models/commonModel');
var vehicleClassModel       = require('../models/vehicleClassModel');
var registrationModel       = require('../models/registrationModel');
var registrationTextModel   = require('../models/registrationTextModel');


class VehicleClassController extends ApiController{
    constructor() {
        super();
    }
}

VehicleClassController.getVehicleClassList = async function(req, res){
    var page  = 1;
    var start = 0;
    var limit = config.pagination.limit;
    var filterCategory  =  filterSearchText = '';
    var filterSearch      = '';
    var query = req.query; 
    let filterQuery ={};
    if(req.query.page){
        page  = req.query.page;        
    }
    if (query.hasOwnProperty('page')){
        delete query.page;
    }    
    query = qs.stringify(query);   

    if(req.query.filter_category){
        filterCategory  = req.query.filter_category;
        filterQuery.vehicle_category = filterCategory;
    }

    if(req.query.search_text){
        filterSearchText = req.query.search_text;
        filterQuery.vehicle_class = new RegExp(filterSearchText,'i');
    }

    start = parseInt((page*limit) - limit);
    let recordCount     = await vehicleClassModel.countDocumentsAsync(filterQuery);
    let vehicleClass   = await vehicleClassModel.find(filterQuery).skip(start).sort({status:1,created_at:-1}).limit(limit).execAsync();
    
    res.render(path.join(BASE_DIR, 'app/registration/views/registration', 'vehicle_class'),
        {
            vehicleClass:vehicleClass,
            filterCategory:filterCategory, 
            filterSearchText:filterSearchText,
            url:'/vehicle-class', 
            page:page, 
            limit:limit, 
            recordCount:recordCount, 
            query:query,
            start:start
        });    
}

VehicleClassController.updateVehicleClass = async function(req, res){
    var vehicleClassData = {};
    var url = '/vehicle-class';
    if(req.body.vehicle_class_id){
        if(req.body.status == 1 || req.body.status == 0){
            // update registration, registration text vehicle category when pending
            registrationModel.findOneAndUpdateAsync({vehicle_class:req.body.vehicle_class, status:config.status.pending},{vehicle_category:req.body.category});
            registrationTextModel.findOneAndUpdateAsync({vehicle_class:req.body.vehicle_class, status:config.status.pending},{category:req.body.category});

            vehicleClassData.vehicle_class      = req.body.vehicle_class;
            vehicleClassData.vehicle_category   = req.body.category;
            vehicleClassData.status = 2; // Approved
            vehicleClassModel.findOneAndUpdateAsync({_id:req.body.vehicle_class_id},vehicleClassData);
        }
    }
    res.redirect(url); 
}

module.exports = VehicleClassController;