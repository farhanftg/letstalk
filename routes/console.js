var router  = express.Router();

var consoleController = require('../app/console/consoleController');


router.get('/get-registration-rto-vehicle-by-registration-request', function(req, res){
    consoleController.cronGetRegistrationFromRtoVehicleByRegistrationRequest(req, res);
});

module.exports = router;