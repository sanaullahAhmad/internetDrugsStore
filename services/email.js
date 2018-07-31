const utility = require('../functions/utility.js');
const fs = require('fs');
const config = require('../config/config');
const path = require('path');
const templatesDir = path.join(__dirname, '..', 'views');


/****
 *
 * @param info
 * @param slug
 */
let sendEmail = function (info, slug, attachments) {

    fs.readFile(templatesDir + "/mailer/email_new.ejs", 'utf8', function (err, data) {
        if (err)
            console.log(err);
        if (data) {

            if (typeof info['content'] !== "undefined") {
                data = data.replace("#content#", info['content']);
            }

            String.prototype.replaceAll = function (search, replacement) {
                let target = this;
                return target.replace(new RegExp(search, 'g'), replacement);
            };
            data = data.replaceAll("@base_url@", config.base_url);

            if (typeof info['link'] != "undefined" && info['link'] != "") {
                data = data.replace("#confirm_link#", info['link']);
            }
            if (typeof info['role'] != "undefined" && info['role'] != "") {
                data = data.replace("#user_role#", info['role']);
            }
            if (typeof info['first_name'] != "undefined" && info['first_name'] != "") {
                data = data.replace("#first_name#", info['first_name']);
            }

            let send_email = require('../functions/send_email')(info['email'], slug, data, attachments);
            return true;
        }
    });
};


/***
 *
 * @purpose: This function will send the vendor signup request to E-Pharma Admin
 * @param info
 * @param attachments
 */
exports.sendVendorRegistrationRequest = function (info, attachments) {
    info.content = '<p>Hi E-Pharma Admin,</p>' +
        '<p>You have a new vendor account registration. Here are the details:</p>'+
        '<p><b>Name:</b> ' + info.vendor_name + '</p>'+
        '<p><b>Contact Email:</b> ' + info.vendor_email + '</p>'+
        '<p><b>Contact Number:</b> ' + info.vendor_contact + '</p>'+
        '<p><b>Vendor Activation Code:</b> ' + info.activation_code + '</p>'+
        '<p>Please send the above activation code to the vendor, upon successful verification of the provided documents.</p>';

     // info.content = '<h1 style="font-size:26px; margin-top: 0px; margin-bottom: 0px; color: white; font-family: \'segosemi\';">\n' +
    //     '                Hi Admin,\n' +
    //     '            </h1>\n' +
    //     '<p style="font-size: 15px; color: white; font-family: \'PT Sans\', sans-serif; display: block; margin: 0 auto; text-align: left;">' +
    //     'You have got a new vendor <b>Signup Request!</b>, Here are the details of vendor.  Vendor Name: ' + info.vendor_name + ', Email Address: ' + info.vendor_email + ', Contact Number: ' + info.vendor_contact + '  </p>' +
    //     '<p style="font-size: 15px; color: white; font-family: \'PT Sans\', sans-serif; display: block; margin: 0 auto; text-align: left;">' +
    //     'Please share this activation code with the vendor: ' + info.activation_code + ' .</p>';

    sendEmail(info, 'E-Pharma Vendor Registration', attachments);
};


/***
 *
 * @purpose: This function will send the vendor signup request to E-Pharma Admin
 * @param info
 */
exports.sendForgotPasswordRequest = function (info) {

    info.content = '<p>Hi ' + info.vendor_name + '</p>' +
        '<p>Please use this code <b>\' + info.verification_code + \'</b> to reset your password.</p>' +
        '<p>Cheerfully yours,<br>The E-Pharma Team</p>';

    // info.content = '<h1 style="font-size:26px; margin-top: 0px; margin-bottom: 0px; color: white; font-family: \'segosemi\';">\n' +
    //     '                Hi ' + info.vendor_name + ',\n' +
    //     '            </h1>\n' +
    //     '<p style="font-size: 15px; color: white; font-family: \'PT Sans\', sans-serif; display: block; margin: 0 auto; text-align: left;">' +
    //     'Please use this code <b>' + info.verification_code + '</b> to reset your password. </p>';

    sendEmail(info, 'E-Pharma Reset Password');
};

/****
 *
 * @purpose: Send Welcome Email on Registration
 * @info Object with relevant details
 *
 */
exports.sendWelcomeEmail = function (info) {
    console.log("COMING IN sendWelcomeEmail");
    info.content = '<p>Hi ' + info.vendor_name + ',</p>' +
        '<p>Welcome to E-Pharma! Thank you so much for joining us. You’re on your way to an increased visibility and beyond.</p>' +
        '<p>Our team will be accessing your provided documents and will get in touch with you for further correspondence, shortly. Upon successful verification of your documents, we\'ll be providing you an activation code that will allow you to access the app and add your medicines.</p>' +
        '<p>E-Pharma is a medical app that helps you reach a wider customer base by providing an additional channel for selling your medicines. You can upload selected medicines using the app and the users will be able to reserve those medicines only to pick them from your pharmacy, later. (Learn more here)</p>' +
        '<p>Sit tight while we evaluate your provided documents.</p>' +
        '<p>Meanwhile, if you have any questions just shoot us an email at support@epharma.com. We’re always here to help.</p>' +
        '<p>Cheerfully yours,<br>The E-Pharma Team</p>';
    sendEmail(info, 'Welcome - E-Pharma');
};




