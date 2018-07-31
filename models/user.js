'use strict';
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
        user_email: {
            type: String,
            lowercase: true,
            trim: true,
            /*unique: true,
            required: true*/
        },
        name: String,
        user_password: {
            type: String,
            /*required: true*/
        },
        vendor_details: {
            pharmacy_name: String,
            docs: [],
            pharmacy_location: {type: [Number], index: '2d'}, // [<longitude>, <latitude>]
            address: {type: String, default: ""}
        },
        guest_details: {
            device_id: String,
        },
        mobile_code: Number,
        contact_number: String,
        is_logged_in: {type: Boolean, default: false},
        is_mobile_verified: {type: Boolean, default: false},
        is_email_verified: {type: Boolean, default: false},
        user_type: {
            type: String,
            default: "guest",
            enum: ["guest", "vendor", "admin"]
        },
        jwt_token: String,
        email_verification_code: String,
        verification_code: String,
        is_code_used: {type: Boolean, default: false},
        profile_picture: String,
        profile_picture_50x50: String,

        date_registered:
            {
                type: Date,
                default:
                Date.now
            }
        ,
        is_active: {
            type: Boolean,
            default:
                false
        }, device_token: String,
    })
;

// Compile model from schema

userSchema.index({"vendor_details.pharmacy_location": "2dsphere"});

var User = mongoose.model('User', userSchema);
var exports = module.exports = User;
const jwt = require('jsonwebtoken');
const Config = require('../config/config');
const config = new Config();

exports.generateJwtToken = function (user_obj) {
    return jwt.sign({
        id: user_obj._id,
        email: user_obj.user_email,
        user_type: user_obj.user_type,
    }, config.secret, {
        expiresIn: config.token_expiry_time
    });
};




