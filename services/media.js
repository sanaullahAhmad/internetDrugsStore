'use strict';
const utility = require('../functions/utility.js');
const fs = require('fs');
const Config = require('../config/config');
const config = new Config();

/** Models and Services Includes **/
const Media = require('../models/media');


module.exports = {

    /***
     *
     * @purpose: Remove Files Method
     * @param media_ids
     */
    removeFiles: function (media_ids) {
        console.log("In remove_files Function ");
        if (typeof files !== "undefined") {
            media_ids.forEach(function (media_id) {
                console.log("media_id  " + media_id);
                if (typeof media_id !== 'undefined') {
                    //Remove Media Collection Entry and Image
                    Media.findByIdAndRemove(media_id, function (err, media_details) {
                        console.log("Media Details are following :" + JSON.stringify(media_details));
                        if (err) {
                            utility.log_it("[" + utility.get_t_now() + "][REMOVE_MEDIA_FILES] Error '" + err);
                        } else if (media_details === null) {
                            utility.log_it("[" + utility.get_t_now() + "][REMOVE_MEDIA_FILES] Unable to find media document by id.'");
                        } else {
                            //unlink file
                            fs.unlink("./public/" + media_details.file_path, function (err) {
                                console.log("File error is this " + err);
                                utility.log_it("[" + utility.get_t_now() + "][REMOVE_MEDIA_FILES] Error files '" + err);
                            });
                        }
                    })
                }
            });
        }
    }

};