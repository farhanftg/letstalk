var path                    = require('path');
var qs                      = require('qs');
var ApiController           = require('../../common/controllers/apiController');
var commonHelper            = require(HELPER_PATH+'commonHelper.js');
const commonModel           = require('../../common/models/commonModel');
const vehicleClassModel     = require('../models/vehicleClassModel');


class VehicleClassController extends ApiController{
    constructor() {
        super();
    }
}

VehicleClassController.getVehicleClassList = async function(req, res){
    var page  = 1;
    var start = 0;
    var limit = 100;
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
    let vehicleClass   = await vehicleClassModel.find(filterQuery).skip(start).limit(limit).execAsync();
    
    res.render(path.join(BASE_DIR, 'app/registration/views/registration', 'vehicle_class'),
        {
            vehicleClass:vehicleClass,
            filterCategory:filterCategory, 
            filterSearchText:filterSearchText,
            url:'/vehicle-class', 
            page:page, 
            limit:limit, 
            recordCount:recordCount, 
            query:query
        });    
}

VehicleClassController.updateVehicleClass = async function(req, res){
    var vehicleClassData = {};
    if(req.body.vehicle_class_id)
    {
        vehicleClassData.vehicle_class = req.body.vehicle_class;
        vehicleClassData.vehicle_category = req.body.category;
        vehicleClassModel.findOneAndUpdateAsync({_id:req.body.vehicle_class_id},vehicleClassData);
        var url = '/vehicle-class';
    }
    res.redirect(url); 
}

module.exports = VehicleClassController;