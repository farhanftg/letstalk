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

config.report.lmsLeadError      = false;
config.report.lmsLeadErrorTo    = ['anand.gupta@girnarsoft.com', 'sanjay.singh@girnarsoft.com'];
config.report.lmsLeadErrorTemplateName = 'B2C_LEAD_LMS_ERROR_INS';

config.report.timeoutError      = true;
config.report.timeoutErrorTo    = ['anand.gupta@girnarsoft.com', 'sanjay.singh@girnarsoft.com', 'saurabh.jain1@girnarsoft.com'];
config.report.timeoutErrorTemplateName = 'B2C_API_TIMEOUT_ERROR_INS';

config.report.byPassLogError   = true;
config.report.byPassLogErrorTo = ['anand.gupta@girnarsoft.com', 'sanjay.singh@girnarsoft.com', 'saurabh.jain1@girnarsoft.com'];
config.report.byPassLogErrorTemplateName = 'B2C_API_BYPASS_LOG_ERROR_INS';

config.report.proposalDataError   = true;
config.report.proposalDataErrorTo = ['anand.gupta@girnarsoft.com', 'sanjay.singh@girnarsoft.com', 'saurabh.jain1@girnarsoft.com'];
config.report.proposalDataErrorTemplateName = 'B2C_PROPOSAL_LMS_ERROR_INS';

config.report.dailyLeadReportTo= ['sumit.shairya@girnarsoft.com'];

config.format = {};
config.format.json      = 'JSON';
config.format.xml       = 'XML';

config.vehicleCategory = {};
config.vehicleCategory.bike = 'Bike';
config.vehicleCategory.car  = 'Car';
config.vehicleCategory.bus  = 'Bus';
config.vehicleCategory.truck= 'Truck';
config.vehicleCategory.pcv  = 'PCV';
config.vehicleCategory.gcv  = 'GCV';
config.vehicleCategory.other= 'Other';

config.source = {};
config.source.b2c = 'B2C';
config.source.itms= 'Itms';
config.source.lms = 'Lms';
config.source.b2cUpdatedBy = 2;

config.subSource = {};
config.subSource.insuranceDekho = 'insuranceDekho';
config.subSource.renewal = 'renewal';

config.leadType = {};
config.leadType.newCar = 'NewCar';

config.aws      = {};
config.aws.s3   = {};
config.aws.s3.enabled   = true;
config.aws.s3.bucketName= 'girnarsoft-b2c'; 

config.inspection = {};
config.inspection.timeSlot = {};
config.inspection.timeSlot[1] = {};
config.inspection.timeSlot[1].value = '9:00';
config.inspection.timeSlot[1].displayName = '09:00 AM - 11:00 AM';
config.inspection.timeSlot[2] = {};
config.inspection.timeSlot[2].value = '11:00';
config.inspection.timeSlot[2].displayName = '11:00 AM - 02:00 PM';
config.inspection.timeSlot[3] = {};
config.inspection.timeSlot[3].value = '14:00';
config.inspection.timeSlot[3].displayName = '02:00 PM - 04:00 PM';
config.inspection.timeSlot[4] = {};
config.inspection.timeSlot[4].value = '16:00';
config.inspection.timeSlot[4].displayName = '04:00 PM - 06:00 PM';

config.newsArticleListingSeo = {};
config.newsArticleListingSeo.title          = "Car Insurance News - Information, Articles & Tips | InsuranceDekho";
config.newsArticleListingSeo.metaDescription= "Read Car Insurance News in India, helpful tips and Information at InsuranceDekho. Browse through all Car Insurance articles and Keep yourself updated with latest news on Car Insurance.";
config.newsArticleListingSeo.metaKeywords = '';

config.newsArticleListingPageTitle = 'Car Insurance News';
config.newsListingCharaterLimit = 100;


