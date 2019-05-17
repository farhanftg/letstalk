var router  = express.Router();

var consoleController = require('../app/console/controllers/consoleController');

router.get('/auto-map-registration-text', function(req, res){
    consoleController.autoMapRegistrationText(req, res);
});

router.get('/get-registration-from-registration-request', function(req, res){
    consoleController.getRegistrationFromRegistrationRequest(req, res);
});

module.exports = router;