'use strict';
const mongoose = require('mongoose');

const medicineSchema = mongoose.Schema({
    barCode: String,
    srNo: Number,
    drugRegistrationNumber: {
        type: String
    },
    medicineName: {
        type: String,
        required: true
    }, strength: {},
    strengthUnit: {},
    category: {
        type: String
        // ,required: true
    },
    packSize: {type: String},
    activeSubstance1: {
        type: String,
    },
    activeSubstance2: {
        type: String,
    },
    activeSubstance3: {
        type: String,
    },
    activeSubstance4: {
        type: String,
    },
    retailPrice: {
        type: String
    },
    manufacturer: {
        type: String
        // , required: true
    },
    sideEffect: {
        type: String
    },
    date_registered:
        {
            type: Date,
            default:
            Date.now
        },
    is_active: {
        type: Boolean,
        default:
            true
    }
});

// Compile model from schema

var Medicine = mongoose.model('Medicine', medicineSchema);
var exports = module.exports = Medicine;


exports.importCSV = function () {

    const fs = require('fs');
    const parse = require('csv-parse');
    const async = require('async');
    const inputFile = './db/drugs.csv';

    fs.createReadStream(inputFile)
        .pipe(parse({delimiter: ','}))
        .on('data', function (csvrow) {
            let medicine = new Medicine();
            medicine.srNo = csvrow[0];
            medicine.drugRegistrationNumber = csvrow[1];
            medicine.medicineName = csvrow[2];
            medicine.strength = csvrow[3];
            medicine.strengthUnit = csvrow[4];
            medicine.category = csvrow[5];
            medicine.packSize = csvrow[6];
            medicine.activeSubstance1 = csvrow[7];
            medicine.activeSubstance2 = csvrow[8];
            medicine.activeSubstance3 = csvrow[9];
            medicine.activeSubstance4 = csvrow[10];
            medicine.retailPrice = csvrow[11];
            medicine.manufacturer = csvrow[12];

            medicine.save();


            console.log(csvrow);
        }).on('end', function () {
        console.log("END");
    }).on('error', function (err) { // it will catch if there is any error in a row.
        console.log(err);
    });

    // let parser = parse({delimiter: ','}, function (err, data) {
    //     console.log("DATA LENGTH IS THIS " + data.length);
    //     async.eachSeries(data, function (line, callback) {
    //         // do something with the line
    //
    //         //console.log("Line is this " + line + '\n');
    //         callback();
    //         // doSomething(line).then(function () {
    //         //     // when processing finishes invoke the callback to move to the next one
    //         //     callback();
    //         // });
    //     })
    // });
    // fs.createReadStream(inputFile).pipe(parser);


    // return jwt.sign({
    //     id: user_obj._id,
    //     email: user_obj.user_email,
    //     user_type: user_obj.user_type,
    // }, config.secret, {
    //     expiresIn: config.token_expiry_time
    // });
};
