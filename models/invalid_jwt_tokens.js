'use strict';
const mongoose = require('mongoose');

const invalidJwtSchema = mongoose.Schema({
    token: String,
    created_at: {type: Date, default: Date.now()}
});

// Compile model from schema
var InvalidJwt = mongoose.model('InvalidJwtTokens', invalidJwtSchema);
// module.exports = MobileCode;

var exports = module.exports = InvalidJwt;


// save invalid jwt token
exports.saveToken = function (jwt_token) {
    let invalid_token = new InvalidJwt();
    invalid_token.token = jwt_token;
    invalid_token.save();
};