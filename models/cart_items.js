'use strict';
const mongoose = require('mongoose');

const cartItemsSchema = mongoose.Schema({
    cart_id: String,
    item: {},
    quantity: Number,
    created_at: {type: Date, default: Date.now},
});

// Compile model from schema
var CartItem = mongoose.model('Cart_Items', cartItemsSchema);
var exports = module.exports = CartItem;

