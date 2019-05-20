var path    = require('path');

var config  = {};

config.sessionSecretKey = 'c@rDekh0';

config.clients = [
    {
        apiKey:'insuranceDekho',
        apiSecret:'insur@nceDekh0'
    },
    {
        apiKey:'carDekho',
        apiSecret:'c@rDekh0',
    }
];

config.message = {};
config.message.portMsg  = 'listening on *:';

config.mailer = {};
config.mailer.username  = 'ucchatbot@gaadi.com';
config.mailer.password  = 'HH1012utybyu';

config.report = {};
config.report.from      = 'ucchatbot@gaadi.com';
config.report.to        = 'anand.gupta@girnarsoft.com';

config.report.timeoutError      = true;
config.report.timeoutErrorTo    = ['anand.gupta@girnarsoft.com', 'sanjay.singh@girnarsoft.com'];
config.report.timeoutErrorTemplateName = 'B2C_API_TIMEOUT_ERROR_INS';

config.report.byPassLogError      = false;
config.report.byPassLogErrorTo    = ['anand.gupta@girnarsoft.com', 'sanjay.singh@girnarsoft.com'];
config.report.byPassLogErrorTemplateName = 'B2C_API_BYPASS_LOG_ERROR_INS';

config.format = {};
config.format.json      = 'JSON';
config.format.xml       = 'XML';

config.status = {};
config.status.pending   = 1;
config.status.autoMapped  = 2;
config.status.approved= 3;

config.vehicleCategory = {};
config.vehicleCategory.twoWheeler   = 'Two Wheeler';
config.vehicleCategory.fourWheeler  = 'Four Wheeler';
config.vehicleCategory.other= 'Other';

config.vehicleCategoryCode = {};
config.vehicleCategoryCode.twoWheeler = 1;
config.vehicleCategoryCode.fourWheeler= 2;

config.source = {};
config.source.autodb    = 'autodb';
config.source.parivahan = 'parivahan';
config.source.vahan     = 'vahan';
config.source.rtoVehicle= 'rtoVehicle';

config.subSource = {};
config.subSource.vahanScrapper = 'vahanScrapper';

config.aws      = {};
config.aws.s3   = {};
config.aws.s3.enabled   = true;
config.aws.s3.bucketName= 'girnarsoft-autodb'; 

config.onDemandAllowedSubsource = ['JpOffice', 'GgnOffice'];

config.requests = [
    {
        path:'*', 
        timeout:30000
    }
];

config.apiLog   = true;
config.elkLog   = false;
config.accessLog= true;
config.byPassLog = ['/api/v1/motor/mappedMasterData', '/api/v1/motor/getBkgMasterData', '/favicon.ico'];
config.hideDetailInErrorResponse    = false;
config.showDefaultErrorMessage      = false;

//paginatiom
config.pagination = {};
config.pagination.limit = 20;

config.autoMapRegistrationText = {};
config.autoMapRegistrationText.limit = 100;

config.redisKeyExpiryTime = '23:59:59:999';
config.registrationNumberMaxLength = 15;
config.recordPerPage = 20;
config.corsAllowedOrigin = [/localhost:3000$/, /\.gaadi\.com$/, /\.insurancedekho\.com$/];

global.BASE_DIR         = path.join(__dirname,'../');
global.UPLOAD_DIR       = 'uploads';
global.CONFIG_PATH      = BASE_DIR+'/config/';
global.HELPER_PATH      = BASE_DIR+'/helpers/';
global.UPLOAD_PATH      = BASE_DIR+'/'+UPLOAD_DIR+'/'
global.LOG_PATH         = BASE_DIR+'/logs/';
global.NODE_MODULE_PATH = BASE_DIR+'/node_modules/';
global.ELK_FILE_PATH    = BASE_DIR+'/logs/vahan_scrapper.json';

module.exports = config;
