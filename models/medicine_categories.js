'use strict';
const mongoose = require('mongoose');

const MedicineCategoriesSchema = mongoose.Schema({
        category_name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        url: {
            type: String,
        },
        is_active: {
            type: Boolean,
            default:
                true
        },
        date_registered:
            {
                type: Date,
                default:
                Date.now
            },device_token: String,
    })
;
// Compile model from schema

var medicineCategories = mongoose.model('medicine_categories', MedicineCategoriesSchema);
var exports = module.exports = medicineCategories;