config.insuranceDekho = {};
config.insuranceDekho.assetsDomain = 'https://staticstaging.insurancedekho.com'; 
config.insuranceDekho.topNewsArticlesCount = 6;

config.hiddenMakes = [49,57,67];
config.hiddenPreviousInsurers = [26];

config.reQuoteVariables = [  
                "basicODPremium",
                "biFuelKitPremium",
                "electricalAccessoriesPremium",
                "nonElectricalAccessoriesPremium",
                "loadingPercentage",
                "loadingPremium",
                "odDiscountPercentage",
                "odDiscount",
                "ncbDiscountPercentage",
                "ncbDiscount",
                "voluntaryDiscount",
                "professionalDiscount",
                "antiTheftDiscount",
                "automobileMembershipDiscount",
                "onlineDiscount",
                "ageDiscount",
                "insurerDiscount",
                "otherDiscount",
                "otherDiscountPercentage",
                "basicTPPremium",
                "ownerDriverPremium",
                "paidDriverPremium",
                "biFuelKitLiabilityPremium",
                "passengerCoverPremium",
                "addOns.zeroDepreciationCover.premium",
                "addOns.consumablesCover.premium",
                "addOns.engineCover.premium",
                "addOns.ncbProtectionCover.premium",
                "addOns.roadsideAssistanceCover.premium",
                "addOns.invoiceCover.premium",
                "addOns.windShieldCover.premium",
                "addOns.emergencyAssistanceCover.premium",
                "addOns.medicalExpensesCover.premium",
                "addOns.ambulanceChargesCover.premium",
                "addOns.hydrostaticLockCover.premium",
                "addOns.hospitalCashCover.premium",
                "addOns.keyReplacementCover.premium",
                "addOns.geographicExtensionCover.premium",
                "addOns.lossOfUseCover.premium",
                "addOns.lossOfPersonalBelonging.premium",
                "addOns.emergencyTransportHotelExpenses.premium",
                "addOns.tyreSecure.premium",
                "addOns.repairofGlassRubberPlasticParts.premium",
                "addOns.rimDamageCover.premium",
                "tpAddOns.ownerDriverCover.premium",
                "tpAddOns.paidDriverCover.premium",
                "totalAddOnsPremium",
                "finalODPremium",
                "finalTPPremium",
                "finalAddOnPremium",
                "totalPremium",
                "serviceTaxPercentage",
                "serviceTax",
                "finalPremium"
            ];

config.requests = [
    {
        path:'*', 
        timeout:30000
    },
    {
        path:'/quotes', 
        timeout:60000
    },
    {
        path:'/proposal', 
        timeout:90000
    }
];

config.apiLog   = true;
config.elkLog   = false;
config.accessLog= true;
config.byPassLog = ['/set-user-status', '/getInsurers', '/home', '/content/home', '/content/make', '/content/plan-confirmation', '/news','/news-article', '/content/privacy-policy', '/api/v1/motor/policyDocument', '/common/get-mapped-data', '/api/v1/motor/mappedMasterData', '/api/v1/motor/insurersMaster', '/api/v1/motor/getBkgMasterData', '/api/v1/motor/policyDocument', '/favicon.ico', 'https://lms.insurancedekho.com/setUserLastOnline','https://lmsstaging.insurancedekho.com/setUserLastOnline'];
config.hideDetailInErrorResponse    = false;
config.showDefaultErrorMessage      = false;
//config.defaultErrorMessage          = 'Some error has occurred. Please try again.';
//config.defaultLmsErrorMessage       = 'Some error has occurred at LMS.';
//config.defaultBrokerageErrorMessage = 'Some error has occurred at Brokerage.';

config.allowedBrokeragePath = ['/api/v1/motor/policyDocument', '/api/v1/motor/mappedMasterData', '/api/v1/motor/insurersMaster', '/api/v1/motor/getBkgMasterData'];


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
global.ELK_FILE_PATH    = BASE_DIR+'/logs/b2c_api.json';

module.exports = config;
