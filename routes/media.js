const express = require('express');
const router = express.Router();
const multer = require('multer');
const utility = require('../functions/utility.js');
const Config = require('../config/config');
const config = new Config();
const Media = require('../models/media');


// Image uploading
const Uploads = multer({
    storage: utility.files_storage(),
    limits: {fileSize: config.file_size},
    fileFilter: function (req, file, cb) {
        console.log("File mime type is this " + file.mimetype);
        // console.log("File mime type check val  " + config.image_format_arr.indexOf(file.mimetype));
        if (config.attachment_formats.indexOf(file.mimetype) == -1)
            cb(null, false);
        else
            cb(null, true);
    },
});


/***
 * Upload Media Post Request Handler
 */
router.post('/', Uploads.single('my-file'), async function (req, res, next) {
    console.log("In Media Upload " + req.file);
    if (typeof req.file === 'undefined') {
        return res.json(utility.process_failed_response("File is missing."));
    } else if (typeof req.file !== 'undefined' && req.file.size > 0) {
        // Normal processing
        let media_obj = new Media(); //Create New Media Object
        media_obj.file_path = '/uploads/images/' + req.file.filename;
        media_obj.file_url = req.protocol + '://' + req.get('host') + '/uploads/files/' + req.file.filename;
        media_obj.slug = typeof req.body.slug !== "undefined" ? req.body.slug : 'vendor-doc';
        media_obj.name = req.file.originalname;
        media_obj.mimetype = req.file.mimetype;
        media_obj.save(function (err, data) {
            if (err) {
                utility.log_it("[" + utility.get_t_now() + "][Media Post] Error '" + err);
                return res.json(utility.internal_error_response(err));
            }
            else if (data === null) {
                return res.json(utility.process_failed_response("Sorry, We are unable to upload file."));
            }
            else {
                console.log("File url is this " + data.file_url);
                return res.json(
                    utility.success_response({
                        media_id: data._id,
                        file_url: data.file_url,
                        mime_type: req.file.mimetype,
                        file_name: req.file.originalname
                    }, 'File uploaded successfully.'));
            }
        });

    } else
        return res.json(utility.process_failed_response("[Media Post] Sorry, We are unable to upload file."));
});


module.exports = router;