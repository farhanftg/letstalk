var commonHelper    = require(HELPER_PATH+'commonHelper');

class ApiController{
    
    constructor() {
        
    }
    
}

ApiController.sendResponse = function(req, res, status, message, data, errors){
    commonHelper.sendResponse(req, res, status, message, data, errors);
}
    
module.exports = ApiController;