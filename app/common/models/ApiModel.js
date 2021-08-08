/* var ErrorHelper = require(HELPER_PATH+'ErrorHelper');
 */const URL = require('url').URL;

class ApiModel{
    
    constructor() {
        
    }
    
}

var defaultMessage = {
    required:'is required',
    email: 'is invalid',
    mobile: 'is invalid',
    date: 'is invalid',
    number: 'should be number',
    title: 'should contain only alphabets and spaces',
    alphaNumeric: 'should be alpha numeric',
    alpha: 'should contain only alphabets',
    alphaWithUnderscore: 'should contain only alphabets and underscores',
    unique: 'should be unique',
    url: 'should be URL',
    array: 'should be Array',
    json: 'should be JSON',
    boolean: 'should be boolean'
};

ApiModel.validate = function(data, tableRules = this.rules){
    let that = this;
    return new Promise( async function(resolve, reject) {
        try{
            let isValid = true;
            let errors = [];
            for (var key in tableRules) {
                that.key = key;
                if (tableRules.hasOwnProperty(key)) {
                    let rules = tableRules[key];
                    for(var i=0; i < rules.length; i++){ 
                        var rule = rules[i];
                        if(key.indexOf('.') > -1){
                            var value = getNestedKeyValue(key, data);
                        }else{
                            var value = data && (data[key] || data[key] == 0 || data[key] == false) ? data[key] : null;
                        }
                        if(typeof rule == 'object'){
                            message = rule.message?rule.message: key + ' ' +defaultMessage[rule.rule];
                            isValid = that[rule.rule](value, rule);                  
                        }else{
                            message = rule.message?rule.message: key + ' ' +defaultMessage[rule];
                            isValid = that[rule](value);
                        }
                        if(!isValid){               
                            let error = ErrorHelper.formatError('ERR400', key, message);
                            errors = errors.concat(error);
                        }
                    }
                }
            }
            resolve(errors);
        }catch(e){
            reject(e);
        }
    });
},

ApiModel.getNestedKeyValue = function(key, obj) {
        var i=0;
        var keys = key.split('.');
        var value = obj[keys[i]];
        if (value && typeof value === 'object') {
            key = key.substring(key.indexOf('.')+1);
            i++;
            return getNestedKeyValue(key, value);
        }
        return value;
    },

ApiModel.insertOne =  function(data, table = false){
    table = table?table:this.table;
    return new Promise( async function(resolve, reject) {
        try{
            let fields = new Array();
            let values = new Array();
            let query = 'INSERT INTO '+table;
            Object.keys(data).forEach(function (key) {
                fields.push(key);
                values.push("'"+data[key]+"'");
            });
            query += ' ('+fields.join(',')+' ) VALUES ('+values.join(',')+' )';
            let result = await mysqldb.queryAsync(query);
            if(result && result.insertId){
                resolve(result.insertId);
            }else{
                resolve(null);
            }
        }catch(e){
            reject(e);
        }
    });
}

ApiModel.insertMany =  function(data, fields = [], table = false){
    table = table?table:this.table;
    return new Promise( async function(resolve, reject) {
        try{
            let valueStr= '';
            
            let query   = 'INSERT INTO '+table;
            if(!fields.length){
                Object.keys(data[0]).forEach(function (key) {
                    fields.push(key);
                });
            }
            data.forEach(function (item, index) {
                let values  = new Array();
                Object.keys(item).forEach(function (key) {
                    values.push("'"+item[key]+"'");
                });
                valueStr += '('+values.join(',')+'),';
            });
            query += ' ('+fields.join(',')+' ) VALUES '+ApiModel.trimCondition(valueStr);
            let result = await mysqldb.queryAsync(query);
            if(result && result.insertId){
                resolve(result.insertId);
            }else{
                resolve(null);
            }
        }catch(e){
            reject(e);
        }
    });
}

ApiModel.update =  function(condition, data, table = false){
    table = table?table:this.table;
    return new Promise( async function(resolve, reject) {
        try{
            let query = 'UPDATE '+table+' SET ';
            Object.keys(data).forEach(function (key) {
                query += key+'='+'"'+data[key]+'",';
            });
            query = ApiModel.trimSelect(query);
            query+= 'WHERE '+ApiModel.trimCondition(condition);
            
            let result = await mysqldb.queryAsync(query);
            if(result && result.affectedRows){
                resolve(result.affectedRows);
            }else{
                resolve(null);
            }
        }catch(e){
            reject(e);
        }
    });
}

ApiModel.findOne = function(condition, table = false){
    table = table?table:this.table;
    return new Promise( async function(resolve, reject) {
        try{
            if(condition){
                condition = ' WHERE '+ApiModel.trimCondition(condition);
            }
            let query  = 'SELECT * from '+table+condition+' LIMIT 1';
            let result = await mysqldb.queryAsync(query);
            if(result.length){
                resolve(result[0]);
            }else{
                resolve(null);
            }
        }catch(e){
            reject(e);
        }
    });  
}

