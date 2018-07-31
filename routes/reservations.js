const express = require('express');
const router = express.Router();
//const utility = require('../functions/utility.js');
const authenticate_user = require('../functions/authenticate_user');


/** Models, Controllers and Services Includes **/
//const User = require('../models/user');
//const GuestCart = require('../models/guest_cart');
//const GuestCartController = require('../controllers/guest_cart');
const ReservationController = require('../controllers/reservations');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});


/***
 * @Purpose: Add item to cart API Post Request Handler
 */
router.post('/quick', authenticate_user(), async (req, res, next) => {
    ReservationController.quickReserve(req, function (err, response) {
        return res.json(response);
    });
});

/***
 * @Purpose: Reserve cart API Post Request Handler
 */
router.post('/reserve', authenticate_user(), async (req, res, next) => {
    ReservationController.reserve(req, function (err, response) {
        return res.json(response);
    });
});


/***
 * @purpose: Reservation Action
 */
router.post('/action', authenticate_user("vendor"), async (req, res, next) => {
    ReservationController.reservationAction(req, function (err, response) {
        return res.json(response);
    });
});


/***
 * @Purpose: view Guest Reservations Request Handler
 */
router.get('/guest-reservations', authenticate_user("guest"), async (req, res, next) => {
    ReservationController.viewGuestReservations(req, function (err, response) {
        return res.json(response);
    });
});
/***
 * @Purpose: view Vendor Reservations Request Handler
 */
router.get('/vendor-reservations', authenticate_user("vendor"), async (req, res, next) => {
    ReservationController.viewVendorReservations(req, function (err, response) {
        return res.json(response);
    });
});
/***
 * @Purpose: view Vendor Reservations Request Handler
 */
router.post('/mark-pick/:id/', authenticate_user("vendor"), async (req, res, next) => {
    ReservationController.markPick(req, function (err, response) {
        return res.json(response);
    });
});


module.exports = router;
