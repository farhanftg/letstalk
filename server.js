var app             = require('express')();
var express         = require('express');
var expressSession  = require('express-session');
var layout          = require('express-layout');
var flash           = require('connect-flash');
var moment          = require('moment');
var http            = require('http').Server(app);
var fs              = require('fs');
var url             = require('url');
var morgan          = require('morgan');
var rfs             = require('rotating-file-stream');
var bodyParser      = require('body-parser');
var cors            = require('cors');
var config          = require('./config/config');
var device          = require('express-device');

global.app      = app;
global.express  = express;
global.io       = require('socket.io')(http);
global.config   = config;

global.MESSAGE = require('./config/message-constants');
global.ERROR   = require('./config/error-constants');

require('./config/settings');
require('./config/db');
var authHelper      = require('./helpers/authHelper');
var commonHelper    = require('./helpers/commonHelper');

var passport        = require('passport');

require('./lib/passport')(passport);
global.passport = passport;

process.on('uncaughtException', function (exception) {
    console.log('########## SERVER CRASHED WITH UNCAUGHT EXCEPTION ##########');
    var err = exception;
    if (typeof err === 'object') {
        if (err.message) {
            console.log('\nMessage: ' + err.message)
        }
        if (err.stack) {
            console.log('\nStacktrace:')
            console.log('====================')
            console.log(err.stack);
        }
    } else {
        console.log('dumpError :: argument is not an object');
    }
});

process.on('unhandledRejection', function(err){
    console.log('########## SERVER CRASHED WITH UNHANDLED REJECTION ##########');
    if (typeof err === 'object') {
        if (err.message) {
            console.log('\nMessage: ' + err.message)
        }
        if (err.stack) {
            console.log('\nStacktrace:')
            console.log('====================')
            console.log(err.stack);
        }
    } else {
        console.log('dumpError :: argument is not an object');
    }
});

fs.existsSync(LOG_PATH) || fs.mkdirSync(LOG_PATH);
var accessLogStream = rfs('access.log', {
    size: '100M',
    maxFiles: 5,
    history: LOG_PATH+'access_history.txt',
    path: LOG_PATH
});
app.use(morgan('combined', {stream: accessLogStream}));

app.use(function (req, res, next) {
    res.setHeader('Cache-Control', 'public, no-cache');
    next();
});

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(expressSession({secret: config.sessionSecretKey, resave: true, saveUninitialized: false}));
app.use(flash());
app.use(layout());
app.use(express.static('public'));
app.use(cors({origin: config.corsAllowedOrigin, methods:['GET', 'POST', 'OPTIONS'], optionsSuccessStatus: 200}));
app.use(device.capture());


app.use(passport.initialize());
app.use(passport.session());
app.use('/gentelella', express.static(__dirname + '/node_modules/gentelella'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(function(req, res, next) {
    res.locals.user = '';
    if(req.user){
        res.locals.user = req.user;
    }
    next();
});


app.use(function(req, res, next) {
    req.elk = {};
    req.elk.requestTime = moment().format("YYYY-MM-DD HH:mm:ss.SSS");
    req.cached = false;
    next();
});

function isAuthenticated(req, res, next) {  
    if(req.originalUrl !== '/health' && !req.originalUrl.startsWith('/console') && !req.originalUrl.startsWith('/file')){        
        var isAuthenticated = authHelper.authenticate(req, res);
        if(isAuthenticated){
            next();                   
        }else{
            commonHelper.sendResponse(req, res, 401, false, false, false);
        }                   
    }else{
        next();
    }
}

//app.use(function(req, res, next){
//    var timeout     = '';
//    var urlParts    = url.parse(req.url, true);
//    var urlPathname = urlParts.pathname;
//    
//    for(var i=0; i<config.requests.length; i++){        
//        if(urlPathname == config.requests[i].path){
//            timeout = config.requests[i].timeout;
//        }
//        if(!timeout && config.requests[i].path == '*'){
//            timeout = config.requests[i].timeout;
//        }
//    }
//    
//    if(timeout){
//        res.setTimeout(timeout, function(){
//            if(config.report.timeoutError){
//                var error='';
//                var data = {};
//                var url  = req.host+req.url;
//                data.templateName   = config.report.timeoutErrorTemplateName;
//                data.emailTo        = config.report.timeoutErrorTo;
//                data.referenceId    = 1;
//                var requestData    = req.method == "GET" ? JSON.stringify(req.query) : JSON.stringify(req.body);
//                error = ' Timeout Error on '+url;
//                data.params = {'URL':url, 'TIMEOUT':timeout, 'ERROR': error, 'REQUEST': requestData};
//                commonHelper.sendResponse(req, res, 504, false, false, ERROR.DEFAULT_ERROR ); 
//                commonHelper.sendEmail(data).catch(function(e){
//                    console.log(e);
//                });                                   
//            }else{
//                commonHelper.sendResponse(req, res, 504, false, false, ERROR.DEFAULT_ERROR ); 
//            }
//        });
//    }
//    next();
//});

var api     = require('./routes/api');
var web     = require('./routes/web');
var cons    = require('./routes/console');

app.use('/v1', isAuthenticated, api);
app.use('/console', isAuthenticated, cons);
app.use('/', isAuthenticated, web);

config.port = process.env.PORT || config.port;
http.listen(config.port, config.host, function(){
    var message = config.message.portMsg + config.port;
    console.log(message);
});