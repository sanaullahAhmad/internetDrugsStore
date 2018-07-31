"use_strict";

//Database Connectivity
const mongoose = require('mongoose');
const Config = require('../config/config');
conf = new Config();
const utility = require('../functions/utility');
mongoose.Promise = require('bluebird');

console.log("Mongoose DATABASE is this "+conf.database);

mongoose.connect(conf.database);

//Get the default connection
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var dbError = function () {
    utility.log_it("[" + utility.get_t_now() + "][DATABASE] MongoDB connection error '");
};
db.on('error', dbError);