ApiModel.findById = function(id, table = false){
    let that = this;
    table = table?table:this.table;
    return new Promise( async function(resolve, reject) {
        try{
            let condition = ' id='+id;
            let result = that.findOne(condition, table);
            if(result){
                resolve(result);
            }else{
                resolve(null);
            }
        }catch(e){
            reject(e);
        }
    });  
}

ApiModel.find = function(condition, table = false){
    table = table?table:this.table;
    return new Promise( async function(resolve, reject) {
        try{
            if(condition){
                condition = ' WHERE '+ApiModel.trimCondition(condition);
            }
            let query  = 'SELECT * from '+table+condition;
            let result = await mysqldb.queryAsync(query);
            resolve(result);            
        }catch(e){
            reject(e);
        }
    });  
}

ApiModel.count = function(condition= false, table = false){
    table = table?table:this.table;
    return new Promise( async function(resolve, reject) {
        try{
            if(condition){
                condition = ' WHERE '+ApiModel.trimCondition(condition);
            }
            let query  = 'SELECT COUNT(*) as count FROM '+table+condition;
            let result = await mysqldb.queryAsync(query);
            if(result && result[0]){
                resolve(result[0].count);
            }else{
                resolve(null);
            }
        }catch(e){
            reject(e);
        }
    });  
}

ApiModel.executeQuery = function(query , is_slave = true){
    return new Promise( async function(resolve, reject) {
        try{
            if(query){
                if(is_slave){
                    let result = await slaveMysqlDb.queryAsync(query);
                    resolve(result);
                }else{
                    let result = await mysqldb.queryAsync(query);
                    resolve(result);
                }               
            }else{
                throw ERROR.QUERY_REQUIRED;
            }
        }catch(e){
            reject(e);
        }
    });  
}

ApiModel.trimSelect = function(select){ 
    select = select.trim().replace(/^[,]+/, "").trim();
    select = select.trim().replace(/[,]+$/, "").trim();
    return select;
}

ApiModel.trimCondition = function(condition = ''){ 
    if(condition){
        condition = condition.trim().replace(/^[,]+/, "").trim();
        condition = condition.trim().replace(/[,]+$/, "").trim();
        condition = condition.trim().replace(/^[AND,OR]+/, "").trim();
        condition = condition.trim().replace(/[AND,OR]+$/, "").trim();
    }
    return condition;
}

ApiModel.email = function(value) {
    if(!value){
        return true;
    }  
    var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(value);
}

ApiModel.mobile = function(value) {
    if(!value){
        return true;
    }  
    var regex =  /^[6-9][0-9]{9}$/;
    return regex.test(value);
}

ApiModel.date = function(value){
    var regex = /^\d{4}-\d{2}-\d{2}$/;
    var timestamp = Date.parse(value);
    if(!value){
        return true;
    }        
    if (value.match(regex) && !isNaN(timestamp)) {
        return true;
    }
    return false;
}

ApiModel.length = function(value, rule){ 
    if(!value || (value.length >= rule.min && value.length <=  rule.max)){
        return true;
    }  
    return false;
}

ApiModel.number = function(value){ 
    if(value && isNaN(value)){
        return false;
    } 
    return true;
}

ApiModel.alphaNumeric = function(value){
    if(value){
        var regex = /^[a-zA-Z0-9]+$/;
        return regex.test(value);
    }
    return true;
}

ApiModel.alpha = function (value) {
    if (value) {
        let regex = /^[a-zA-Z]+$/;
        return regex.test(value);
    }
    return true;
}

ApiModel.alphaWithUnderscore = function (value) {
    if (value) {
        let regex = /^[a-zA-Z\_]+$/;
        return regex.test(value);
    }
    return true;
}

ApiModel.title = function (value) {
    if (value) {
        let regex = /^[a-zA-Z\ \.\'\-]+$/;
        return regex.test(value);
    }
    return true;
}

ApiModel.required = function(value){
    if(value || value == false || value == 0){
        return true;
    }
    return false;
}

ApiModel.url = function(value){ 
    try {
        if(value){
            new URL(value);
        }
    } catch (e) {
        return false;  
    }
    return true;
}

ApiModel.array = function(value){ 
    if(value){
        if(!Array.isArray(value)){
            return false;
        } 
    }
    return true;
}

ApiModel.json = function(value) {
    if(value){
        return toString.call(value) === '[object Object]';
    }
    return true;
}

ApiModel.boolean = function(value) {
    return value === true || value === false;
}

module.exports = ApiModel;