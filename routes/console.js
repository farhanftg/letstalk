var router  = express.Router();

var consoleController = require('../app/console/consoleController');


router.get('/get-registration-from-registration-request', function(req, res){
    consoleController.getRegistrationFromRegistrationRequest(req, res);
});

module.exports = router;