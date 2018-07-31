'use strict';

const utility = require('../functions/utility.js');
const validator = require('../functions/validator.js');
const Config = require('../config/config');
const config = new Config();

/** Models and Services Includes **/
const User = require('../models/user');
const VendorMedicine = require('../models/vendor_medicine');
const GuestCart = require('../models/guest_cart');
const CartItems = require('../models/cart_items');
const ObjectId = require('mongoose').Types.ObjectId;

/**
 * users.js controller
 *
 * @description: A set of functions called "actions" for managing `Guest Cart`.
 */

module.exports = {

    /***
     * @purpose: Add item to cart controller method
     * @param req
     * @param callback
     * @returns {Promise.<*>}
     */
    addItemToCart: async (req, callback) => {
        try {
            //Perform fields validation
            req.check(validator.validateAddItemToCart);
            let errors = req.validationErrors(); // Get all validation errors
            // Assign errors to template
            if (errors) {
                return callback(true, utility.get_fields_validation_errors_object(errors));
            } else {
                //Normal Flow
                let vendor_medicine = await VendorMedicine.findById(req.body.vendor_medicine_id);
                if (vendor_medicine !== null) {
                    //Medicines Info Found, Let's push this item in to the cart
                    let cart_info = await GuestCart.findOneOrCreate({guest_id: req.decoded_jwt.id}, {guest_id: req.decoded_jwt.id});
                    if (cart_info !== null) {
                        let cart_item = await CartItems.update({
                            cart_id: cart_info._id,
                            "item._id": new ObjectId(req.body.vendor_medicine_id)
                        }, {
                            $set: {
                                item: vendor_medicine,
                                quantity: req.body.quantity,
                                cart_id: cart_info._id
                            }
                        }, {'upsert': true});
                        if (cart_item !== null)
                            return callback(null, (utility.success_response({}, 'Item added to the cart successfully')));
                        else
                            return callback(true, utility.process_failed_response("Sorry, unable to add item to the cart."));
                    } else
                        return callback(true, utility.process_failed_response("Sorry, unable to find cart information."));

                } else {
                    return callback(true, utility.process_failed_response("Sorry, unable to find vendor medicine details."));
                }
            }
        } catch (error) {
            utility.log_it("[" + utility.get_t_now() + "][guest_cart controller addItemToCart] Error '" + error);
            return callback(true, utility.internal_error_response(error));
        }
    },


    /***
     * @purpose: Remove Item from cart
     * @param req
     * @param callback
     * @returns {Promise.<*>}
     */
    removeItemFromCart: async (req, callback) => {
        try {
            //Perform fields validation
            req.check(validator.validateRemoveItemCart);
            let errors = req.validationErrors(); // Get all validation errors
            // Assign errors to template
            if (errors) {
                return callback(true, utility.get_fields_validation_errors_object(errors));
            } else {
                let cart_info = await GuestCart.findOne({guest_id: req.decoded_jwt.id});
                if (cart_info !== null) {
                    let cart_item = await CartItems.remove({
                        cart_id: cart_info._id,
                        "item._id": new ObjectId(req.params.id)
                    });
                    if (cart_item.n !== 0)
                        return callback(null, (utility.success_response({}, 'Item removed from the cart successfully.')));
                    else
                        return callback(true, utility.process_failed_response("Sorry, unable to remove item from the cart."));
                } else
                    return callback(true, utility.process_failed_response("Sorry, unable to find cart information."));
            }
        } catch (error) {
            utility.log_it("[" + utility.get_t_now() + "][guest_cart controller removeItemFromCart] Error '" + error);
            return callback(true, utility.internal_error_response(error));
        }
    },


    /***
     * @purpose: Remove Items from cart
     * @param req
     * @param callback
     * @returns {Promise.<*>}
     */
    removeItemsFromCart: async (req, callback) => {
        try {
            //Perform fields validation
            req.checkBody('item_ids', 'Items array cannot be empty or invalid ids passed.').notEmpty();
            let errors = req.validationErrors(); // Get all validation errors
            // Assign errors to template
            if (errors) {
                return callback(true, utility.get_fields_validation_errors_object(errors));
            } else {
                let cart_info = await GuestCart.findOne({guest_id: req.decoded_jwt.id});
                if (cart_info !== null) {
                    console.log("RECEIVED ITEM IDS ARE FOLLOWING  " + req.body.item_ids);
                    let match = (Array.isArray(req.body.item_ids)) ? {
                        cart_id: cart_info._id,
                        "item._id": {$in: req.body.item_ids.map(ObjectId)}
                    } : {
                        cart_id: cart_info._id,
                        "item._id": new ObjectId(req.body.item_ids)
                    };
                    console.log("Match is this "+JSON.stringify(match));
                    let cart_item = await CartItems.remove(match);
                    console.log("RESULT  " + cart_item);
                    if (cart_item.n !== 0)
                        return callback(null, (utility.success_response({}, 'Item removed from the cart successfully.')));
                    else
                        return callback(true, utility.process_failed_response("Sorry, unable to remove item from the cart."));
                } else
                    return callback(true, utility.process_failed_response("Sorry, unable to find cart information."));
            }
        } catch (error) {
            utility.log_it("[" + utility.get_t_now() + "][guest_cart controller removeItemsFromCart] Error '" + error);
            return callback(true, utility.internal_error_response(error));
        }
    },


    /***
     * @purpose: RemoveCart Controller Method
     * @param req
     * @param callback
     * @returns {Promise.<*>}
     */
    removeCart: async (req, callback) => {
        try {
            let cart_info = await GuestCart.findOne({guest_id: req.decoded_jwt.id});
            if (cart_info !== null) {
                let cart_item = await CartItems.remove({
                    cart_id: cart_info._id
                });
                if (cart_item.n !== 0)
                    return callback(null, (utility.success_response({}, 'Item removed from the cart successfully.')));
                else
                    return callback(true, utility.process_failed_response("Sorry, unable to remove item from the cart."));
            } else
                return callback(true, utility.process_failed_response("Sorry, unable to find cart information."));

        } catch (error) {
            utility.log_it("[" + utility.get_t_now() + "][guest_cart controller removeItemFromCart] Error '" + error);
            return callback(true, utility.internal_error_response(error));
        }
    },


    /****
     * @purpose: Update item quantity in cart controller method
     * @param req
     * @param callback
     * @returns {Promise.<*>}
     */
    updateItemQuantityInCart: async (req, callback) => {
        try {
            //Perform fields validation
            req.check(validator.validateUpdateItemCart);
            let errors = req.validationErrors(); // Get all validation errors
            // Assign errors to template
            if (errors) {
                return callback(true, utility.get_fields_validation_errors_object(errors));
            } else {
                let cart_info = await GuestCart.findOne({guest_id: req.decoded_jwt.id});
                if (cart_info !== null) {
                    let cart_item = await CartItems.update({
                        cart_id: cart_info._id,
                        "item._id": new ObjectId(req.params.id)
                    }, {$set: {quantity: req.body.quantity}});
                    if (cart_item.n !== 0)
                        return callback(null, (utility.success_response({}, 'Item quantity updated successfully.')));
                    else
                        return callback(true, utility.process_failed_response("Sorry, unable to update item quantity."));
                } else
                    return callback(true, utility.process_failed_response("Sorry, unable to find cart information."));
            }
        } catch (error) {
            utility.log_it("[" + utility.get_t_now() + "][guest_cart controller updateItemQuantityInCart] Error '" + error);
            return callback(true, utility.internal_error_response(error));
        }
    },

    /***
     * @purpose: Get Cart items api.
     * @param req
     * @param callback
     * @returns {Promise.<*>}
     */
    getCart: async (req, callback) => {
        try {
            let cart_info = await GuestCart.findOne({guest_id: req.decoded_jwt.id}, {_id: 1});
            if (cart_info !== null) {
                let cart_items = await CartItems.aggregate([
                    {$match: {cart_id: String(cart_info._id)}},
                    {
                        $group: {_id: "$item.vendor_id", medicines: {$push: "$$ROOT"}}
                    }]);
                if (cart_items !== null && cart_items.length > 0) {
                    const populateData = async (cart_items) => {
                        let result = [];
                        for (let item of cart_items) {
                            //Get Vendor Information
                            let vendor_details = await User.findById(item._id, {
                                vendor_details: 1,
                                contact_number: 1
                            });
                            if (vendor_details !== null)
                                result.push({
                                    vendor_id: item._id,
                                    vendor_name: typeof vendor_details.vendor_details.pharmacy_name !== 'undefined' ? vendor_details.vendor_details.pharmacy_name : '',
                                    vendor_phone_no: typeof vendor_details.contact_number !== 'undefined' ? vendor_details.contact_number : '',
                                    vendor_location: typeof vendor_details.vendor_details.pharmacy_location !== 'undefined' ? vendor_details.vendor_details.pharmacy_location : [73.056761, 33.661712],
                                    products: item.medicines
                                })
                                ;
                        }
                        return result;
                    };
                    let cart_data = await populateData(cart_items);
                    return callback(null, (utility.success_response({cart_data: cart_data}, 'Loaded cart items successfully.')));
                }
                else
                    return callback(true, utility.process_failed_response("No items found in the cart."));
            } else
                return callback(true, utility.process_failed_response("Sorry, unable to find cart information."));

        } catch (error) {
            utility.log_it("[" + utility.get_t_now() + "][guest_cart controller addItemToCart] Error '" + error);
            return callback(true, utility.internal_error_response(error));
        }
    },


};
