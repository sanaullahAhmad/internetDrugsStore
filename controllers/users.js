'use strict';
const validator = require('../functions/validator.js');
const utility = require('../functions/utility.js');
const randomstring = require("randomstring");
const bcrypt = require('bcryptjs');
const Config = require('../config/config');
const config = new Config();

/** Models and Services Includes **/
const User = require('../models/user');
const EmailService = require('../services/email');

/**
 * users.js controller
 *
 * @description: A set of functions called "actions" for managing `Users`.
 */

module.exports = {

    /***
     * @purpose: Vendor Registration API
     * @param req
     * @param callback
     * @returns {Promise.<*>}
     */
    sendForgotPasswordEmail: async (req, callback) => {
        try {
            //Perform fields validation
            req.check(validator.validateForgotPassword);
            let errors = req.validationErrors(); // Get all validation errors
            if (errors) {
                return callback(true, utility.get_fields_validation_errors_object(errors));
            } else {
                //Normal Flow
                let verification_code = randomstring.generate(4);
                let existing_user = await User.findOneAndUpdate({user_email: req.body.user_email}, {
                    $set: {
                        verification_code: verification_code
                    }
                });
                if (existing_user !== null) {
                    //Means User Exist and record updated
                    //Send User Forgot Password Email
                    EmailService.sendForgotPasswordRequest({
                        email: req.body.user_email,
                        verification_code: verification_code,
                        vendor_name: (typeof existing_user.vendor_details !== 'undefined' && typeof existing_user.vendor_details.pharmacy_name !== 'undefined') ? existing_user.vendor_details.pharmacy_name : 'Dear',
                    });
                    return callback(null, {
                        code: 200,
                        success: true,
                        data: {
                            'user_email': req.body.user_email,
                            'user_id': existing_user._id,
                            'reset_code': verification_code
                        },
                        message: "We've sent you an email with password reset code, please check.",
                    });
                } else {
                    return callback(true, utility.process_failed_response("User with this email doesn't exist."));
                }
            }
        } catch (error) {
            utility.log_it("[" + utility.get_t_now() + "][User sendForgotPasswordEmail] Error '" + error);
            return callback(true, utility.internal_error_response(error));
        }
    },


    /****
     * @purpose: User Authentication
     * @param req
     * @param callback
     * @returns {Promise.<*>}
     */
    authenticateUser: async (req, callback) => {
        try {
            //Perform fields validation
            req.check(validator.validateLogin);
            let errors = req.validationErrors(); // Get all validation errors
            if (errors) {
                return callback(true, utility.get_fields_validation_errors_object(errors));
            } else {
                //Normal Flow
                let user_obj = await User.findOne({user_email: req.body.user_email});
                if (user_obj !== null) {
                    // check if password matches
                    bcrypt.compare(req.body.user_password, user_obj.user_password, function (err, result) {
                        if (err) {
                            return callback(true, utility.internal_error_response(err));
                        }
                        else if (!result) {
                            return callback(null, utility.process_failed_response("You have entered an incorrect password."));
                        }
                        else {
                            let jwt_token = User.generateJwtToken(user_obj);
                            // return the information including token as JSON
                            return callback(null,
                                utility.success_response({
                                    user_id: user_obj._id,
                                    is_activated: user_obj.is_active,
                                    user_type: user_obj.user_type,
                                    user_email: user_obj.user_email,
                                    vendor_name: (typeof user_obj.vendor_details !== 'undefined' && typeof user_obj.vendor_details.pharmacy_name !== 'undefined') ? user_obj.vendor_details.pharmacy_name : '',
                                    contact_number: user_obj.contact_number,
                                    profile_picture: typeof user_obj.profile_picture !== 'undefined' ? user_obj.profile_picture : '',
                                    profile_picture_50x50: typeof user_obj.profile_picture_50x50 !== 'undefined' ? user_obj.profile_picture_50x50 : '',
                                    token: jwt_token,
                                    location: typeof user_obj.vendor_details.pharmacy_location !== 'undefined' ? user_obj.vendor_details.pharmacy_location : [73.056761, 33.661712],
                                    address: (typeof user_obj.vendor_details !== 'undefined' && typeof user_obj.vendor_details.address !== 'undefined') ? user_obj.vendor_details.address : ''
                                }, 'Authenticated Successfully.'));
                        }
                    });
                } else {
                    return callback(true, utility.process_failed_response("No account is linked to this email. Please try another email ID."));
                }
            }
        } catch (error) {
            utility.log_it("[" + utility.get_t_now() + "][User authenticateUser] Error '" + error);
            return callback(true, utility.internal_error_response(error));
        }
    },

    /****
     * @purpose: Guest User Authentication
     * @param req
     * @param callback
     * @returns {Promise.<*>}
     */
    guestUserAuth: async (req, callback) => {
        try {
            //Perform fields validation
            req.check(validator.validateGuestLogin);
            let errors = req.validationErrors(); // Get all validation errors
            if (errors) {
                return callback(true, utility.get_fields_validation_errors_object(errors));
            } else {
                let user_obj = await User.findOne({user_type: "guest", 'guest_details.device_id': req.body.device_id});
                if (user_obj !== null) {
                    let jwt_token = User.generateJwtToken(user_obj);
                    // return the information including token as JSON
                    return callback(null,
                        utility.success_response({
                            user_id: user_obj._id,
                            user_type: user_obj.user_type,
                            device_id: (typeof user_obj.guest_details !== 'undefined' && typeof user_obj.guest_details.device_id !== 'undefined') ? user_obj.guest_details.device_id : '',
                            token: jwt_token
                        }, 'Authenticated Successfully.'));

                } else {
                    let guest_user = new User();
                    guest_user.user_type = "guest";
                    guest_user.guest_details.device_id = req.body.device_id;
                    let saved_guest = await guest_user.save();
                    //
                    return callback(null,
                        utility.success_response({
                            user_id: saved_guest._id,
                            user_type: saved_guest.user_type,
                            device_id: (typeof saved_guest.guest_details !== 'undefined' && typeof saved_guest.guest_details.device_id !== 'undefined') ? saved_guest.guest_details.device_id : '',
                            token: User.generateJwtToken(saved_guest)
                        }, "Device ID saved and Authenticated Successfully"));
                }
            }

        } catch (error) {
            utility.log_it("[" + utility.get_t_now() + "][Guest User authenticate] Error '" + error);
            return callback(true, utility.internal_error_response(error));
        }
    },


    /***
     * @purpose: To Reset Password
     * @param req
     * @param callback
     * @returns {Promise.<*>}
     */
    resetPassword: async (req, callback) => {
        try {
            //Perform fields validation
            req.check(validator.validateResetPassword);
            req.checkBody('confirm_password', 'Passwords do not match.').equals(req.body.new_password);
            let errors = req.validationErrors(); // Get all validation errors
            if (errors) {
                return callback(true, utility.get_fields_validation_errors_object(errors));
            } else {
                //Normal Flow
                let user_obj = await User.findOneAndUpdate({
                    user_email: req.body.user_email,
                    verification_code: req.body.verification_code
                }, {$set: {user_password: utility.hash_password(req.body.new_password)}}, {'new': true});
                //Check if User Password Updated Successfully
                if (user_obj)
                    return callback(null, utility.success_response({}, "Password been successfully changed."));
                else
                    return callback(true, utility.process_failed_response("User not found with the given email, or incorrect activation code used."));
            }
        } catch (error) {
            utility.log_it("[" + utility.get_t_now() + "][User resetPassword] Error '" + error);
            return callback(true, utility.internal_error_response(error));
        }
    },

    /***
     * @purpose: To change password
     * @param req
     * @param callback
     * @returns {Promise.<*>}
     */
    changePassword: async (req, callback) => {
        try {
            //Perform fields validation
            req.check(validator.validateChangePassword);
            req.checkBody('confirm_password', 'Passwords do not match.').equals(req.body.new_password);
            let errors = req.validationErrors(); // Get all validation errors
            if (errors) {
                return callback(true, utility.get_fields_validation_errors_object(errors));
            } else {
                //Normal Flow, Find user by id
                let user = await User.findById(req.decoded_jwt.id);
                if (user !== null) {
                    let match_current_password = await bcrypt.compare(req.body.current_password, user.user_password);
                    if (!match_current_password) {
                        return callback(true, utility.process_failed_response("Current password is incorrect."));
                    } else {
                        console.log("Password Matched");
                        let match_new_password_with_current = await bcrypt.compare(req.body.new_password, user.user_password);
                        if (!match_new_password_with_current) {
                            //it means new password is different than the old password
                            //Password matched, now update the new password
                            let updateUser = await User.findByIdAndUpdate(req.decoded_jwt.id, {$set: {user_password: utility.hash_password(req.body.new_password)}}, {'new': true});
                            if (updateUser !== null)
                                return callback(null, utility.success_response({}, 'Password has been successfully changed.'));
                            else
                            //password not updated
                                return callback(true, utility.process_failed_response("Sorry, unable to change your password."));

                        } else {
                            //new password is same as old password
                            return callback(true, utility.process_failed_response("It seems like the new password is same as the old one."));
                        }
                    }
                }
            }
        } catch (error) {
            utility.log_it("[" + utility.get_t_now() + "][User changePassword] Error '" + error);
            return callback(true, utility.internal_error_response(error));
        }
    }
};