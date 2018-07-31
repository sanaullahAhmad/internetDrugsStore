const nodemailer = require('nodemailer');
const Config = require('../config/config');
const config = new Config();
const utility = require('../functions/utility');


module.exports = function (to, subject, message, attachments) {
// Email send to user
    let transporter = nodemailer.createTransport(config.email_test);
    let mailOptions = {
        from: config.email_from, // sender address
        replyTo: 'support@e-pharma.com',
        to: to, // list of receivers
        subject: subject, // Subject line
        attachments: typeof attachments !== "undefined" ? attachments : null,
        // attachments: [{filename: 'test.pdf', path: __dirname + '/pdf-sample.pdf', contentType: 'application/pdf'}],
        //text: text //, // plaintext body
        html: message // You can choose to send an HTML body instead
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log("Error is this " + error);
            utility.log_it("[" + utility.get_t_now() + "][SendMail] Error '" + error);
            return false;
        } else {
            return true;
        }
    });
};


