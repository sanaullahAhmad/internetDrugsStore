const jwt = require('jsonwebtoken');
const Config = require('../config/config');
const config = new Config();
const utility = require('../functions/utility');
const bodyParser = require('body-parser');
const InvalidJwt = require('../models/invalid_jwt_tokens');
/***
 *
 * Custom Middleware that will verify the jwt token
 *
 */
module.exports = function (role=null) {
    return function (req, res, next) {
    // bodyParser.json();
    let parser = bodyParser.json();
    let token = req.headers['x-access-token'];
    console.log("TOKEN VALUE IS THIS "+token);
    if (!token) return res.status(401).send({success: false, message: 'No token provided.', code: 401,process_code:12});

    //First Check whether token is in the black list or not
    InvalidJwt.count({token: token}, function (err, count) {
        if (err) {
            return res.json(utility.internal_error_response(err));
        } else if (count > 0) {
            //means token is blacklisted
            res.status(500).send({success: false, message: 'Failed to authenticate token.', code: 401,process_code:12});
        } else {
            jwt.verify(token, config.secret, function (err, decoded) {
                if (err) return res.status(500).send({
                    success: false,
                    message: 'Failed to authenticate token.',
                    code: 401
                });

                else if (decoded === null) {
                    return res.json(utility.process_failed_response("Not able to decode jwt."));
                }
                else if ( role!==null && decoded.user_type !== role) {
                    return res.json(utility.process_failed_response("Forbidden. This user does not have permission."));
                }

                // console.log("decoded token is this " + JSON.stringify(decoded));
                // return res.status(200).send(decoded);
                req.decoded_jwt = decoded;
                // return next(err);

                return parser(req, res, function (err) { // parse
                    if (err) return next(err);
                    console.log({body: req.body}); // log it here
                    return next(err);
                });
            });
        }
    });
  }
};
