'use strict';
const mongoose = require('mongoose');

const vendorMedicineSchema = mongoose.Schema({
        medicine_name: {
            type: String,
            required: true
        },
        drug_reg_num: {
            type: String,
            required: true
        },
        vendor_id: {
            type: String,
            required: true
        },
        strength: {},
        strength_unit: {},
        in_stock: {type: Boolean, default: false},
        price: {
            type: String,
            required: true
        },
        volume: {
            type: String,
            required: true
        },
        volume_unit: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        special_offers: {type: String, default: false},

        active_substance_1: {
            type: String,
            /*required: true*/
        },
        active_substance_2: {
            type: String,
            /*required: true*/
        },
        active_substance_3: {
            type: String,
            /*required: true*/
        },
        active_substance_4: {
            type: String,
            /*required: true*/
        },
        mah_name: {
            type: String,
            required: true
        },
        date_registered:
            {
                type: Date,
                default:
                Date.now
            },
        is_active: {
            type: Boolean,
            default:
                true
        }, device_token: String,
    })
;

// Compile model from schema

var vendorMedicine = mongoose.model('Vendor_Medicine', vendorMedicineSchema);
var exports = module.exports = vendorMedicine;