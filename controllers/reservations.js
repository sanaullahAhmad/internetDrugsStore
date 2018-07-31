'use strict';

const utility = require('../functions/utility.js');
const validator = require('../functions/validator.js');
const Config = require('../config/config');
const config = new Config();

/** Models and Services Includes **/
const User = require('../models/user');
const VendorMedicine = require('../models/vendor_medicine');
const GuestCart = require('../models/guest_cart');
const Reservation = require('../models/reservation');
const CartItems = require('../models/cart_items');
const async = require('async');
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
    quickReserve: async (req, callback) => {
        try {
            //Perform fields validation
            req.check(validator.validateQuickReserve);
            let errors = req.validationErrors(); // Get all validation errors
            // Assign errors to template
            if (errors) {
                return callback(true, utility.get_fields_validation_errors_object(errors));
            } else {
                //Normal Flow
                let vendor_medicine = await VendorMedicine.findById(req.body.vendor_medicine_id);
                if (vendor_medicine !== null) {
                    if (vendor_medicine.in_stock) {
                        //Medicines Info Found, Let's push this item in to the cart
                        let reservation = new Reservation();
                        reservation.guest_id = req.decoded_jwt.id;
                        reservation.products_details = [{product: vendor_medicine, qty: req.body.quantity}];
                        reservation.quantity = req.body.quantity;
                        reservation.vendor_id = vendor_medicine.vendor_id;
                        reservation.guest_details = {name: req.body.name, contact_number: req.body.contact_number};
                        let saved_reservation = await reservation.save();
                        console.log("SAVED RESERVATION " + saved_reservation);
                        if (saved_reservation !== null) {

                            //Update User Guest Name and Contact Number
                            User.findByIdAndUpdate(req.decoded_jwt.id, {
                                $set: {
                                    name: req.body.name,
                                    contact_number: req.body.contact_number
                                }
                            });
                            return callback(null, (utility.success_response({reservation_id: saved_reservation._id}, 'Your reservation request has been received successfully.')));
                        } else
                            return callback(true, utility.process_failed_response("Sorry, unable to reserve product."));
                    } else
                        return callback(true, utility.process_failed_response("Sorry, medicine is out of stock."));
                } else {
                    return callback(true, utility.process_failed_response("Sorry, unable to find vendor medicine details."));
                }
            }
        } catch (error) {
            utility.log_it("[" + utility.get_t_now() + "][guest_cart controller quickReserve] Error '" + error);
            return callback(true, utility.internal_error_response(error));
        }
    },


    /***
     * @purpose: Add item to cart controller method
     * @param req
     * @param callback
     * @returns {Promise.<*>}
     */
    reserve: async (req, callback) => {
        try {
            //Perform fields validation
            req.check(validator.validateReserve);
            let errors = req.validationErrors(); // Get all validation errors
            // Assign errors to template
            if (errors) {
                return callback(true, utility.get_fields_validation_errors_object(errors));
            } else {
                //Normal Flow
                VendorMedicine.find({'_id': {$in: req.body.vendor_medicine_id}}).distinct('vendor_id', async function (error, vendor_ids) {
                    // vendor_ids is an array of all ObjectIds
                    if (typeof vendor_ids !== "undefined") {
                        var ctr = 0;
                        vendor_ids.forEach(async function (vid, index_fe, array) {
                            var should_save = false;// set inatialy it to false, if medicine reserved against him is in stock than make it true.
                            var call_back_value = true;
                            var utility_message = utility.success_response("Let's start.");
                            let reservation = new Reservation();
                            reservation.guest_id = req.decoded_jwt.id;
                            reservation.vendor_id = vid;
                            reservation.guest_details = {
                                name: req.body.name,
                                contact_number: req.body.contact_number
                            };
                            //
                            var index = 0;
                            for (var medicine_id of req.body.vendor_medicine_id)//loop through every record
                            {
                                let vendor_medicine = await VendorMedicine.findOne({
                                    _id: medicine_id,//req.body["vendor_medicine_id[]"][index],//so that id always change every time
                                    vendor_id: vid//only those medicine should be saved whose vendor in current vendor of outer foreach loop.
                                });
                                //console.log(vid);
                                if (vendor_medicine !== null) {
                                    if (typeof vendor_medicine.in_stock !== "undefined" && vendor_medicine.in_stock) {
                                        //Medicines Info Found, Let's push this item in to the cart
                                        should_save = true;// it meens at least one medicine belonging to this vendor is in stock, so save reservation against him.
                                        reservation.products_details.push({
                                            product: vendor_medicine,
                                            qty: req.body.quantity[index]
                                        });
                                        //console.log(vendor_medicine.medicine_name);
                                    }
                                    else {
                                        /*reservation.products_details.push({
                                            product: "Sorry, medicine " + vendor_medicine.medicine_name + " is out of stock.",
                                            qty: 0
                                        });*/
                                        call_back_value = true;
                                        utility_message = utility.process_failed_response("Sorry, medicine '" + vendor_medicine.medicine_name + "' is out of stock.");
                                    }
                                }
                                else {
                                    call_back_value = true;
                                    utility_message = utility.process_failed_response("Sorry, unable to find vendor medicine details.");
                                    //return callback(true, utility.process_failed_response("Sorry, unable to find vendor medicine details."));
                                }
                                index++;
                            }// inner for loop
                            //
                            if (should_save) {
                                let saved_reservation = await reservation.save();
                                //console.log("SAVED RESERVATION " + saved_reservation);
                                if (saved_reservation !== null) {
                                    //Update User Guest Name and Contact Number
                                    User.findByIdAndUpdate(req.decoded_jwt.id, {
                                        $set: {
                                            name: req.body.name,
                                            contact_number: req.body.contact_number
                                        }
                                    });
                                    call_back_value = null;
                                    utility_message = utility.success_response("Your reservation request has been received successfully.");
                                    //return callback(null, (utility.success_response({}, 'Your reservation request has been received successfully.')));
                                } else {
                                    call_back_value = true;
                                    utility_message = utility.process_failed_response("Sorry, unable to reserve product.");
                                    //return callback(true, utility.process_failed_response("Sorry, unable to reserve product."));
                                }
                            }

                            ctr++;
                            if (ctr === array.length) {
                                return callback(call_back_value, utility_message);
                            }
                        });//outer foreach loop
                    }
                    else {
                        return callback(true, utility.process_failed_response("No records found of these medicines"));
                    }
                });
            }
        } catch (error) {
            utility.log_it("[" + utility.get_t_now() + "][Reservation controller BulkReserve] Error '" + error);
            return callback(true, utility.internal_error_response(error));
        }
    },

    /***
     * @purpose: Get Guest Reservations API
     * @param req
     * @param callback
     * @returns {Promise.<*>}
     */
    viewGuestReservations: async (req, callback) => {
        try {
            let condition = {'guest_id': req.decoded_jwt.id};
            if (typeof req.query.sort_by !== "undefined" && req.query.sort_by == "pending")
                condition = {'guest_id': req.decoded_jwt.id, status: "pending"};
            else if (typeof req.query.sort_by !== "undefined" && req.query.sort_by == "rejected")
                condition = {'guest_id': req.decoded_jwt.id, status: "rejected"};
            else if (typeof req.query.sort_by !== "undefined" && req.query.sort_by == "accepted")
                condition = {'guest_id': req.decoded_jwt.id, status: "accepted"};

            let guest_reservations = await Reservation.find(condition).sort({created_at: -1});


            // let guest_reservations = await Reservation.aggregate([
            //     {$match: {'guest_id': req.decoded_jwt.id}},
            //     { "$project": {
            //         "status": 1,
            //         "weight": {
            //             "$cond": [
            //                 { "$eq": [ "$status", req.query.sort_by ] },
            //                 10,
            //                 { "$cond": [
            //                     { "$eq": [ "$status", "pending" ] },
            //                     5,
            //                     0
            //                 ]}
            //             ]
            //         }
            //     }},
            //     { "$sort": { "weight": -1 } }
            //
            //     ]);


            if (guest_reservations !== null && guest_reservations.length > 0) {
                const populateData = async (guest_reservations) => {
                    let result = [];
                    for (let reservation of guest_reservations) {
                        //Get Vendor Information
                        let vendor_details = await User.findById(reservation.vendor_id, {
                            vendor_details: 1,
                            contact_number: 1
                        });
                        if (vendor_details !== null)
                            result.push({
                                vendor_id: reservation.vendor_id,
                                vendor_name: typeof vendor_details.vendor_details.pharmacy_name !== 'undefined' ? vendor_details.vendor_details.pharmacy_name : '',
                                vendor_phone_no: typeof vendor_details.contact_number !== 'undefined' ? vendor_details.contact_number : '',
                                vendor_location: typeof vendor_details.vendor_details.pharmacy_location !== 'undefined' ? vendor_details.vendor_details.pharmacy_location : [73.056761, 33.661712],
                                products: reservation.products_details,
                                status: reservation.status,
                                created_at: reservation.created_at,
                                acceptance_time: reservation.acceptance_time
                            });
                    }
                    return result;
                };
                let reservation_data = await populateData(guest_reservations);
                return callback(null, (utility.success_response({
                    reservations: reservation_data,
                    current_time: new Date()
                }, 'All reservations are listed.')));
            } else {
                return callback(true, utility.process_failed_response("No reservations exists in database."));
            }
        } catch (error) {
            utility.log_it("[" + utility.get_t_now() + "][Get Guest reservations] Error '" + error);
            return callback(true, utility.internal_error_response(error));
        }
    },

    /***
     * @purpose: Get Vendor Reservations API
     * @param req
     * @param callback
     * @returns {Promise.<*>}
     */
    viewVendorReservations: async (req, callback) => {
        try {
            let condition = {'vendor_id': req.decoded_jwt.id};
            if (typeof req.query.sort_by !== "undefined" && req.query.sort_by == "pending")
                condition = {'vendor_id': req.decoded_jwt.id, status: "pending"};
            else if (typeof req.query.sort_by !== "undefined" && req.query.sort_by == "rejected")
                condition = {'vendor_id': req.decoded_jwt.id, status: "rejected"};
            else if (typeof req.query.sort_by !== "undefined" && req.query.sort_by == "accepted")
                condition = {'vendor_id': req.decoded_jwt.id, status: "accepted"};

            let vendor_reservations = await Reservation.find(condition).sort({created_at: -1});

            if (vendor_reservations !== null && vendor_reservations.length > 0) {
                //Means vendor_reservations Exist
                return callback(null, {
                    code: 200,
                    success: true,
                    data: {'reservations': vendor_reservations, current_time: new Date()},
                    message: "All reservations are listed.",
                });
            } else {
                return callback(true, utility.process_failed_response("No reservations exists in database."));
            }
        } catch (error) {
            utility.log_it("[" + utility.get_t_now() + "][Get Guest reservations] Error '" + error);
            return callback(true, utility.internal_error_response(error));
        }
    },


    /****
     * @purpose This method will perform the action on reservation (Mark it is accepted or rejected)

     * @param req
     * @param callback
     * @returns {Promise.<*>}
     */

    reservationAction: async (req, callback) => {
        try {
            //Perform fields validation
            req.check(validator.validateReservationAction);

            let errors = req.validationErrors(); // Get all validation errors
            // Assign errors to template
            if (errors) {
                return callback(true, utility.get_fields_validation_errors_object(errors));
            } else {
                //Normal Flow

                let action = req.body.action == "accept" ? "accepted" : "rejected";
                let updated_reservation = await Reservation.findOneAndUpdate({
                    vendor_id: req.decoded_jwt.id,
                    _id: req.body.reservation_id,
                    status: "pending"
                }, {
                    $set: {
                        status: action,
                        acceptance_time: Date.now()
                    }
                }, {'new': true});
                if (updated_reservation !== null) {
                    //Means vendor_reservations Exist
                    return callback(null, utility.success_response({reservation: updated_reservation}, "Reservation action has been performed successfully."));
                } else {
                    return callback(true, utility.process_failed_response("Action has been already performed or reservation not found."));
                }
            }
        } catch (error) {
            utility.log_it("[" + utility.get_t_now() + "][reservationAction] Error '" + error);
            return callback(true, utility.internal_error_response(error));
        }
    },

    /***
    * @purpose: Mark Products in reservation as Picked API
    * @param req
    * @param callback
    * @returns {Promise.<*>}
    */
    markPick: async (req, callback) => {
        try {
            //Perform fields validation
            req.check(validator.validateMarkPicked);
            let errors = req.validationErrors(); // Get all validation errors
            // Assign errors to template
            if (errors) {
                return callback(true, utility.get_fields_validation_errors_object(errors));
            } else {
                let reservation = await Reservation.findById(req.params.id, (err, reservation) => {
                    if (reservation) {
                        reservation.products_details.forEach((product) => {
                            product.is_picked  = true;
                            //console.log("medicine id = "+product.product._id);
                            if (utility.check_array_element_existence(product.product._id, req.body.product_ids)) {
                                //console.log("forth");
                                product.is_picked  = true;
                            }
                        })
                        let res_save = await reservation.save((err, callback) => {});
                        return callback(null, utility.success_response({
                            reservation_id: req.params.id, 
                            product_ids: req.body.product_ids
                        }, "Reservation is marked picked now."));
                    }
                    else {
                        return callback(true, utility.process_failed_response("Sorry, unable to find vendor medicine details."));
                    }
                });
            }
        
        } catch (error) {
            utility.log_it("[" + utility.get_t_now() + "][guest_cart controller quickReserve] Error '" + error);
            return callback(true, utility.internal_error_response(error));
        }
    },
};
