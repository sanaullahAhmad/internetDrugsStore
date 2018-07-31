'use strict';

const utility = require('../functions/utility.js');
const validator = require('../functions/validator.js');
const Config = require('../config/config');
const config = new Config();

/** Models and Services Includes **/
const VendorMedicine = require('../models/vendor_medicine');
const MedicineCategories = require('../models/medicine_categories');
const User = require('../models/user');

/**
 * vendor_medicine.js controller
 *
 * @description: A set of functions called "actions" for managing `VendorMedicines`.
 */

module.exports = {

    /***
     * @purpose: Add VendorMedicine API
     * @param req
     * @param callback
     * @returns {Promise.<*>}
     */
    addVendorMedicine: async (req, callback) => {
        try {
            //Perform fields validation
            req.check(validator.validateAddVendorMedicine);
            let errors = req.validationErrors(); // Get all validation errors
            // Assign errors to template
            if (errors) {
                return callback(true, utility.get_fields_validation_errors_object(errors));
            } else {
                //Normal Flow
                let existing_medicine = await VendorMedicine.findOne({
                    medicine_name: req.body.medicine_name,
                    vendor_id: req.decoded_jwt.id
                });
                if (existing_medicine === null) {
                    //Means VendorMedicine Doesn't Exist Already we can create a new one
                    let medicine = new VendorMedicine();
                    medicine.medicine_name = req.body.medicine_name;
                    medicine.drug_reg_num = req.body.drug_reg_num;
                    medicine.vendor_id = req.decoded_jwt.id;
                    medicine.strength = req.body.strength;
                    medicine.strength_unit = req.body.strength_unit;
                    if (req.body.in_stock)
                        medicine.in_stock = req.body.in_stock;
                    medicine.price = req.body.price;
                    medicine.volume = req.body.volume;
                    medicine.volume_unit = req.body.volume_unit;
                    medicine.category = req.body.category;
                    medicine.special_offers = req.body.special_offers;
                    medicine.active_substance_1 = req.body.active_substance_1;
                    medicine.active_substance_2 = req.body.active_substance_2;
                    medicine.active_substance_3 = req.body.active_substance_3;
                    medicine.active_substance_4 = req.body.active_substance_4;
                    medicine.mah_name = req.body.mah_name;
                    let saved_medicine = await medicine.save();

                    return callback(null, {
                        code: 200,
                        success: true,
                        data: {'medicine_name': req.body.medicine_name, 'medicine_id': saved_medicine._id},
                        message: "Your Medicine has been saved successfully.",
                    });
                } else if (existing_medicine !== null) {
                    return callback(true, utility.process_failed_response("Medicine with this name Already added"));
                }
                else {
                    return callback(true, utility.process_failed_response("Same Registration Number is already added."));
                }
            }
        } catch (error) {
            utility.log_it("[" + utility.get_t_now() + "][Add Vendor Medicine] Error '" + error);
            return callback(true, utility.internal_error_response(error));
        }
    },


    /***
     * @purpose: Update Medicine Method
     * @param req
     * @param callback
     * @returns {Promise.<*>}
     */
    updateMedicine: async (req, callback) => {
        try {
            //Perform fields validation
            req.check(validator.validateAddVendorMedicine);
            let errors = req.validationErrors(); // Get all validation errors
            // Assign errors to template
            if (errors) {
                return callback(true, utility.get_fields_validation_errors_object(errors));
            } else {
                //Normal Flow
                let is_owner = await VendorMedicine.findOne({
                    _id         : req.params.id,
                    vendor_id   : req.decoded_jwt.id
                });
                if (is_owner === null) {
                    //Means User is not the same as logged in user.
                    return callback(true, utility.process_failed_response("Forbidden. Only pharmacy owner can update his medicine information."));
                }
                let updated_medicine = await VendorMedicine.findByIdAndUpdate(req.params.id, {
                    $set: {
                        medicine_name: req.body.medicine_name,
                        drug_reg_num: req.body.drug_reg_num,
                        vendor_id: req.decoded_jwt.id,
                        strength: req.body.strength,
                        strength_unit: req.body.strength_unit,
                        in_stock: req.body.in_stock,
                        price: req.body.price,
                        volume: req.body.volume,
                        volume_unit: req.body.volume_unit,
                        category: req.body.category,
                        special_offers: req.body.special_offers,
                        active_substance_1: req.body.active_substance_1,
                        active_substance_2: req.body.active_substance_2,
                        active_substance_3: req.body.active_substance_3,
                        active_substance_4: req.body.active_substance_4,
                        mah_name: req.body.mah_name
                    }
                }, {'new': true});
                return callback(null, {
                    code: 200,
                    success: true,
                    data: {},
                    message: "Medicine record updated successfully.",
                });

            }
        } catch (error) {
            utility.log_it("[" + utility.get_t_now() + "][Add Vendor Medicine] Error '" + error);
            return callback(true, utility.internal_error_response(error));
        }
    },


    /***
     * @purpose: Add VendorMedicine API
     * @param req
     * @param callback
     * @returns {Promise.<*>}
     */
    getVendorSingleMedicine: async (req, callback) => {
        try {
            //Perform fields validation
            req.check(validator.validategetSingleMedicine);
            let errors = req.validationErrors(); // Get all validation errors
            // Assign errors to template
            if (errors) {
                return callback(true, utility.get_fields_validation_errors_object(errors));
            } else {
                //Normal Flow
                let existing_medicine = await VendorMedicine.findById(req.params.medicine_id);
                if (existing_medicine !== null) {
                    //Means VendorMedicine Exist Already

                    //Find Vendor Details
                    let vendor_details = await User.findById(existing_medicine.vendor_id, {
                        vendor_details: 1,
                        contact_number: 1
                    });

                    return callback(null, {
                        code: 200,
                        success: true,
                        data: {
                            'medicine_name': existing_medicine.medicine_name,
                            'drug_reg_num': existing_medicine.drug_reg_num,
                            'vendor_id': existing_medicine.vendor_id,
                            'strength': existing_medicine.strength,
                            'strength_unit': existing_medicine.strength_unit,
                            'in_stock': existing_medicine.in_stock === null ? false : existing_medicine.in_stock,
                            'price': existing_medicine.price,
                            'volume': existing_medicine.volume,
                            'volume_unit': existing_medicine.volume_unit,
                            'category': existing_medicine.category,
                            'special_offers': existing_medicine.special_offers,
                            'active_substance_1': existing_medicine.active_substance_1,
                            'active_substance_2': existing_medicine.active_substance_2,
                            'active_substance_3': existing_medicine.active_substance_3,
                            'active_substance_4': existing_medicine.active_substance_4,
                            'mah_name': existing_medicine.mah_name,
                            'vendor_name': typeof vendor_details.vendor_details.pharmacy_name !== 'undefined' ? vendor_details.vendor_details.pharmacy_name : '',
                            'vendor_phone_no': typeof vendor_details.contact_number !== 'undefined' ? vendor_details.contact_number : '',
                            'vendor_location': typeof vendor_details.vendor_details.pharmacy_location !== 'undefined' ? vendor_details.vendor_details.pharmacy_location : [73.056761,33.661712]
                        },
                        message: "Medicine Details are listed here.",
                    });
                }
                else {
                    return callback(true, utility.process_failed_response("Medicine Does not exits."));
                }
            }
        } catch (error) {
            utility.log_it("[" + utility.get_t_now() + "][Get Single Vendor Medicine] Error '" + error);
            return callback(true, utility.internal_error_response(error));
        }
    },
    /***
     * @purpose: Add VendorMedicine API
     * @param req
     * @param callback
     * @returns {Promise.<*>}
     */
    getMedicinesByCategory: async (req, callback) => {
        try {
            //Perform fields validation
            req.check(validator.validateCategoryMedicines);
            let errors = req.validationErrors(); // Get all validation errors
            // Assign errors to template
            if (errors) {
                return callback(true, utility.get_fields_validation_errors_object(errors));
            } else {
                //Normal Flow
                let category_medicines = await VendorMedicine.find({category: req.params.category}).select({
                    "medicine_name": 1,
                    "category": 1,
                    "strength": 1,
                    "in_stock": 1,
                    "strength_unit": 1,
                    "price": 1,
                    "special_offers": 1,
                    "vendor_id": 1,
                    "active_substance_1": 1,
                    "active_substance_2": 1,
                    "active_substance_3": 1,
                    "active_substance_4": 1,
                    "volume_unit": 1,
                    "volume": 1


                });
                if (category_medicines !== null && category_medicines.length > 0) {

                    const populateMedicines = async (category_medicines) => {
                        let medicines = [];
                        for (let medicine of category_medicines) {
                            //Get Vendor Information
                            let vendor_details = await User.findById(medicine.vendor_id, {
                                vendor_details: 1,
                                contact_number: 1
                            });
                            if (vendor_details !== null)
                                medicines.push({
                                    medicine_name: medicine.medicine_name,
                                    _id: medicine._id,
                                    category: medicine.category,
                                    strength: medicine.strength,
                                    in_stock: medicine.in_stock,
                                    strength_unit: medicine.strength_unit,
                                    price: medicine.price,
                                    special_offers: medicine.special_offers,
                                    vendor_name: typeof vendor_details.vendor_details.pharmacy_name !== 'undefined' ? vendor_details.vendor_details.pharmacy_name : '',
                                    vendor_phone_no: typeof vendor_details.contact_number !== 'undefined' ? vendor_details.contact_number : '',
                                    vendor_location: typeof vendor_details.vendor_details.pharmacy_location !== 'undefined' ? vendor_details.vendor_details.pharmacy_location : [73.056761,33.661712],
                                    volume_unit: medicine.volume_unit,
                                    volume:
                                    medicine.volume,
                                    active_substance_1:
                                    medicine.active_substance_1,
                                    active_substance_2:
                                    medicine.active_substance_2,
                                    active_substance_3:
                                    medicine.active_substance_3,
                                    active_substance_4:
                                    medicine.active_substance_4,

                                })
                                ;
                        }
                        return medicines;
                    };
                    let medicines = await populateMedicines(category_medicines);
                    //Means VendorMedicine Exist Already
                    return callback(null, {
                        code: 200,
                        success: true,
                        data: {category_medicines: medicines},
                        message: "Medicine related to this category are listed here.",
                    });
                }
                else {
                    return callback(true, utility.process_failed_response("No item found."));
                }
            }
        } catch (error) {
            utility.log_it("[" + utility.get_t_now() + "][Git Category Medicines] Error '" + error);
            return callback(true, utility.internal_error_response(error));
        }
    },


    /***
     * @purpose: Get Medicine Categories API
     * @param req
     * @param callback
     * @returns {Promise.<*>}
     */
    getMedicineCategories: async (req, callback) => {
        try {
            //Normal Flow
            let all_categs = await MedicineCategories.find({}).select({"category_name": 1, "url": 1});
            if (all_categs !== null && all_categs.length > 0) {
                //Means MedicineCategories Exist
                return callback(null, {
                    code: 200,
                    success: true,
                    data: {'categories': all_categs},
                    message: "All categories are listed.",
                });
            } else {
                //I am pre populating categories with one record below
                // You can later comment it out.
                let MedCat1 = new MedicineCategories();
                MedCat1.category_name = 'Medications';
                MedCat1.description = 'Include all what ive provided in the list';
                MedCat1.url = config.images_url + 'category-icons/medication.png';
                await MedCat1.save();
                //
                let MedCat2 = new MedicineCategories();
                MedCat2.category_name = 'Supplements';
                MedCat2.description = 'These products are sometimes ordered by doctors such as nutritious items or drinks or multivitamin that doesn\'t not always fall under first category';
                MedCat2.url = config.images_url + 'category-icons/supplements.png';
                await MedCat2.save();
                //
                let MedCat3 = new MedicineCategories();
                MedCat3.category_name = 'Body & Skin Care';
                MedCat3.description = 'This category normally includes items that doctors might recommend patients to buy to help with their treatment such as shampoos, certain creams and moisturizer etc';
                MedCat3.url = config.images_url + 'category-icons/beauty_skin_care.png';
                await MedCat3.save();
                //
                let MedCat4 = new MedicineCategories();
                MedCat4.category_name = 'Braces & Support';
                MedCat4.description = 'This is very important as it includes items that doctors prescribe for patients for joints injuries or post operations etc';
                MedCat4.url = config.images_url + 'category-icons/support.png';
                await MedCat4.save();
                //I am prepopulating ends
                return callback(true, utility.process_failed_response("No categories exists in database."));
            }
        } catch (error) {
            utility.log_it("[" + utility.get_t_now() + "][Get Medicine Categories] Error '" + error);
            return callback(true, utility.internal_error_response(error));
        }
    },

};