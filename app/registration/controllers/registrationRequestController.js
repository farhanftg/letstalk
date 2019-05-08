var path            = require('path');
var ApiController           = require('../../common/controllers/apiController');
var registrationRequestModel = require('../models/requestRegistrationModel');

class RegistrationRequestController extends ApiController{
    constructor() {
        super();
    }
}

RegistrationRequestController.index = async function(req, res){
    let page  = 1;
    let start = 0;
    let limit = config.pagination.limit;
    start = parseInt((page*limit) - limit);
    let filter_category = '';
    let filterQuery = {};
    let search_text = '';

    if(req.query.filter_category){
        filterQuery.status =  parseInt(req.query.filter_category);
        filter_category = parseInt(req.query.filter_category);
    }

    if(req.query.search_text){
        search_text = req.query.search_text;
        filterQuery.registration_number = new RegExp(search_text,'i');
    }

    let recordCount = await registrationRequestModel.countDocumentsAsync();
    let rows = await registrationRequestModel.find(filterQuery).skip(start).sort({status:1,created_at:-1}).limit(limit).execAsync();
    res.render(
        path.join(BASE_DIR, 'app/registration/views/registration', 'registration_request'),
        {
            registrations:rows,
            url:'/registration-request', 
            page:page,
            limit:limit, 
            recordCount:recordCount, 
            filter_category:filter_category,
            search_text:search_text,
            start:start
        }
    );     

}

module.exports = RegistrationRequestController;