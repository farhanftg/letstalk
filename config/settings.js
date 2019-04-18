
config.host         = '0.0.0.0';
config.hostName     = 'localhost:3000';

config.port = 3000;

config.mongodb = {};
config.mongodb.uri       = 'mongodb://localhost:27017/vahan';
config.mongodb.host      = 'localhost:27017';
config.mongodb.user      = '';
config.mongodb.password  = '';
config.mongodb.database  = 'vahan';

config.autodb = {};
config.autodb.protocol  = 'https';
config.autodb.host      = 'apiautodb.cardekho.com';
config.autodb.token     = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdGF0dXMiOjEsInVwZGF0ZWRfYXQiOiIyMDE4LTAzLTE1VDEzOjI4OjI1LjI5N1oiLCJfaWQiOiI1YThlYzhiNTdmZmJlZjAxMDAwMDAwMDEiLCJmaXJzdG5hbWUiOiJBbmFuZCIsImxhc3RuYW1lIjoiR3VwdGEiLCJwYXNzd29yZCI6IiIsImNyZWF0ZWRfYXQiOiIyMDE4LTAzLTE1VDEzOjI4OjI1LjI5N1oiLCJlbWFpbCI6ImFuYW5kLmd1cHRhQGdpcm5hcnNvZnQuY29tIiwicm9sZSI6MiwiaWQiOiI1YThlYzhiNTdmZmJlZjAxMDAwMDAwMDEiLCJpYXQiOjE1Mzc5NjkwNzN9.ILDZfsu71zv5-qKzzWiOytGrakmLc7o0ryfrysWlKNU';

config.insuranceBrokerage = {};
config.insuranceBrokerage.protocol  = 'https';
config.insuranceBrokerage.host      = 'apibrokerageuat.girnarinsurance.com';
config.insuranceBrokerage.apiKey    = 'GAADI123456';

config.rtoVehicle = {};
config.rtoVehicle.protocol  = 'https';
config.rtoVehicle.host      = 'rtovehicle.info';
config.rtoVehicle.authToken = 'Y29tLmRlbHVzaW9uYWwudmVoaWNsZWluZm8=';

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