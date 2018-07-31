/** External Modules Includes **/
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const log_file = 'server.log';
const mkdirp = require('mkdirp');
const multer = require('multer');
const Config = require('../config/config');
const config = new Config();
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const password = config.cipher_key;
const path = require('path'),
    templatesDir = path.join(__dirname, '..', 'views');


//Helper Functions

module.exports = {

    encrypt: function (text) {
        let cipher = crypto.createCipher(algorithm, password)
        let crypted = cipher.update(text, 'utf8', 'hex')
        crypted += cipher.final('hex');
        return crypted;
    },

    decrypt: function (text) {
        let decipher = crypto.createDecipher(algorithm, password)
        let dec = decipher.update(text, 'hex', 'utf8')
        dec += decipher.final('utf8');
        return dec;
    },


    base64_encode: function (file) {
        console.log("In base64_encode " + ".public/" + file);
        let path = "./public/" + file;
        console.log("PATH is this  " + path);
        if (typeof file != "undefined" && fs.existsSync(path)) {

            try {
                // read binary data
                var bitmap = fs.readFileSync(path);
                // convert binary data to base64 encoded string
                return new Buffer(bitmap).toString('base64');
            } catch (err) {
                // Here you get the error when the file was not found,
                // but you also get any other error
                return "";
            }


        } else {
            return "";
        }
    },

    check_array_element_existence: function (element, elements_array) {
        let is_found = 0;
        elements_array.forEach(function (elem) {
            if (element == elem) {
                is_found = 1;
            }
        });
        return is_found;
    },


    calculate_minutes_difference: function (dt2, dt1) {
        let diff = (dt2.getTime() - dt1.getTime()) / 1000;
        diff /= 60;
        return Math.abs(Math.round(diff));
    },


// Logging function
    log_it: function (message) {
        fs.appendFile(log_file, message + '\n', function (err) { // Open file to append message.
            if (err) throw err; // Unable to write to the log file.
            console.log(message);
        });
    }
    ,

    internal_error_response: function (err) {
        console.log(err);
        return {
            code: 500,
            success: false,
            message: "Internal Server Error",
            error: err
        }
    }
    ,
    success_response: function (data, msg) {
        return {
            code: 200,
            success: true,
            data: data,
            message: msg
        }
    },
    fileFilter: function (req, file, cb) {
        if (config.attachment_formats.indexOf(file.mimetype) == -1)
            cb(null, false);
        else
            cb(null, true);
    }
    // ,
    // files_storage: function () {
    //     console.log("In Files Storage");
    //     return multer.diskStorage({
    //         destination: function (req, file, cb) {
    //             mkdirp(config.upload_files_path, function (err) {
    //             });
    //             cb(null, config.upload_files_path)
    //         },
    //         filename: function (req, file, cb) {
    //             var getFileExt = function (fileName) {
    //                 var fileExt = fileName.split("/");
    //                 if (fileExt.length === 1 || (fileExt[0] === "" && fileExt.length === 2)) {
    //                     return "";
    //                 }
    //                 return fileExt.pop();
    //             }
    //             cb(null, Date.now() + '.' + getFileExt(file.mimetype))
    //         }
    //     });
    // }
    ,

    files_storage: function () {
        return multer.diskStorage({
            destination: function (req, file, cb) {
                mkdirp(config.upload_files_path, function (err) {
                });
                cb(null, config.upload_files_path)
            }
            ,
            filename: function (req, file, cb) {
                var getFileExt = function (fileName) {
                    var fileExt = fileName.split("/");
                    console.log("fileExt value is this  " + fileExt);
                    if (fileExt.length === 1 || (fileExt[0] === "" && fileExt.length === 2)) {
                        return "";
                    }
                    return fileExt.pop();
                }
                cb(null, Date.now() + '.' + getFileExt(file.mimetype))
            }
        });
    },

    images_storage: function () {
        return multer.diskStorage({
            destination: function (req, file, cb) {
                mkdirp(config.upload_images_path, function (err) {
                });
                cb(null, config.upload_images_path)
            }
            ,
            filename: function (req, file, cb) {
                var getFileExt = function (fileName) {
                    var fileExt = fileName.split("/");
                    console.log("fileExt value is this  " + fileExt);
                    if (fileExt.length === 1 || (fileExt[0] === "" && fileExt.length === 2)) {
                        return "";
                    }
                    return fileExt.pop();
                }
                cb(null, Date.now() + '.' + getFileExt(file.mimetype))
            }
        });
    }
    ,


    process_failed_response: function (msg) {
        return {
            success: false,
            message: msg,
            code: 409,
            process_code: -1
        };

    },

    process_failed_response_with_key: function (msg, key) {
        return {
            success: false,
            data: {message: msg},
            message: msg,
            code: 409,
            key: key,
            process_code: -1
        };
    },
    process_failed_response_with_code: function (msg, key) {
        return {
            success: false,
            data: {},
            message: msg,
            code: 409,
            process_code: key
        };
    },
    process_failed_response_with_code_and_error: function (error, msg, process_code) {
        return {
            success: false,
            data: {message: msg},
            error: error,
            message: msg,
            code: 409,
            process_code: process_code
        };
    },
    process_failed_response_with_code_error_key: function (error, msg, process_code, key) {
        return {
            success: false,
            data: {message: msg},
            error: error,
            message: msg,
            code: 409,
            process_code: process_code,
            key: key
        };
    },
    process_failed_response_with_code_and_key: function (msg, code, key) {
        return {
            success: false,
            data: {message: msg},
            message: msg,
            code: 409,
            process_code: code,
            key: key
        };
    },


// Time function to return date-time (UTC) in the YYYY-MM-DD HH:mm:ss format.
    get_t_now: function () {
        var n = new Date(); // Get current date.
        return n.toISOString().replace('T', ' ').replace('Z', '').slice(0, 19); // Return the string of date in the YYYY-MM-DD HH:mm:ss format.
    }
    ,


// Check if the log file exceeds the maximum amount of lines. (For size keeping purposes)
    clearLogFile: function () {
        // Set variables
        let i;					// Helper variable for the count.
        let count = 0;			// The amount of lines on the file.
        let maximum = 10000;	// The maximum amount of lines to keep in the log file.

        // Open the log file and start reading the contents.
        fs.createReadStream(log_file).on('data', function (chunk) {
            // We have received the data of the file. Start counting.
            for (i = 0; i < chunk.length; ++i) {
                if (chunk[i] == 10) {
                    // 10 is the new line character. Count 1 up.
                    count++;
                }
            }
        }).on('end', function () {
            // We found the end of file.
            if (count > maximum) {
                // The log file contains more lines than the maximum. Remove the first ones.
                // Inform via console what is going on.
                console.log("[" + get_t_now() + "][LOG] The log file '" + log_file + "' contains '" + count + "' lines.");
                console.log("[" + get_t_now() + "][LOG] Removing the first " + (count - maximum) + " lines from the file (Maximum allowed: " + maximum + ").");

                // Get the data of the file.
                let data = fs.readFileSync(log_file, 'utf8');
                // Split the lines on each new-line character.
                let lines = data.split('\n');
                // Remove the first (count - maximum) amount of lines from the file.
                lines.splice(0, count - maximum);
                // Join the lines again to a string.
                let newdata = lines.join('\n');
                // Add the new data back to the file.
                fs.writeFile(log_file, newdata, function (err) {
                    if (err) throw err; // Unable to open the file.
                    console.log("[" + get_t_now() + "][LOG] The log file '" + log_file + "' now contains '" + maximum + "' lines.");
                });
            }
        });
    }
    ,


    random4_digit_number_not_starting_with_zero: function () {
        // I did not include the zero, for the first digit
        let digits = "123456789".split(''),
            first = this.shuffle(digits).pop();
        // Add "0" to the array
        digits.push('0');
        return parseInt(first + this.shuffle(digits).join('').substring(0, 3), 10);
    }
    ,

    shuffle: function (o) {
        for (let j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x) ;
        return o;
    }
    ,


    get_fields_validation_errors_object: function (errors) {
        return {
            errors: this.format_validation_errors(errors),
            code: 400,
            success: false,
            message: "Fields validation failed."
        };
    }
    ,


    /***
     * @purpose Format Validation Errors
     * @param errMsg
     * @returns {{}}
     */
    format_validation_errors: function (errMsg) {
        if (errMsg.length > 0) {
            let all_errors = {};
            for (var i = 0; i < errMsg.length; i++) {
                param = errMsg[i].param;
                messege = errMsg[i].msg;
                all_errors[param] = messege;
            }
            return all_errors;

        }
    }
    ,


    /****
     * @purpose: This function will check whether an object is empty or not
     * @param obj
     * @returns {boolean}
     */
    isEmpty: function (obj) {
        return Object.keys(obj).length === 0;
    }
    ,

    /***
     * @purpose: This function will hash the plain password
     * @param plain_password
     * @returns {*}
     */
    hash_password: function (plain_password) {
        return bcrypt.hashSync(plain_password, bcrypt.genSaltSync(10), null);
    }
    ,


    decode_jwt: function (token) {
        return jwt.decode(token);
    }

};