'use strict';
const mongoose = require('mongoose');


const cartSchema = mongoose.Schema({
    guest_id: String,
    vendor_medicines: [],
    created_at: {type: Date, default: Date.now},
});


// Compile model from schema
var Cart = mongoose.model('Guest_Cart', cartSchema);
var exports = module.exports = Cart;


exports.findOneOrCreate = async function findOneOrCreate(condition, doc) {
    const one = await this.findOne(condition);
    return one || this.create(doc);
};


