const express = require('express');
const router = express.Router();
const fs = require('fs');
const gm = require("gm");

const utility = require('../functions/utility.js');
const Config = require('../config/config');
const config = new Config();
const authenticate_user = require('../functions/authenticate_user');


/** Models, Controllers and Services Includes **/
const User = require('../models/user');
const UserController = require('../controllers/users');
const ImageService = require('../services/image_upload');

const ImageResize = require('node-image-resize');
const imageMagick = gm.subClass({imageMagick: true});
// Image uploading
const multer = require('multer');
const Uploads = multer({
    storage: utility.images_storage(),
    limits: {fileSize: config.file_size},
    fileFilter: function (req, file, cb) {
        if (config.image_format_arr.indexOf(file.mimetype) === -1)
            cb(null, false);
        else
            cb(null, true);
    },
});

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});


/***
 * @Purpose:
 */
router.post('/forgot-password', async (req, res, next) => {
    UserController.sendForgotPasswordEmail(req, function (err, response) {
        return res.json(response);
    });
});

/***
 * @Purpose: Vendor Authenticate API
 */
router.post('/authenticate', async (req, res, next) => {
    UserController.authenticateUser(req, function (err, response) {
        return res.json(response);
    });
});

/***
 * @Purpose: Guest User API
 */
router.post('/guest-user-auth', async (req, res, next) => {
    UserController.guestUserAuth(req, function (err, response) {
        return res.json(response);
    });
});


/*
Post Password RESET Request Handler.
*
*/
router.post('/reset-password', async (req, res) => {
    UserController.resetPassword(req, function (err, response) {
        return res.json(response);
    });
});


/* Post Change Password Request Handler.
*
*/
router.post('/change-password', authenticate_user(), async (req, res) => {
    UserController.changePassword(req, function (err, response) {
        return res.json(response);
    });
});


/***
 *  User Profile Picture Upload Request Handler  (Need to be improved)
 *  ***/
router.post('/profile-picture', Uploads.single('profile_picture'), authenticate_user(), function (req, res, next) {
    if (typeof req.file === 'undefined') {
        return res.json(utility.process_failed_response("File not received."));
    } else if (typeof req.file !== 'undefined' && req.file.size > 0) {
        // Normal processing Check if user is already registered with the given email address or not
        // Resize Profile Picture to 50x50
        let image = new ImageResize(config.upload_images_path + req.file.filename);
        image.loaded().then(function () {
            image.smartResizeDown({
                width: 50,
                height: 50
            }).then(function () {
                image.stream(function (err, stdout, stderr) {
                    if (err) {
                        utility.log_it("[" + utility.get_t_now() + "][POST_PROFILE_PICTURE] Error '" + err);
                        return res.json(utility.internal_error_response(err));
                    } else {
                        let writeStream = fs.createWriteStream(config.upload_images_path + '50x50_' + req.file.filename);
                        stdout.pipe(writeStream);
                        User.findByIdAndUpdate(req.decoded_jwt.id, {
                            $set: {
                                'profile_picture': req.protocol + '://' + req.get('host') + '/uploads/images/' + req.file.filename,
                                'profile_picture_50x50': req.protocol + '://' + req.get('host') + '/uploads/images/50x50_' + req.file.filename
                            }
                        }, {'new': true}, function (err, user_obj) {
                            if (err) {
                                utility.log_it("[" + utility.get_t_now() + "][POST_PERSONAL_INFORMATION] Error '" + err);
                                return res.json(utility.internal_error_response(err));
                            }
                            else if (user_obj === null) {
                                return res.json(utility.process_failed_response("Sorry, We are unable to update your profile picture."));
                            }
                            else {
                                //Profile picture information has been updated successfully
                                console.log("Profile Picture url is this " + user_obj.profile_picture);
                                return res.json(
                                    utility.success_response({
                                        profile_picture: user_obj.profile_picture,
                                        profile_picture_50x50: user_obj.profile_picture_50x50
                                        //,base_64_image: ImageService.getBase64EncodedImage(user_obj.profile_picture)
                                    }, 'Profile picture has been successfully updated.'));
                            }
                        });
                    }
                });
            });
        });
    } else {
        return res.json(utility.process_failed_response("Invalid file mime type."));
    }
});


module.exports = router;
