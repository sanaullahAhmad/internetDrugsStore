const express = require('express');
const router = express.Router();

/** Models, Controllers and Services Includes **/
const Medicine = require('../models/medicine');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'E-PHARMA APP'});
});


router.get('/populate-db', function (req, res, next) {
    Medicine.importCSV();
    res.render('index', {title: 'E-PHARMA APP'});
});


module.exports = router;
