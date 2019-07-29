var commonHelper = require(HELPER_PATH+'commonHelper');
var redisHelper  = require(HELPER_PATH+'redisHelper');

var CommonModel = {};

CommonModel.getCity = function(query){ 
    return new Promise( async function(resolve, reject) {
        query.fetchData = 'city';
        query.source    = config.source.autodb;
        query.subSource = config.subSource.vahanScrapper;
        
        try{
            let cities = await redisHelper.getJSON('cities');
            if(!cities){
                let result = await commonHelper.sendGetRequestToBrokerage(query, '/api/v1/motor/getBkgMasterData');
                cities = await redisHelper.setJSON('cities',result);  
                resolve(result);                   
            }else{
                resolve(cities);
            }
        }catch(e){
            reject(e);
        }
    });
}

CommonModel.getRtoDetail = function(query){ 
    return new Promise( async function(resolve, reject) {
        let rtoCode = '';
        let key = 'rto';
        query.source    = config.source.autodb;
        query.subSource = config.subSource.vahanScrapper;
        if(query.rto_code){
            rtoCode = query.rto_code;
            key += '_'+rtoCode;
        }
        try{
            let rtoDetail = await redisHelper.getJSON(key);
            if(!rtoDetail){
                let path = '/api/v1/motor/rtoMasterDetail/'+rtoCode;
                let result = await commonHelper.sendGetRequestToBrokerage(query, path);
                rtoDetail = await redisHelper.setJSON(key,result);  
                resolve(result);                                  
            }else{
                resolve(rtoDetail);
            }
        }catch(e){
            reject(e);
        }
    });
}

CommonModel.getCarMake = function(){ 
    return new Promise( async function(resolve, reject) {
        let query = {};
        query.fetchData = 'all_make';
        query.sortBy    = 'popularity';
        query.tags      = 'make,make_id,popularity_rank';
        query.source    = config.source.autodb;
        query.subSource = config.subSource.vahanScrapper;

        try{
            let makes = await redisHelper.getJSON('car_makes');
            if(!makes){
                let path    = '/api/v1/motor/getBkgMasterData';
                let result  = await commonHelper.sendGetRequestToBrokerage(query, path);
                makes = await redisHelper.setJSON('car_makes',result); 
                resolve(result);
            }else{
                resolve(makes);
            }
        }catch(e){
            reject(e);
        }
    });
}

CommonModel.getCarModel = async function(makeId){ 
    return new Promise( async function(resolve, reject) {
        let query   = {};
        let key     = 'car_models';
        
        query.fetchData = 'all_parent_model';
        query.sortBy    = 'modelPopularity';
        query.tags      = 'make,make_id,model,model_id,model_display_name,model_popularity_rank,status';
        query.source    = config.source.autodb;
        query.subSource = config.subSource.vahanScrapper;

        try{
            if(makeId){
                query.makeId = makeId;
                key += '_'+makeId; 
            }
            let models = await redisHelper.getJSON(key);
            if(!models){
                let path    = '/api/v1/motor/getBkgMasterData';
                let result  = await commonHelper.sendGetRequestToBrokerage(query, path); 
                models = await redisHelper.setJSON(key,result); 
                resolve(result);   
            }else{
                resolve(models);
            }
        }catch(e){
            reject(e);
        }
    });
}

CommonModel.getCarVariant = function(modelId){ 
    return new Promise( async function(resolve, reject) {
        let query   = {};
        let key     = 'car_variants';
        
        query.fetchData = 'all_variant';
        query.sortBy    = 'modelPopularity';
        query.tags      = 'make,make_id,model,model_id,version,version_id,version_display_name,cc,status,fuel';
        query.source    = config.source.autodb;
        query.subSource = config.subSource.vahanScrapper;
        
        if(modelId){
            query.fetchData = 'all_variant_by_parent';
            query.modelId = modelId;
            key += '_'+modelId; 
        }
        
        try{
            let variants = await redisHelper.getJSON(key);
            if(!variants){
                let path    = '/api/v1/motor/getBkgMasterData';
                let result  = await commonHelper.sendGetRequestToBrokerage(query, path);   
                //variants    = await redisHelper.setJSON(key,result);     
                resolve(result); 
            }else{
                resolve(variants);
            }
        }catch(e){
            reject(e);
        }
    });
}

CommonModel.getBikeMake = function(req, res){ 
    return new Promise(async function(resolve, reject) {
        var query = {};
        query.fetchData = 'tw_mmv';
        query.sortBy    = 'popularity';
        query.tags      = 'make,make_id,popularity_rank';
        query.fetchOnly = 'all_make';
        query.source    = config.source.autodb;
        query.subSource = config.subSource.vahanScrapper;

        try{
            let makes = await redisHelper.getJSON('bike_makes');
            if(!makes){
                let path    = '/api/v1/motor/getBkgMasterData';
                let result  = await commonHelper.sendGetRequestToBrokerage(query, path);
                makes       = await redisHelper.setJSON('bike_makes',result);     
                resolve(result); 
            }else{
                resolve(makes);
            }
        }catch(e){
            reject(e);
        }
    });
}

CommonModel.getBikeModel = function(makeId){ 
    return new Promise(async function(resolve, reject) {
        var query = {};
        query.fetchData = 'tw_mmv';
        query.sortBy    = 'modelPopularity';
        query.tags      = 'make,make_id,model,model_id,model_display_name,model_popularity_rank,status';   
        query.fetchOnly =  'all_model';
        query.makeId    = makeId;
        query.source    = config.source.autodb;
        query.subSource = config.subSource.vahanScrapper;

        try{
            let models = await redisHelper.getJSON('bike_models_'+makeId);
            if(!models){
                let path    = '/api/v1/motor/getBkgMasterData';
                let result  = await commonHelper.sendGetRequestToBrokerage(query, path);   
                models      = await redisHelper.setJSON('bike_models_'+makeId,result);     
                resolve(result);
            }else{
                resolve(models);
            }
        }catch(e){
            reject(e);
        }
    });
}

CommonModel.getBikeVariant = function(modelId){ 
    return new Promise(async function(resolve, reject) {
        var query = {};
        query.fetchData = 'tw_mmv';
        query.sortBy    = 'modelPopularity';
        query.tags      = 'make,make_id,model,model_id,version,version_id,version_display_name,cc,status,fuel';
        query.fetchOnly = 'all_variant';
        query.modelId    = modelId;
        query.source    = config.source.autodb;
        query.subSource = config.subSource.vahanScrapper;

        try{
            let variants = await redisHelper.getJSON('bike_variants_'+query.modelId);
            if(!variants){
                let path    = '/api/v1/motor/getBkgMasterData';
                let result  = await commonHelper.sendGetRequestToBrokerage(query, path);   
                variants    = await redisHelper.setJSON('bike_variants_'+query.modelId,result);     
                resolve(result);  
            }else{
                resolve(variants);
            }
        }catch(e){
            reject(e);
        }
    });
}

module.exports = CommonModel;