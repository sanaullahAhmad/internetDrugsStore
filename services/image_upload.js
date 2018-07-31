const ImageResize = require('node-image-resize');
const fs = require('fs');
const utility = require('../functions/utility.js');
const Config = require('../config/config');
const config = new Config();

exports.uploadImage = function (req, slug) {

    // Resize Profile Picture to 50x50
    let image = new ImageResize(config.upload_images_path + req.file.filename);
    image.loaded().then(function () {
        image.smartResizeDown({
            width: 50,
            height: 50
        }).then(function () {
            image.stream(function (err, stdout, stderr) {
                if (err) {
                    utility.log_it("[" + utility.get_t_now() + "][uploadImage] Error '" + err);
                    return res.json(utility.internal_error_response(err));
                } else {
                    var writeStream = fs.createWriteStream(config.upload_images_path + '50x50_' + req.file.filename);
                    stdout.pipe(writeStream);
                    User.findByIdAndUpdate(req.decoded_jwt.id, {
                        $set: {
                            'profile_picture': req.protocol + '://' + req.get('host') + '/uploads/images/' + req.file.filename,
                            'profile_picture_50x50': req.protocol + '://' + req.get('host') + '/uploads/images/50x50_' + req.file.filename
                        }
                    }, {'new': true}, function (err, user_obj) {
                        if (err) {
                            console.log(err);
                            //return next(err);
                            utility.log_it("[" + utility.get_t_now() + "][POST_PERSONAL_INFORMATION] Error '" + err);
                            return res.json(utility.internal_error_response(err));
                        }
                        else if (user_obj === null) {
                            return res.json(utility.process_failed_response("Sorry, We are unable to update your profile picture."));
                        }
                        else {
                            //Profile picture information has been updated successfully
                            console.log("Profile Picture url is this " + user_obj.profile_picture);
                            return res.json({
                                code: 200,
                                success: true,
                                data: user_obj,
                                message: 'Profile picture has been successfully updated.'
                            });
                        }
                    });
                }
            });
        });
    });

};


/****
 * @purpose: This function will return base 64 encoded image
 * @param image
 * @returns {string}
 */
exports.getBase64EncodedImage = function (image) {
    let base_64_profile_picture = '';
    console.log("Image is this " + image);
    if (typeof image !== 'undefined' && image !== null) {
        let split_url = image.split("/uploads");
        console.log("picture split url is this " + split_url);
        if (split_url.length > 1 && typeof split_url[1] !== 'undefined') {
            base_64_profile_picture = utility.base64_encode("/uploads" + split_url[1]);
            console.log("Base 64 url " + base_64_profile_picture);
        }
    }
    console.log("Base 64 url " + base_64_profile_picture);
    return base_64_profile_picture;
};