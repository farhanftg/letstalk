
config.host         = '0.0.0.0';
config.hostName     = 'localhost:3000';

config.port = 3000;

config.mongodb = {};
config.mongodb.uri       = 'mongodb://localhost:27017/insurance_b2c';
config.mongodb.host      = 'localhost:27017';
config.mongodb.user      = '';
config.mongodb.password  = '';
config.mongodb.database  = 'insurance_b2c';

config.autodb = {};
config.autodb.protocol  = 'https';
config.autodb.host      = 'apiautodb.cardekho.com';
config.autodb.token     = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdGF0dXMiOjEsInVwZGF0ZWRfYXQiOiIyMDE4LTAzLTE1VDEzOjI4OjI1LjI5N1oiLCJfaWQiOiI1YThlYzhiNTdmZmJlZjAxMDAwMDAwMDEiLCJmaXJzdG5hbWUiOiJBbmFuZCIsImxhc3RuYW1lIjoiR3VwdGEiLCJwYXNzd29yZCI6IiIsImNyZWF0ZWRfYXQiOiIyMDE4LTAzLTE1VDEzOjI4OjI1LjI5N1oiLCJlbWFpbCI6ImFuYW5kLmd1cHRhQGdpcm5hcnNvZnQuY29tIiwicm9sZSI6MiwiaWQiOiI1YThlYzhiNTdmZmJlZjAxMDAwMDAwMDEiLCJpYXQiOjE1Mzc5NjkwNzN9.ILDZfsu71zv5-qKzzWiOytGrakmLc7o0ryfrysWlKNU';

config.insuranceItms = {};
config.insuranceItms.protocol    = 'https';
config.insuranceItms.host       = 'apiitms.girnarinsurance.com';
config.insuranceItms.xAuthToken = 'f53e457a24523c259e1a191ea14ab2a8';
config.insuranceItms.xAuthId    = '794';

config.insuranceLms = {};
//config.insuranceLms.protocol   = 'https';
config.insuranceLms.host       = 'lmsstaging.insurancedekho.com';
config.insuranceLms.xAuthKey   = 'lms_insurance';
config.insuranceLms.xAuthToken = 'wxThLeZGSDgh6hgdasIDLeGsNeuuZwkhQqhGsXfI7ID5D1I1A=';

config.insuranceBrokerage = {};
config.insuranceBrokerage.protocol  = 'https';
config.insuranceBrokerage.host      = 'apibrokerageuat.girnarinsurance.com';
config.insuranceBrokerage.apiKey    = 'GAADI123456';

config.redis = {};
config.redis.host = '';
config.redis.port = '';

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

config.report.timeoutError  = false;
config.report.timeoutErrorTo= ['anand.gupta@girnarsoft.com'];

config.report.byPassLogErrorTo = ['anand.gupta@girnarsoft.com'];

config.report.proposalDataError   = true;
config.report.proposalDataErrorTo = ['anand.gupta@girnarsoft.com'];

config.byPassLog = [];

module.exports = config;