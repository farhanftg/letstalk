var commonHelper = require(HELPER_PATH+'commonHelper');
var redisHelper  = require(HELPER_PATH+'redisHelper');

var Variant = {};

Variant.getVariant = function(variantId){
    return new Promise(async function(resolve, reject) {
        var query = {};
        query.source    = config.source.b2c.toLowerCase();
        query.subSource = config.subSource.insuranceDekho;
        query.query = JSON.stringify({version_id:variantId});

        var options = {
            host: config.insuranceBrokerage.host,
            path: '/api/v1/MakemodelModel'
        };
        try{
            let variant = await redisHelper.getJSON('variant_'+variantId);
            if(!variant){
                let result = await commonHelper.sendGetRequest(query, options);
                if(result.data){
                    variant = await redisHelper.setJSON('variant_'+variantId,result.data);     
                    resolve(result.data);
                }else if(result.errors){
                    throw result.errors;                       
                }else{
                    throw ERROR.DEFAULT_ERROR;                        
                }              
            }else{
//                req.cached = true;
                resolve(variant);
            }
        }catch(e){
            reject(e);
        }
    });
}

module.exports = Variant;