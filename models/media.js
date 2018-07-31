'use strict';
const mongoose = require('mongoose');

const mediaSchema = mongoose.Schema({
    name: String,
    slug: String,
    created_at: {type: Date, default: Date.now},
    created_by: String,
    file_path: String,
    mime: String,
    file_url: String
});

// Compile model from schema
var Media = mongoose.model('Media', mediaSchema);
var exports = module.exports = Media;


// exports.generateJwtToken = function (user_obj) {
//     return jwt.sign({
//         id: user_obj._id,
//         email: user_obj.user_email,
//         user_type: user_obj.user_type,
//     }, config.secret, {
//         expiresIn: config.token_expiry_time
//     });
// };


