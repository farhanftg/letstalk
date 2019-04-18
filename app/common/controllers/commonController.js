var ApiController   = require('./apiController');
var commonHelper    = require(HELPER_PATH+'commonHelper');
var redisHelper     = require(HELPER_PATH+'redisHelper');

class CommonController extends ApiController{
    constructor() {
        super();
    }
}

CommonController.getCity = async function(req, res){
    var query = {};
    req.elk.module      = 'Common';
    req.elk.sub_module  = 'getCity'; 

    query.fetchData = 'city';

    if(req.query.cityId){
        query.cityId = req.query.cityId;
    }
    if(req.query.stateId){
        query.stateId = req.query.stateId;
    }
    if(req.query.cityName){
        query.cityName = req.query.cityName;
    }
    if(req.query.tags){
        query.tags = req.query.tags;
    }

    query.source    = req.query.source?req.query.source:config.source.b2c.toLowerCase();
    query.subSource = req.query.sub_source?req.query.sub_source:config.subSource.insuranceDekho;
    
    try{
        let allCities = await redisHelper.getJSON('allCities');
        if(!allCities){
            let result = await commonHelper.sendGetRequestToBrokerage(query, '/api/v1/motor/getBkgMasterData');
            allCities = await redisHelper.setJSON('allCities',result);     
            this.sendResponse(req, res, 200, false, result, false);                      
        }else{
            req.cached = true;
            this.sendResponse(req, res, 200, false, allCities, false);
        }
    }catch(e){
        this.sendResponse(req, res, 400, false, false, e);
    }
}
    
CommonController.getMappedData = async function(req, res){
    var query = {};
    var errors = new Array();
    req.elk.module      = 'Common';
    req.elk.sub_module  = 'getMappedData'; 

    if(req.query.insurerId){
        query.insurerId = req.query.insurerId;
    }else{
        error = commonHelper.formatError('ERR10001', 'insurerId');
        errors.push(error);
    }
    if(req.query.data){
        query.data = req.query.data;
    }else{
        error = commonHelper.formatError('ERR10002', 'data');
        errors.push(error);
    }
    if(req.query.tags){
        query.tags = req.query.tags;
    }else{
        error = commonHelper.formatError('ERR10003', 'tags');
        errors.push(error);
    }

    query.source    = req.query.source?req.query.source:config.source.b2c.toLowerCase();
    query.subSource = req.query.sub_source?req.query.sub_source:config.subSource.insuranceDekho;
  
    try{
        let result = await commonHelper.sendGetRequestToBrokerage(query, '/api/v1/motor/mappedMasterData');
        this.sendResponse(req, res, 200, false, result, false);
    }catch(e){
        this.sendResponse(req, res, 400, false, false, e);
    }     
}
    
CommonController.sendRequestToBrokerage = async function(req, res){
    if(req.method == 'GET'){         

        req.query.source    = req.query.source?req.query.source:config.source.b2c.toLowerCase();
        req.query.subSource = req.query.sub_source?req.query.sub_source:config.subSource.insuranceDekho;

        if(req.query.fetchData && req.query.fetchData=='all_make'){
            this.getAllMakes(req, res);
        }else{
            try{
                let result = await commonHelper.sendGetRequestToBrokerage(req.query, req.path);
                this.sendResponse(req, res, 200, false, result, false);                  
            }catch(e){
                this.sendResponse(req, res, 400, false, false, e);
            }     
        }
    }
    if(req.method == 'POST'){

        req.body.source    = req.body.source?req.body.source:config.source.b2c.toLowerCase();
        req.body.subSource = req.body.sub_source?req.body.sub_source:config.subSource.insuranceDekho;

        var options = {
                    host: config.insuranceBrokerage.host,
                    path: req.originalUrl
                }; 
        if(req.headers && (req.headers['Content-Type'] || req.headers['content-type'])){
            options.headers = {};
            if(req.headers['content-type']){
                options.headers['Content-Type'] = req.headers['content-type']; 
            }else{
                options.headers['Content-Type'] = req.headers['Content-Type']; 
            }
        }    

        try{
            let result = await commonHelper.sendPostRequest(req.body, options);
            if(result.data){
                this.sendResponse(req, res, 200, false, result.data, false);
            }else if(result.errors){
                throw result.errors;                       
            }else{
                throw ERROR.DEFAULT_ERROR;                        
            }                     
        }catch(e){
            this.sendResponse(req, res, 400, false, false, e);
        }     
    }           
}

CommonController.getAllMakes = async function(req, res){ 

    req.query.source    = req.query.source?req.query.source:config.source.b2c.toLowerCase();
    req.query.subSource = req.query.sub_source?req.query.sub_source:config.subSource.insuranceDekho;

    try{
        let allMakes = await redisHelper.getJSON('allMakes');
        if(!allMakes){
            let result = await commonHelper.sendGetRequestToBrokerage(req.query, req.path);
            result.forEach(function(make) {
                if(make.make_id && config.hiddenMakes.includes(make.make_id)){
                    result = result.filter(item => item != make);
                }
            });
            allMakes = await redisHelper.setJSON('allMakes',result);     
            this.sendResponse(req, res, 200, false, result, false);    
        }else{
            req.cached = true;
            this.sendResponse(req, res, 200, false, allMakes, false);
        }
    }catch(e){
        this.sendResponse(req, res, 400, false, false, e);
    }
}

CommonController.checkMongoConnection = function(req, res){
    var response  = new Object();
    var status = 500;
    if(mongoose.connection.readyState === 1){
        status = 200;
    }
    response.status = status;
    response.message= authHelper.getMessage(status);
    res.status(status).send(response);
}

module.exports = CommonController;