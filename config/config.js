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
config.report.timeoutErrorTo    = ['farhanhashmi96@gmail.com'];
config.report.timeoutErrorTemplateName = 'B2C_API_TIMEOUT_ERROR_INS';

config.report.byPassLogError      = false;
config.report.byPassLogErrorTo = ['farhanhashmi96@gmail.com'];
config.report.byPassLogErrorTemplateName = 'B2C_API_BYPASS_LOG_ERROR_INS';

config.format = {};
config.format.json      = 'JSON';
config.format.xml       = 'XML';

config.status = {};
config.status.pending   = 1;
config.status.autoMapped= 2;
config.status.approved  = 3;

config.vehicleCategory = {};
config.vehicleCategory.twoWheeler   = 'Two Wheeler';
config.vehicleCategory.fourWheeler  = 'Four Wheeler';
config.vehicleCategory.other= 'Other';

config.vehicleCategoryCode = {};
config.vehicleCategoryCode.twoWheeler = 1;
config.vehicleCategoryCode.fourWheeler= 2;

config.vehicleType = {};
config.vehicleType.bike  = 'Bike';
config.vehicleType.car   = 'Car';
config.vehicleType.other = 'Other';

config.autoDBVehicleCategory = {};
config.autoDBVehicleCategory[config.vehicleCategory.twoWheeler] = config.vehicleType.bike;
config.autoDBVehicleCategory[config.vehicleCategory.fourWheeler]= config.vehicleType.car;
config.autoDBVehicleCategory[config.vehicleCategory.other]      = config.vehicleType.other;

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
config.showMaskedDataForSubsource = ['JpOffice', 'GgnOffice'];

config.requests = [
    {
        path:'*', 
        timeout:90000
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

config.autoMapRegistrationText                     = {};
config.autoMapRegistrationText.autoMapByMMV        = true;
config.autoMapRegistrationText.autoMapByMappedMMV  = true;
config.autoMapRegistrationText.autoMapByCorrectMMV = true;
config.autoMapRegistrationText.limit               = 100;

config.autoMapRegistrationText.mmv = [
    {
        name: 'Grand i10',
        values:['Grandi10', 'Grand i 10','Grand i-10', 'Grand-i-10', 'Grand-i 10', 'Grand-i10']
    },
    {
        name: 'i10',
        values:['i 10', 'i-10']
    },
    {
        name: 'i20',
        values:['i 20', 'i-20']
    },
    {
        name: 'Wagon R',
        values:['WagonR', 'Wagon-R', 'WaganR', 'Wagan-R', 'Wag-R']
    },
    {
        name: 'Classic 350',
        values:['Classic350', 'Classic-350']
    },
    {
        name: 'Classic 500',
        values:['Classic500', 'Classic-500']
    },
    {
        name: 'XUV300',
        values:['XUV 300', 'XUV-300']
    },
    {
        name: 'XUV500',
        values:['XUV 500', 'XUV-500']
    },
    {
        name: 'SX4 S Cross',
        values: ['S Cross', 'S-Cross', 'SCross']
    },
    {
        name: 'RediGO',
        values: ['Redi Go', 'Redi-Go']
    },
    {
        name: 'Swift Dzire Tour',
        values: ['Dzire Tour', 'Dzire-Tour', 'DzireTour']
    },
    {
        name: 'Swift Dzire',
        values: ['Dzire']
    },
    {
        name: 'Vitara Brezza',
        values: ['Vitara Breeza', 'Vitara-Breeza', 'VitaraBreeza']
    }
];

config.redisKeyExpiryTime = '23:59:59:999';
config.registrationNumberMaxLength = 15;
config.recordPerPage = 20;
config.corsAllowedOrigin = [/localhost:3000$/, /\.gaadi\.com$/, /\.insurancedekho\.com$/];

config.stripe = {};
config.stripe.secretkey = 'sk_test_51JDgqHSBkbMVSCXHWKt1U6UWuMfXq4mkprrBdQHeNTV5SaQ8GQH6r5wey143ewiLrAvVuQNJF9jDAMKHAP1IWhIW00VBudjboc';

global.BASE_DIR         = path.join(__dirname,'../');
global.UPLOAD_DIR       = 'uploads';
global.CONFIG_PATH      = BASE_DIR+'/config/';
global.HELPER_PATH      = BASE_DIR + '/helpers/';
global.UPLOAD_PATH      = BASE_DIR+'/'+UPLOAD_DIR+'/'
global.LOG_PATH         = BASE_DIR+'/logs/';
global.NODE_MODULE_PATH = BASE_DIR+'/node_modules/';
global.ELK_FILE_PATH    = BASE_DIR+'/logs/vahan_scrapper.json';

config.mysql = {};
config.mysql.host = 'localhost';
config.mysql.user = 'root'
config.mysql.password = 'root';
config.mysql.database = 'lms';

config.mysqlTable = {};
config.mysqlTable.users = 'users'
config.mysqlTable.cards = 'cards';

config.jwt = {};
config.jwt.tokenKey = 'jagdayutuastdyut';

module.exports = config;
