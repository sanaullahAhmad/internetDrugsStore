module.exports = {
    // Validate Email
    validateEmail: {
        'user_email': {
            notEmpty: true,
            isEmail: {
                errorMessage: "This doesn't sound like an email. Please provide a valid email address."
            }
        }
    },

    validateChargePayment: {
        'stripe_token': {
            notEmpty: true,
            errorMessage: "Stripe token can not be empty."
        }
    },
    validateBankAccountInformation: {
        'stripe_token': {
            notEmpty: true,
            errorMessage: "Stripe token can not be empty."
        },
        'routing_number': {
            notEmpty: true,
            errorMessage: "Routing number can not be empty."
        },
        'account_number': {
            notEmpty: true,
            errorMessage: "Account number can not be empty."
        },
        'dob_day': {
            notEmpty: true,
            errorMessage: "Date of birth day can not be empty."
        },
        'dob_month': {
            notEmpty: true,
            errorMessage: "Date of birth month can not be empty."
        },
        'dob_year': {
            notEmpty: true,
            errorMessage: "Date of birth year can not be empty."
        },
        'ssn_last_4': {
            notEmpty: true,
            errorMessage: "SSN last 4 can not be empty.",
            isLength: {
                options: [{
                    min: 4,
                    max: 4
                }],
                errorMessage: 'Last 4 SSN number must be 4 digits long.'
            }
        },
        'city': {
            notEmpty: true,
            errorMessage: "City can not be empty."
        },
        'line1': {
            notEmpty: true,
            errorMessage: "Address Line1 can not be empty."
        },
        'postal_code': {
            notEmpty: true,
            matches: {
                options: /(^\d{5}$)|(^\d{5}-\d{4}$)/i,
                errorMessage: 'Please enter a valid postal code.'
            },
            errorMessage: "Post code can not be empty."
        },
        'state': {
            notEmpty: true,
            errorMessage: "State can not be empty."
        }
    },

    validateBankDetails: {
        'routing_number': {
            notEmpty: true,
            errorMessage: "Routing can not be empty.",
            isLength: {
                options: [{
                    min: 9,
                    max: 9
                }],
                errorMessage: 'Routing number must be 9 digits long.'
            }
        },
        'account_number': {
            notEmpty: true,
            errorMessage: "Bank Account number can not be empty."
        },

    },

    // MobileNumber Validator
    validateMobileNumber: {
        'mobile_number': {
            notEmpty: true,
            matches: {
                options: /(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}|((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}|\+[1-9]{1}[0-9]{10}$/i,
                //Pakistani Number: ((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}
                //US format with hyphens: (\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}
                //US format with international code: /\+[1-9]{1}[0-9]{3,14}
                errorMessage: 'Please enter a valid phone number.'
            },
            errorMessage: 'Please enter a phone number.'
        }
    },

    // MobileNumber Validator
    validateResetPassword: {
        'user_email': {
            notEmpty: true,
            isEmail: {
                errorMessage: "This doesn't sound like an email. Please provide a valid email address."
            }
        },
        'verification_code': {
            notEmpty: true,
            errorMessage: 'Please enter verification code.'
        },
        'new_password': {
            isLength: {
                options: [{
                    min: 6,
                    max: 20
                }],
                errorMessage: 'Password must be at least 6 characters and maximum 20 characters long.'
            }, notEmpty: true,
            errorMessage: 'Please enter new password.',
        },
        'confirm_password': {
            notEmpty: true,
            errorMessage: 'Please confirm your password.'
        }
    },

    // ChangePassword Validator
    validateChangePassword: {
        'current_password': {
            notEmpty: true,
            errorMessage: 'Please enter your current password.'
        },
        'new_password': {
            notEmpty: true,
            errorMessage: 'Please enter new password.',
            isLength: {
                options: [{
                    min: 6,
                    max: 20
                }],
                errorMessage: 'Password must be at least 6 characters and maximum 20 characters long.'
            }
        },
        'confirm_password': {
            notEmpty: true,
            errorMessage: 'Please confirm your password.'
        }
    },
    validateAdventureFavourite: {
        'adventure_id': {notEmpty: true, errorMessage: "Please enter adventure id."},
        'mark_favourite': {
            notEmpty: true,
            errorMessage: 'Please enter mark_favorite.',
            matches: {
                options: [/\b(?:yes|no)\b/],
                errorMessage: "mark_favorite can only be yes or no."
            }
        }
    },

    validateErrorLog: {
        'error': {notEmpty: true, errorMessage: "Please provide error string."},
        'device_token': {notEmpty: true, errorMessage: "Please provide device token."}
    },


    validateForgotPassword: {
        'user_email': {
            notEmpty: true,
            isEmail: {
                errorMessage: "This doesn't sound like an email. Please provide a valid email address."
            }
        }
    },
    //Add Vendor Medicine Validator..
    validateAddVendorMedicine: {
        'medicine_name': {
            notEmpty: true,
            errorMessage: 'Please enter medicine name.',
            isLength: {
                options: [{
                    min: 2,
                    max: 200
                }],
                errorMessage: 'medicine name must be minimum 6 characters long.'
            }
        },
        'drug_reg_num': {
            notEmpty: true,
            errorMessage: 'Please enter drug registration number.',
        },
        'strength': {
            notEmpty: true,
            errorMessage: 'Please enter strength.',
        },
        'strength_unit': {
            notEmpty: true,
            errorMessage: 'Please enter strength unit.',
        },
        'price': {
            notEmpty: true,
            errorMessage: 'Please enter price.',
        },
        'volume': {
            notEmpty: true,
            errorMessage: 'Please enter volume.',
        },
        'volume_unit': {
            notEmpty: true,
            errorMessage: 'Please enter volume unit.',
        },
        'category': {
            notEmpty: true,
            errorMessage: 'Please enter category.',
        },
        /*'active_substance_1': {
            notEmpty: true,
            errorMessage: 'Please enter active substance 1.',
        },
        'active_substance_2': {
            notEmpty: true,
            errorMessage: 'Please enter active substance 2.',
        },
        'active_substance_3': {
            notEmpty: true,
            errorMessage: 'Please enter active substance 3.',
        },
        'active_substance_4': {
            notEmpty: true,
            errorMessage: 'Please enter active substance 4.',
        },*/
        'mah_name': {
            notEmpty: true,
            errorMessage: 'Please enter MAH name.',
        },
    },
    //Verify Token Validator..
    validateVendorVerifyToken: {
        'email_verification_code': {
            notEmpty: true,
            errorMessage: 'Please enter verification code.',
            isLength: {
                options: [{
                    min: 6,
                    max: 6
                }],
                errorMessage: 'Verification code must be 6 characters long.'
            }
        },
        /*'user_id': {
            notEmpty: true,
            errorMessage: 'Please enter user id.',
        },*/
    },
    //validate get Single Medicine..
    validategetSingleMedicine: {
        'medicine_id': {
            notEmpty: true,
            errorMessage: 'Please enter Medicine ID.',
        },
    },
    //validate Mark Picked..
    validateMarkPicked: {
        'id': {
            notEmpty: true,
            errorMessage: 'Please enter reservation ID.',
        },
        'product_ids': {
            notEmpty: true,
            errorMessage: 'Please enter product IDs.',
        }
    },
    //validate Category Medicines..
    validateCategoryMedicines: {
        'category': {
            notEmpty: true,
            errorMessage: 'Please enter category.',
        },
    },

    validateVendorProfileUpdate: {
        'pharmacy_name': {
            notEmpty: true,
            errorMessage: 'Please enter pharmacy name.',
            isLength: {
                options: [{
                    min: 1,
                    max: 80
                }],
                errorMessage: 'Pharmacy name must be maximum 80 characters long.'
            }
        }
    },


    //Vendor Validator..
    validateVendorRegistration: {

        'pharmacy_name': {
            notEmpty: true,
            errorMessage: 'Please enter pharmacy name.',
            isLength: {
                options: [{
                    min: 1,
                    max: 80
                }],
                errorMessage: 'Pharmacy name must be maximum 80 characters long.'
            }
        },

        'user_email': {
            notEmpty: true,
            isEmail: {
                errorMessage: "This doesn't sound like an email. Please provide a valid email address."
            }
        },

        'user_password': {
            notEmpty: true,
            errorMessage: 'Password is required for signup.',
            isLength: {
                options: [{
                    min: 6,
                    max: 25
                }],
                errorMessage: 'Password cannot be less than 6 characters long.'
            },

        },

        'contact_number': {
            notEmpty: true,
            matches: {
                options: /(?:\+971|00971|0)(?:2|3|4|6|7|9|50|51|52|55|56)[0-9]{7}|((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/i,
                //options: /((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}|(?:\+971|00971|0)?(?:50|51|52|55|56|2|3|4|6|7|9)\d{7}$/i,
                // Pakistani Number: ((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}
                //UAE Number: ^(?:\+971|00971|0)?(?:50|51|52|55|56|2|3|4|6|7|9)\d{7}$
                //US format with hyphens: (\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}
                //US format with international code: /\+[1-9]{1}[0-9]{3,14}
                errorMessage: 'Please enter a valid phone number.'
            },
            errorMessage: 'Please enter a phone number.'
        },

        'lat': {
            notEmpty: true,
            errorMessage: 'Please enter latitude.'
        },
        'long': {
            notEmpty: true,
            errorMessage: 'Please enter longitude.'
        },
        'address': {
            notEmpty: true,
            errorMessage: 'Please enter pharmacy address.',
            isLength: {
                options: [{
                    min: 1,
                    max: 1000
                }],
                errorMessage: 'Address must be maximum 1000 characters long.'
            }
        }
    }
    ,
    validateAddItemToCart: {
        'vendor_medicine_id': {
            notEmpty: true,
            errorMessage: 'Please enter vendor medicine id.',
            isLength: {
                options: [{
                    min: 24,
                    max: 24
                }],
                errorMessage: 'Invalid vendor medicine id.'
            }
        },
        'quantity': {
            notEmpty: true,
            errorMessage: 'Please enter item quantity.'
        }
    },
    validateRemoveItemCart: {
        'id': {
            notEmpty: true,
            errorMessage: 'Please enter vendor medicine id.',
            isLength: {
                options: [{
                    min: 24,
                    max: 24
                }],
                errorMessage: 'Invalid vendor medicine id.'
            }
        }
    },
    validateUpdateItemCart: {
        'id': {
            notEmpty: true,
            errorMessage: 'Please enter vendor medicine id.',
            isLength: {
                options: [{
                    min: 24,
                    max: 24
                }],
                errorMessage: 'Invalid vendor medicine id.'
            }
        },
        'quantity': {
            notEmpty: true,
            errorMessage: 'Please enter item quantity.'
        }
    },
    validateQuickReserve: {
        'vendor_medicine_id': {
            notEmpty: true,
            errorMessage: 'Please enter vendor medicine id.',
            isLength: {
                options: [{
                    min: 24,
                    max: 24
                }],
                errorMessage: 'Invalid vendor medicine id.'
            }
        },
        'quantity': {
            notEmpty: true,
            errorMessage: 'Please enter item quantity.'
        },
        'name': {
            notEmpty: true,
            errorMessage: 'Please provide your name.',
            isLength: {
                options: [{
                    min: 1,
                    max: 30
                }],
                errorMessage: 'Name can be of minimum 1 and maximum 30 characters.'
            }
        },
        'contact_number': {
            notEmpty: true,
            matches: {
                options: /(?:\+971|00971|0)(?:2|3|4|6|7|9|50|51|52|55|56)[0-9]{7}|((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/i,
                //options: /((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}|(?:\+971|00971|0)?(?:50|51|52|55|56|2|3|4|6|7|9)\d{7}$/i,
                // Pakistani Number: ((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}
                //UAE Number: ^(?:\+971|00971|0)?(?:50|51|52|55|56|2|3|4|6|7|9)\d{7}$
                //US format with hyphens: (\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}
                //US format with international code: /\+[1-9]{1}[0-9]{3,14}
                errorMessage: 'Please enter a valid phone number.'
            },
            errorMessage: 'Please enter a phone number.'
        }
    },


    validateReserve: {
        'vendor_medicine_id': {
            notEmpty: true,
            errorMessage: 'Please enter vendor_medicine_id.'
        },
        'quantity': {
            notEmpty: true,
            errorMessage: 'Please enter quantity.'
        },
        'name': {
            notEmpty: true,
            errorMessage: 'Please enter name.'
        },
        'contact_number': {
            notEmpty: true,
            matches: {
                options: /(?:\+971|00971|0)(?:2|3|4|6|7|9|50|51|52|55|56)[0-9]{7}|((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/i,
                //options: /((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}|(?:\+971|00971|0)?(?:50|51|52|55|56|2|3|4|6|7|9)\d{7}$/i,
                // Pakistani Number: ((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}
                //UAE Number: ^(?:\+971|00971|0)?(?:50|51|52|55|56|2|3|4|6|7|9)\d{7}$
                //US format with hyphens: (\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}
                //US format with international code: /\+[1-9]{1}[0-9]{3,14}
                errorMessage: 'Please enter a valid phone number.'
            },
            errorMessage: 'Please enter a phone number.'
        }
    },


    validateReservationAction: {
        'reservation_id': {
            notEmpty: true,
            errorMessage: 'Please provide reservation_id.',
            isLength: {
                options: [{
                    min: 24,
                    max: 24
                }],
                errorMessage: 'Invalid vendor reservation_id.'
            }
        },
        'action': {
            notEmpty: true,
            errorMessage: 'Please provide action value.',
            matches: {
                options: [/\b(?:accept|reject)\b/],
                errorMessage: "action can only be accept or reject."
            }
        }
    },


    validateFirstName: {
        'first_name': {
            notEmpty: true,
            errorMessage: 'Please enter name.',
            matches: {
                options: /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u,
                errorMessage: 'Please enter a valid first name.'
            }
        }
    },
    validateLastName: {
        'last_name': {
            notEmpty: true,
            errorMessage: 'Please enter name.',
            matches: {
                options: /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u,
                errorMessage: 'Please enter a valid last name.'
            }
        }
    },
    validateAboutMe: {
        'about_me': {
            isLength: {
                options: [{
                    min: 0,
                    max: 200
                }],
                errorMessage: 'About me must be maximum 200 characters long.'
            },
        }
    },


    //Validate Payment Information
    validatePaymentInformation: {
        'card_number': {
            isCreditCard: {
                errorMessage: 'Please enter a valid credit card number.'
            }
        },
        'expiry_month': {
            notEmpty: true,
            errorMessage: 'Please enter card expiry month.'
        },
        'expiry_year': {
            notEmpty: true,
            errorMessage: 'Please enter card expiry year.'
        },
        'cvv_number': {
            notEmpty: true,
            errorMessage: 'Please enter cvv number.',
            isLength: {
                options: [{
                    min: 3,
                    max: 4
                }],
                errorMessage: 'Please enter a valid cvv number.'
            }
        }
    },


    //Personal Information Validator..
    validatePersonalInformation: {

        'first_name': {
            notEmpty: true,
            errorMessage: 'Please enter name.',
            matches: {
                options: /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u,
                errorMessage: 'Please enter a valid first name.'
            }
        },
        'last_name': {
            notEmpty: true,
            errorMessage: 'Please enter name.',
            matches: {
                options: /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u,
                errorMessage: 'Please enter a valid last name.'
            }
        },
        'about_me': {
            isLength: {
                options: [{
                    min: 0,
                    max: 200
                }],
                errorMessage: 'About me must be maximum 200 characters long.'
            }
        }
    },


    //Login Validator..
    validateLogin: {

        'user_email': {
            notEmpty: true,
            isEmail: {
                errorMessage: 'Please enter your registered email ID, to login.'
            }
        }
        // 'device_token': {
        //     notEmpty: true,
        //     errorMessage: 'Please provide device token id.'
        // }
        ,
        // 'user_type': {
        //     notEmpty: true,
        //     errorMessage: 'Please enter user type.'
        //
        // },
        'user_password': {
            notEmpty: true,
            errorMessage: 'Please enter your password to login.',
            isLength: {
                options: [{
                    min: 6,
                    max: 20
                }],
                errorMessage: 'Password cannot be less than 6 characters long.'
            },

        }
    }
    ,
    //Guest Login Validator..
    validateGuestLogin: {
        'device_id': {
            notEmpty: true,
            errorMessage: 'Please enter your device ID.',
        },
    }
};