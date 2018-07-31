const express = require('express');
const router = express.Router();
const utility = require('../functions/utility.js');


/** Models, Controllers and Services Includes **/
const VendorMedicine = require('../models/vendor_medicine');
const vendorMedicineController = require('../controllers/vendors_medicines');
const authenticate_user = require('../functions/authenticate_user');

/* GET vendor medicine listing. */
router.get('/', authenticate_user(), function (req, res, next) {
    res.send('respond with a resource');
});



/* POST vendor medicine listing. */
router.post('/', authenticate_user(), function (req, res, next) {
    res.send('respond with a resource');
});



/***
 * @Purpose: Vendor Medicine Registration API
 */
router.post('/add', authenticate_user("vendor"), async (req, res, next) => {
    vendorMedicineController.addVendorMedicine(req, function (err, response) {
        return res.json(response);
    });
});

/***
 * @Purpose: Get Single Vendor Medicine API
 */
router.get('/get-vendor-medicine/:medicine_id'/*, authenticate_user*/, async (req, res, next) => {
    vendorMedicineController.getVendorSingleMedicine(req, function (err, response) {
        return res.json(response);
    });
});

/***
 * @Purpose: Get specific Category Medicines API
 */
router.get('/get-category-medicines/:category'/*, authenticate_user*/, async (req, res, next) => {
    vendorMedicineController.getMedicinesByCategory(req, function (err, response) {
        return res.json(response);
    });
});

/***
 * @Purpose: Vendor Medicine Categories API
 */
router.get('/get-medicine-categories', async (req, res, next) => {
    vendorMedicineController.getMedicineCategories(req, function (err, response) {
        return res.json(response);
    });
});


/***
 * @Purpose: Get specific Category Medicines API
 */
router.put('/:id', authenticate_user("vendor"), async (req, res, next) => {
    vendorMedicineController.updateMedicine(req, function (err, response) {
        return res.json(response);
    });
});


module.exports = router;