'use strict';
const mongoose = require('mongoose');

const reservationSchema = mongoose.Schema({
    guest_id: String,
    guest_details: {
        name: String,
        contact_number: String
    },
    products_details: [{product: {}, qty: Number ,is_picked:{type: Boolean,
        default: "false"}}],
    status: {
        type: String,
        default: "pending",
        enum: ["pending", "picked", "expired", "accepted", "rejected"]
    },
    vendor_id: String,
    acceptance_time: {type: Date, default: Date.now},
    created_at: {type: Date, default: Date.now}
});


// Compile model from schema
var Reservation = mongoose.model('Reservation', reservationSchema);
var exports = module.exports = Reservation;


// exports.findOneOrCreate = async function findOneOrCreate(condition, doc) {
//     const one = await this.findOne(condition);
//     return one || this.create(doc);
// };
