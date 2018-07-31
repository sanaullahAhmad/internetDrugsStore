const express = require('express');
const router = express.Router();
//const utility = require('../functions/utility.js');
const authenticate_user = require('../functions/authenticate_user');


/** Models, Controllers and Services Includes **/
//const User = require('../models/user');
//const GuestCart = require('../models/guest_cart');
const GuestCartController = require('../controllers/guest_cart');


/***
 * @Purpose: Add item to cart API Post Request Handler
 */
router.post('/', authenticate_user(), async (req, res, next) => {
    console.log("Quantity is this " + req.body.quantity);
    GuestCartController.addItemToCart(req, function (err, response) {
        return res.json(response);
    });
});


/***
 * @purpose: Remove Item from cart
 */
router.delete('/item/:id', authenticate_user(), async (req, res, next) => {
    GuestCartController.removeItemFromCart(req, function (err, response) {
        return res.json(response);
    });
});


/***
 * @purpose: Remove Items from cart
 */
router.post('/items/', authenticate_user(), async (req, res, next) => {
    GuestCartController.removeItemsFromCart(req, function (err, response) {
        return res.json(response);
    });
});


/***
 * @purpose: Remove Guest Cart API Route
 */
router.delete('/', authenticate_user(), async (req, res, next) => {
    GuestCartController.removeCart(req, function (err, response) {
        return res.json(response);
    });
});


/***
 * @purpose: Get Cart API Route
 */
router.get('/', authenticate_user(), async (req, res, next) => {
    GuestCartController.getCart(req, function (err, response) {
        return res.json(response);
    });
});

/***
 * Update Cart Item Quantity
 */
router.put('/item/:id', authenticate_user(), async (req, res, next) => {
    GuestCartController.updateItemQuantityInCart(req, function (err, response) {
        return res.json(response);
    });
});


module.exports = router;
