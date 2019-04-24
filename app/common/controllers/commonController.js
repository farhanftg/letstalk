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
    query.source    = config.source.autodb;
    query.subSource = config.subSource.vahanScrapper;
    
    try{
        let cities = await redisHelper.getJSON('cities');
        if(!cities){
            let result = await commonHelper.sendGetRequestToBrokerage(query, '/api/v1/motor/getBkgMasterData');
            cities = await redisHelper.setJSON('cities',result);     
            this.sendResponse(req, res, 200, false, result, false);                      
        }else{
            req.cached = true;
            this.sendResponse(req, res, 200, false, cities, false);
        }
    }catch(e){
        this.sendResponse(req, res, 400, false, false, e);
    }
}

CommonController.getRtoDetail = async function(req, res){
    let query = {};
    let rtoCode = '';
    let key = 'rto';
    req.elk.module      = 'Common';
    req.elk.sub_module  = 'getRtoDetail'; 

    query.source    = config.source.autodb;
    query.subSource = config.subSource.vahanScrapper;
    if(req.query.rto_code){
        rtoCode = req.query.rto_code;
        key += '_'+rtoCode;
    }
    try{
        let rtoDetail = await redisHelper.getJSON(key);
        if(!rtoDetail){
            let path = '/api/v1/motor/rtoMasterDetail/'+rtoCode;
            let result = await commonHelper.sendGetRequestToBrokerage(query, path);
            rtoDetail = await redisHelper.setJSON(key,result);     
            this.sendResponse(req, res, 200, false, result, false);                      
        }else{
            req.cached = true;
            this.sendResponse(req, res, 200, false, rtoDetail, false);
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
    
    query.source    = config.source.autodb;
    query.subSource = config.subSource.vahanScrapper;
    
    try{
        let result = await commonHelper.sendGetRequestToBrokerage(query, '/api/v1/motor/mappedMasterData');
        this.sendResponse(req, res, 200, false, result, false);
    }catch(e){
        this.sendResponse(req, res, 400, false, false, e);
    }     
}
    
CommonController.sendRequestToBrokerage = async function(req, res){
    if(req.method == 'GET'){         
        req.query.source    = config.source.autodb;
        req.query.subSource = config.subSource.vahanScrapper;

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

CommonController.getCarMake = async function(req, res){ 
    var query = {};
    query.fetchData = 'all_make';
    query.sortBy    = 'popularity';
    query.tags      = 'make,make_id,popularity_rank';
    query.source    = 'autodb'; 
    query.subSource = 'vahanScrapper';

    try{
        let makes = await redisHelper.getJSON('car_makes');
        if(!makes){
            let path    = '/api/v1/motor/getBkgMasterData';
            let result  = await commonHelper.sendGetRequestToBrokerage(query, path);
            makes = await redisHelper.setJSON('car_makes',result);     
            this.sendResponse(req, res, 200, false, result, false);    
        }else{
            req.cached = true;
            this.sendResponse(req, res, 200, false, makes, false);
        }
    }catch(e){
        this.sendResponse(req, res, 400, false, false, e);
    }
}

CommonController.getCarModel = async function(req, res){ 
    var query = {};
    query.fetchData = 'all_parent_model';
    query.sortBy    = 'modelPopularity';
    query.tags      = 'make,make_id,model,model_id,model_display_name,model_popularity_rank,status';
    query.makeId    = req.query.make_id;
    query.source    = 'autodb'; 
    query.subSource = 'vahanScrapper';

    try{
        let models = await redisHelper.getJSON('car_models_'+query.makeId);
        if(!models){
            let path    = '/api/v1/motor/getBkgMasterData';
            let result  = await commonHelper.sendGetRequestToBrokerage(query, path);   
            models = await redisHelper.setJSON('car_models_'+query.makeId,result);     
            this.sendResponse(req, res, 200, false, result, false);    
        }else{
            req.cached = true;
            this.sendResponse(req, res, 200, false, models, false);
        }
    }catch(e){
        this.sendResponse(req, res, 400, false, false, e);
    }
}

CommonController.getCarVariant = async function(req, res){ 
    var query = {};
    query.fetchData = 'all_variant_by_parent';
    query.sortBy    = 'modelPopularity';
    query.tags      = 'make,make_id,model,model_id,version,version_id,version_display_name,cc,status,fuel';
    query.modelId    = req.query.model_id;;
    query.source    = 'autodb'; 
    query.subSource = 'vahanScrapper';

    try{
        let variants = await redisHelper.getJSON('car_variants_'+query.modelId);
        if(!variants){
            let path    = '/api/v1/motor/getBkgMasterData';
            let result  = await commonHelper.sendGetRequestToBrokerage(query, path);   
            variants    = await redisHelper.setJSON('car_variants_'+query.modelId,result);     
            this.sendResponse(req, res, 200, false, result, false);    
        }else{
            req.cached = true;
            this.sendResponse(req, res, 200, false, variants, false);
        }
    }catch(e){
        this.sendResponse(req, res, 400, false, false, e);
    }
}

CommonController.getBikeMake = async function(req, res){ 
    var query = {};
    query.fetchData = 'tw_mmv';
    query.sortBy    = 'popularity';
    query.tags      = 'make,make_id,popularity_rank';
    query.fetchOnly = 'all_make';
    query.source    = 'autodb'; 
    query.subSource = 'vahanScrapper';

    try{
        let makes = await redisHelper.getJSON('bike_makes');
        if(!makes){
            let path    = '/api/v1/motor/getBkgMasterData';
            let result  = await commonHelper.sendGetRequestToBrokerage(query, path);
            makes       = await redisHelper.setJSON('bike_makes',result);     
            this.sendResponse(req, res, 200, false, result, false);    
        }else{
            req.cached = true;
            this.sendResponse(req, res, 200, false, makes, false);
        }
    }catch(e){
        this.sendResponse(req, res, 400, false, false, e);
    }
}

CommonController.getBikeModel = async function(req, res){ 
    var query = {};
    query.fetchData = 'tw_mmv';
    query.sortBy    = 'modelPopularity';
    query.tags      = 'make,make_id,model,model_id,model_display_name,model_popularity_rank,status';   
    query.fetchOnly =  'all_model';
    query.makeId    = req.query.make_id;
    query.source    = 'autodb'; 
    query.subSource = 'vahanScrapper';

    try{
        let models = await redisHelper.getJSON('bike_models_'+query.makeId);
        if(!models){
            let path    = '/api/v1/motor/getBkgMasterData';
            let result  = await commonHelper.sendGetRequestToBrokerage(query, path);   
            models      = await redisHelper.setJSON('bike_models_'+query.makeId,result);     
            this.sendResponse(req, res, 200, false, result, false);    
        }else{
            req.cached = true;
            this.sendResponse(req, res, 200, false, models, false);
        }
    }catch(e){
        this.sendResponse(req, res, 400, false, false, e);
    }
}

CommonController.getBikeVariant = async function(req, res){ 
    var query = {};
    query.fetchData = 'tw_mmv';
    query.sortBy    = 'modelPopularity';
    query.tags      = 'make,make_id,model,model_id,version,version_id,version_display_name,cc,status,fuel';
    query.fetchOnly = 'all_variant';
    query.modelId    = req.query.model_id;
    query.source    = 'autodb'; 
    query.subSource = 'vahanScrapper';

    try{
        let variants = await redisHelper.getJSON('bike_variants_'+query.modelId);
        if(!variants){
            let path    = '/api/v1/motor/getBkgMasterData';
            let result  = await commonHelper.sendGetRequestToBrokerage(query, path);   
            variants    = await redisHelper.setJSON('bike_variants_'+query.modelId,result);     
            this.sendResponse(req, res, 200, false, result, false);    
        }else{
            req.cached = true;
            this.sendResponse(req, res, 200, false, variants, false);
        }
    }catch(e){
        this.sendResponse(req, res, 400, false, false, e);
    }
}

module.exports = CommonController;