const express = require('express');
const router = express.Router();
const utility = require('../functions/utility.js');
const authenticate_user = require('../functions/authenticate_user');


/** Models, Controllers and Services Includes **/
const User = require('../models/user');
const VendorController = require('../controllers/vendors');


/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});


/***
 * @Purpose: Vendor Registration API
 */
router.post('/', async (req, res, next) => {
    VendorController.register(req, function (err, response) {
        return res.json(response);
    });
});

/***
 *
 * @Purpose: Update Vendor Profile Route
 *
 */
router.post('/profile', authenticate_user(), async (req, res, next) => {
    VendorController.updateProfile(req, function (err, response) {
        return res.json(response);
    });
});


/***
 * @Purpose: Vendor verify token API
 */
router.post('/verify-token', authenticate_user(), async (req, res, next) => {
    VendorController.verifyToken(req, function (err, response) {
        return res.json(response);
    });
});

module.exports = router;
