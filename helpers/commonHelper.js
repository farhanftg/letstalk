var qs          = require('qs');
var http        = require('http');
var https       = require('https');
var moment      = require('moment');
var useragent   = require('useragent');
var apiLogModel = require('../app/common/models/apiLogModel');
var errorApiLogModel = require('../app/common/models/errorApiLogModel');
var elkHelper        = require('./elkHelper');
var errorHelper      = require('./errorHelper');

module.exports = {
    
    getMessage: function(code){
        var status = new Object();
        status['200'] = 'Success';
        status['201'] = 'Created';
        status['202'] = 'Accepted';
        status['203'] = 'Non-Authoritative Information';
        status['204'] = 'No Content';
        status['205'] = 'Reset Content';
        status['206'] = 'Partial Content';
        status['400'] = 'Bad Request';
        status['401'] = 'Unauthorized';
        status['402'] = 'Payment Required';
        status['403'] = 'Forbidden';
        status['404'] = 'Not Found';
        status['405'] = 'Method Not Allowed';
        status['406'] = 'Not Acceptable';
        status['407'] = 'Proxy Authentication Required';
        status['408'] = 'Request Timeout';
        status['409'] = 'Conflict';
        status['410'] = 'Gone';
        status['411'] = 'Length Required';
        status['412'] = 'Precondition Failed';
        status['413'] = 'Request Entity Too Large';
        status['414'] = 'Request-URI Too Long';
        status['415'] = 'Unsupported Media Type';
        status['416'] = 'Requested Range Not Satisfiable';
        status['417'] = 'Expectation Failed';
        status['500'] = 'Internal Server Error';
        status['501'] = 'Not Implemented';
        status['502'] = 'Bad Gateway';
        status['503'] = 'Service Unavailable';
        status['504'] = 'Gateway Timeout';
        status['505'] = 'HTTP Version Not Supported';
        status['509'] = 'Bandwidth Limit Exceeded';
        return status[code];
    },
    
    sendSuccessResponse: function(req, res, data){
        this.sendResponse(req, res, 200, false, data);
    },
    
    sendErrorResponse: function(req, res, errors){
        this.sendResponse(req, res, 400, false, false, errors);
    },
    
    sendResponse: function(req, res, status, message, data, errors){
        var errorType   = 1;
        var response    = new Object();
        var agent       = useragent.parse(req.headers['user-agent']);
        var userIp      = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : '');
        var userAgent   = agent.toString();
        var userDevice  = req.device && req.device.type?req.device.type:'';

        if(status){
            if(status == 400 || status == 401){
                errorType = 2;
            }
            response.status = status;
            response.message= this.getMessage(status);
            response.cached = req.cached;
        }
        if(message){
            response.message = message;
        }
        if(data){
            response.data = data;
        }
        if(errors){
            if(typeof errors === 'string'){
                error = errorHelper.formatError('ERR400', 'error', errors);
                errors= new Array(error);
            }
            if(errors instanceof Error){
                error = errorHelper.formatError('ERR500', 'error', '', errors.stack);
                errors= new Array(error);
            }
            response.errors = errors;
        }

        var url         = req.protocol+'://'+req.headers.host+req.originalUrl;
        var urlParts    = require('url').parse(req.url, true);
        var urlPathname = urlParts.pathname;

        if(config.byPassLog.indexOf(urlPathname) == -1){
            if(config.apiLog){
                var query = {};

                if(req.method == 'GET'){
                    query = req.query;
                }
                if(req.method == 'POST'){
                    query = req.body;
                }
                apiLogModel.addApiLog(url, req.method, query, response, userIp, userAgent, userDevice);   
            }
            if(config.elkLog){
                elkHelper.log(req, response, errorType);
            }
        }else{
            if(config.report.byPassLogError && response.hasOwnProperty('errors')){
                var error = '';
                var data  = {};
                data.templateName   = config.report.byPassLogErrorTemplateName;
                data.emailTo        = config.report.byPassLogErrorTo;
                data.referenceId    = 1;
                error  = JSON.stringify(response.errors);
                data.params = {'URL':url, 'ERROR': error};
                module.exports.sendEmail(data).catch(function(e){
                    console.log(e);
                });   
            }
        }
        if(!res.headersSent){ 
            res.status(status).send(response);
        }   
    },
    
    sendGetRequestToBrokerage:function(query, path){
        return new Promise(async function(resolve, reject) {
            var options = {
                        host: config.insuranceBrokerage.host,
                        path: path                          
                    };   
            try{
                let result = await module.exports.sendGetRequest(query, options);
                if(result.data){
                    resolve(result.data);
                }else if(result.errors){
                    throw result.errors;                       
                }else{
                    throw ERROR.DEFAULT_ERROR;                        
                }              
            }catch(e){
                reject(e);
            }  
        });
    },
    
    sendPostRequestToBrokerage:function(query, path){
        return new Promise(async function(resolve, reject) {
            var options = {
                        host: config.insuranceBrokerage.host,
                        path: path                          
                    };   
            try{
                let result = await module.exports.sendPostRequest(query, options);
                if(result.data){
                    resolve(result.data);
                }else if(result.errors){
                    throw result.errors;                       
                }else{
                    throw ERROR.DEFAULT_ERROR;                        
                }              
            }catch(e){
                reject(e);
            }  
        });
    },
    
    
    sendGetRequest: function(query, options){
        return new Promise(function(resolve, reject) {
            var data = {};
            var protocol    = https;
            var protocolStr = 'https';
            var url = options.path;
            
            options.method = 'GET';
            
            if(query){
                var queryStr = qs.stringify(query);
                options.path   += '?'+queryStr;
            }
            
            if(options.protocol && options.protocol == 'http'){
                protocol    = http;
                protocolStr = 'http';
                delete options.protocol;
            }
            url = protocolStr+'://'+options.host+url;  
            data.url      =  url;       
            data.method   = options.method;
            data.request  = query;
            data.response = {};
            var request = protocol.request(options, function(response) {
                response.setEncoding('utf8');
                var responseData = '';
                response.on('data', function (data) {
                    responseData+=data;
                });
                response.on('end', function() {
                    try{                       
                        data.response = JSON.parse(responseData);
                        if(config.apiLog && config.byPassLog.indexOf(url) == -1){
                            apiLogModel.addApiLog(data.url, data.method, data.request, data.response, '', '', '');                                  
                        }
                        resolve(data.response);                     
                    }catch(err){  
                        reject(ERROR.DEFAULT_ERROR);                       
                    }
                });  
            });
            request.on('error', function(e){
                console.log('problem with request:'+ e.message+' on '+ moment().format('YYYY-MM-DD HH:mm:ss'));
                reject(ERROR.DEFAULT_ERROR);  
            });
            request.end(); 
        });
    },

    sendPostRequest: async function(query, options){
        return new Promise(function(resolve, reject) {            
            var queryStr;                      
            var data        = {};
            var protocol    = https;
            var protocolStr = 'https';

            options.method = 'POST';

            if(options.headers){
                if(options.headers['Content-Type'] && options.headers['Content-Type'] == 'application/json'){
                    queryStr = JSON.stringify(query);
                }else{
                    queryStr = qs.stringify(query);
                }        
            }else{
                options.headers = {};
                options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
                queryStr = qs.stringify(query);
            }

            //options.headers['Content-Length'] = queryStr.length;

            if(options.protocol && options.protocol == 'http'){
                protocol    = http;
                protocolStr = 'http';
                delete options.protocol;
            }

            var url = protocolStr+'://'+options.host+options.path;
            data.url     = url;
            data.method  = options.method;
            data.request = query;
            data.response= {};
            var request = protocol.request(options, function(response) {
                response.setEncoding('utf8');
                var responseData = '';
                response.on('data', function (data) {
                    responseData+=data;
                });
                response.on('end', function() {
                    try{                       
                        data.response = JSON.parse(responseData);
                        if(config.apiLog && config.byPassLog.indexOf(url) == -1){
                            apiLogModel.addApiLog(data.url, data.method, data.request, data.response, '', '', '');                                      
                        }
                        resolve(data.response);                     
                    }catch(err){  
                        console.log(err);
                        reject(ERROR.DEFAULT_ERROR);                       
                    }
                });  
            });
            request.on('error', function(e){
                console.log('problem with request:'+ e.message+' on '+ moment().format('YYYY-MM-DD HH:mm:ss'));
                reject(ERROR.DEFAULT_ERROR);  
            });
            request.write(queryStr);
            request.end(); 
        }); 
    },

    sendEmail: function(params){
        return new Promise(async function(resolve, reject) {
            var data = {};
            var to   = {};
            var cc   = {};

            if(params.emailTo){
                if(params.emailTo instanceof Array){
                    for(var i=0; i< params.emailTo.length; i++){
                        to[params.emailTo[i]] = '';
                    }
                }else{
                    to[params.emailTo] = '';
                }
                data.to = JSON.stringify(to);
            }
            if(params.emailCc){
                if(params.emailCc instanceof Array){
                    for(var i=0; i< params.emailCc.length; i++){
                        cc[params.emailCc[i]] = '';
                    }
                }else{
                    cc[params.emailCc] = '';
                }
                data.cc = JSON.stringify(cc);
            }   

            data.template_name    = params.templateName;
            data.template_variable= JSON.stringify(params.params);
            data.reference_type   = 'AutoDB Scrapper';
            data.reference_id     = params.referenceId;
            data.subject_variable = JSON.stringify(params.params);


            var options = {
                            //protocol: config.insuranceItms.protocol,
                            host: config.insuranceItms.host,
                            path: '/send_mail',
                            headers: {
                                'x-auth-id'    : config.insuranceItms.xAuthId,
                                'x-auth-token'  : config.insuranceItms.xAuthToken,                           
                                'Content-Type'  : 'application/json'
                            }
                        };
                        
            try{
                let result = await module.exports.sendPostRequest(data, options);
                if(result.data){
                    resolve(result.data);
                }else if(result.error){
                    throw result.error;                       
                }else{
                    throw ERROR.DEFAULT_ERROR;                        
                }                     
            }catch(e){
                reject(e);
            }   
        });
    },

    getCurrentDate: function(){
        var date   = new Date();
        var day    = date.getDate();
        var month  = date.getMonth() + 1;  
        var year   = date.getFullYear();
        if(day < 10){
            day = '0'+day;
        }
        if(month < 10){
            month = '0'+month;
        }
        var dateText= year + "-" + month + "-" + day;
        return dateText;
    },

    getNinentyDaysBeforeDate: function(dateText){
        var date = new Date(dateText);
        date.setDate(date.getDate() - 90);

        var day    = date.getDate();
        var month  = date.getMonth() + 1;  
        var year   = date.getFullYear();
        if(day < 10){
            day = '0'+day;
        }
        if(month < 10){
            month = '0'+month;
        }
        var dateText= year + "-" + month + "-" + day;
        return dateText;
    },

    capitalizeFirstLetter: function(str){
        return str.charAt(0).toUpperCase() + str.substr(1);
    },

    isEmpty:function(value){
        if(!value || value === '0'){
            return true;
        }
        return false;
    },

    removeMultipleSpace: function(str){
        return str.replace(/\s\s+/g, ' ');
    },

    removeLineCharacters: function(str){
        return str.replace(/\r?\n|\r/g, ' ');
    },
    
    isJsonString: function(data) {
        try {
            JSON.parse(data);
        } catch (e) {
            return false;
        }
        return true;
    },
    getRtoCodeByRegistrationNumber: function(registrationNumber){
        var rtoCode = '';
        if(registrationNumber){
            rtoCode         = registrationNumber.toUpperCase().substring(0,4); 
            if(rtoCode[2] != '0' && isNaN(rtoCode[3])){
                var stateCode   = registrationNumber.substring(0,2);
                var areaCode    = '0'+rtoCode[2];
                rtoCode = stateCode+areaCode;
            }
        }
        return rtoCode;
    },
    
    removeMakeNameFromModelName: function(makeName, modelName){
        if(typeof makeName == 'string' && typeof modelName == 'string'){
            makeName    = makeName.trim();
            modelName   = modelName.trim();
            if(makeName && modelName){
                
                if(modelName.startsWith(makeName)){
                    modelName = modelName.substring(makeName.length+1, modelName.length);
                }
                return modelName.trim();
            }
        }
        return modelName;
    }
}