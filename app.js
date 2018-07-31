const createError = require('http-errors');
const express = require('express');
const router = express.Router();
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const validator = require('express-validator');
const cors = require('cors');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const vendorsRouter = require('./routes/vendors');
const vendorsMedicinesRouter = require('./routes/vendors_medicines');
const mediaRouter = require('./routes/media');
const cartRouter = require('./routes/guest_cart');
const reservationRouter = require('./routes/reservations');

const bodyParser = require('body-parser');

const utility = require('./functions/utility'); //Utility Include


const db = require('./config/db'); // Database Connectivity
// const swaggerUi = require('swagger-ui-express'), //Swager Module API Documentation
//     swaggerDocument = require('./swagger.json');

const app = express();

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// app.use(cors());
// app.options('*', cors());

app.use(validator({
    customValidators: {
        isArray: function (value) {
            console.log("IS ARRAY "+Array.isArray(value));
            return Array.isArray(value);
        },
        notEmpty: function (array) {
            console.log("Received array is this " + array);
            return typeof array !== "undefined" && array !== null && array.length > 0;
        }
        ,
        validMongoIds: function (array) {
            for (let element of array) {
                if (element.length !== 24) {
                    return false;
                }
            }
            return true;
        }
    }
}));


app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser({limit: '15mb'}));


app.use('/', indexRouter);
router.use('/users', usersRouter);
router.use('/vendors', vendorsRouter);
router.use('/vendors-medicines', vendorsMedicinesRouter);
router.use('/media', mediaRouter);
router.use('/cart', cartRouter);
router.use('/reservations', reservationRouter);


//swager setup
var swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
//swager setup ends
app.use('/api/v1', router);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    console.log("404 Catcher");
    let err = new Error('Not Found');
    err.status = 404;
    return res.json({
        code: 404,
        success: false,
        message: "Resource Not Found.",
        error: err
    });
    // next(err);
});

// Error handler
app.use(function (err, req, res, next) {
    utility.log_it("[" + utility.get_t_now() + "][ERROR] Internal Server Error '" + err);
    return res.json(utility.internal_error_response(err));
});


module.exports = app;