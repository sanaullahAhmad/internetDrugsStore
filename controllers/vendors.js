'use strict';

const utility = require('../functions/utility.js');
const randomstring = require("randomstring");
const validator = require('../functions/validator.js');
const Config = require('../config/config');
const config = new Config();

/** Models and Services Includes **/
const User = require('../models/user');
const Media = require('../models/media');
const EmailService = require('../services/email');
const MediaService = require('../services/media');

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
    register: async (req, callback) => {
        try {
            //Perform fields validation
            req.check(validator.validateVendorRegistration);
            let errors = req.validationErrors(); // Get all validation errors
            // Assign errors to template
            if (errors) {
                return callback(true, utility.get_fields_validation_errors_object(errors));
            } else {
                //Normal Flow
                let existing_user = await User.findOne({user_email: req.body.user_email});
                if (existing_user === null) {
                    //Means User Doesn't Exist Already we can create a new one
                    let verification_code = randomstring.generate(6);
                    let vendor = new User();
                    vendor.user_email = req.body.user_email;
                    vendor.contact_number = req.body.contact_number;
                    vendor.user_password = utility.hash_password(req.body.user_password); // hashing password
                    vendor.email_verification_code = verification_code;
                    vendor.user_type = "vendor";

                    //Save Location
                    let long = (typeof req.body.long !== "undefined" && req.body.long !== "") ? parseFloat(req.body.long) : 0.0;
                    let lat = (typeof req.body.lat !== "undefined" && req.body.lat !== "") ? parseFloat(req.body.lat) : 0.0;
                    vendor.vendor_details.pharmacy_location = [long, lat];
                    vendor.vendor_details.address = req.body.address;

                    vendor.vendor_details.pharmacy_name = req.body.pharmacy_name;

                    //Bind Documents with vendor data
                    let media_arr = [];
                    // "docs": ["5ab39ed5670b31795af0ea21","5ab39ed5670b31795af0ea21"]
                    if (typeof req.body.docs !== "undefined" && req.body.docs.length > 0) {
                        let media_info = await Media.find({
                            '_id': {$in: req.body.docs}
                        });
                        console.log("MEDIA INFO IS THIS " + media_info);
                        //Email Attachments Array
                        if (typeof media_info !== "undefined" && media_info.length > 0)
                            media_info.forEach(function (media) {
                                media_arr.push({filename: media.name, contentType: media.mime, path: media.file_url})
                            });
                        vendor.vendor_details.docs = media_arr;
                    }
                    //Remove Docs
                    // "removed_docs": ["5ab39ed5670b31795af0ea21","5ab39ed5670b31795af0ea21"]
                    if (typeof req.body.removed_docs !== "undefined") MediaService.removeFiles(req.body.removed_docs);

                    let saved_vendor = await vendor.save();

                    //Send Vendor SignUp Request to the admin
                    EmailService.sendVendorRegistrationRequest({
                        email: config.admin_email,
                        activation_code: verification_code,
                        vendor_email: req.body.user_email,
                        vendor_contact: req.body.contact_number,
                        vendor_name: req.body.pharmacy_name
                    }, media_arr);

                    EmailService.sendWelcomeEmail({
                        email: req.body.user_email,
                        vendor_name: req.body.pharmacy_name
                    });

                    return callback(null,
                        utility.success_response({
                            user_email: req.body.user_email, user_id: saved_vendor._id,
                            token: User.generateJwtToken(saved_vendor)
                        }, "Your registration request has been received, we'll contact you shortly."));
                } else {
                    return callback(true, utility.process_failed_response("Vendor is already registered with the same email address"));
                }
            }
        } catch (error) {
            utility.log_it("[" + utility.get_t_now() + "][Vendor Registration] Error '" + error);
            return callback(true, utility.internal_error_response(error));
        }
    },

    /***
     * @purpose: Vendor Verify Token API
     * @param req
     * @param callback
     * @returns {Promise.<*>}
     */
    verifyToken: async (req, callback) => {
        try {
            //Perform fields validation
            req.check(validator.validateVendorVerifyToken);
            let errors = req.validationErrors(); // Get all validation errors
            if (errors) {
                return callback(true, utility.get_fields_validation_errors_object(errors));
            } else {
                //Normal Flow
                let verification_code = await User.findOne({
                    _id: req.decoded_jwt.id,
                    email_verification_code: req.body.email_verification_code
                });
                if (verification_code === null) {
                    //Means User with this verification code Doesn't Exist.
                    return callback(true, utility.process_failed_response("Could not verify "));
                } else {
                    let updated_user = await User.update(
                        {
                            email_verification_code: req.body.email_verification_code,
                            _id: req.decoded_jwt.id
                        },
                        {
                            $set: {
                                is_active: true
                            }
                        });

                    return callback(null, {
                        code: 200,
                        success: true,
                        data: {'user_id': req.decoded_jwt.id},
                        message: "Your registration has been verified successfully.",
                    });
                }
            }
        } catch (error) {
            utility.log_it("[" + utility.get_t_now() + "][Vendor Verify Token] Error '" + error);
            return callback(true, utility.internal_error_response(error));
        }
    },


    /***
     * @purpose: Update Vendor Profile
     * @param req
     * @param callback
     * @returns {Promise.<*>}
     */
    updateProfile: async (req, callback) => {
        try {
            //Perform fields validation
            req.check(validator.validateVendorProfileUpdate);
            let errors = req.validationErrors(); // Get all validation errors
            if (errors) {
                return callback(true, utility.get_fields_validation_errors_object(errors));
            } else {
                let updated_user = await User.findByIdAndUpdate(req.decoded_jwt.id,
                    {
                        $set: {
                            'vendor_details.pharmacy_name': req.body.pharmacy_name
                        }
                    });
                if (updated_user === null) {
                    return callback(true, utility.process_failed_response("Sorry, Couldn't update profile info."));
                }
                return callback(null, {
                    code: 200,
                    success: true,
                    data: {pharmacy_name: req.body.pharmacy_name},
                    message: "Your profile has been successfully updated.",
                });

            }
        } catch (error) {
            utility.log_it("[" + utility.get_t_now() + "][Vendor updateProfile] Error '" + error);
            return callback(true, utility.internal_error_response(error));
        }
    }

};
