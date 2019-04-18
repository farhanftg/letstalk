var router  = express.Router();

// Require controller modules
var leadController     = require('../app/common/controllers/leadController');

router.get('/lead/import-lead-from-old-lead', function (req, res) {	
    leadController.importLeadFromOldLead(req, res);
});


module.exports = router;