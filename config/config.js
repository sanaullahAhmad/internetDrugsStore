module.exports = function () {

    let development = {
        'port': 6106,
        'database': 'mongodb://localhost/e-pharma-dev',
        'base_url': 'https://localhost:6106/',
        'images_url': 'http://localhost:6106/images/',
        'secret': 'neversacrificehappinessforachievemente-pharma21234asdadasd',
        'token_expiry_time': '365d',
        'email_test': {
            service: 'Gmail',
            auth: {
                user: 'test@discretelogix.com',
                pass: 'discrete123'
            },
            port: 465
        },
        'email_from': "support@e-pharma.com",
        'image_format_obj': {'jpg': 'images/jpeg', 'png': 'images/png', 'gif': 'images/gif'},
        'image_format_arr': ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'],
        'attachment_formats': ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.ms-exce', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document','text/plain'],
        'upload_images_path': __dirname + '/../public/uploads/images/',
        'upload_files_path': __dirname + '/../public/uploads/files/',

        'image_size': 5000000, // 5MB
        'file_size': 5000000, //5MB
        'ssl': {
            key: './ssl/private.key',
            cert: './ssl/certificate.crt',
            ca: './ssl/ca_bundle.crt'
        },
        //'admin_email': 'zeeshan.tariq@discretelogix.com',
        'admin_email': ['zeeshan.tariq@discretelogix.com', 'sana.ullah@discretelogix.com', 'irum.manzoor@binexsolutions.com', 'farrukh.jamal@discretelogix.com', 'kinza.saghir@binexsolutions.com', 'awaisullah.khan@binexsolutions.com', 'ukasha.tahir@binexsolutions.com', 'muhammad.bilal@binexsolutions.com']
    };

    let production = {
        'port': 6106,
        'database': 'mongodb://zeeshan:123456@ds135750.mlab.com:35750/e-pharma',
        'base_url': 'https://www.app.cuufy.com:6106/',
        'images_url': 'http://www.app.cuufy.com:6106/images/',
        'secret': 'neversacrificehappinessforachievemente-pharma21234',
        'token_expiry_time': '365d',
        'email_test': {
            service: 'Gmail',
            auth: {
                user: 'test@discretelogix.com',
                pass: 'discrete123'
            },
            port: 465
        },
        'email_from': "support@e-pharma.com",
        'image_format_obj': {'jpg': 'images/jpeg', 'png': 'images/png', 'gif': 'images/gif'},
        'image_format_arr': ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'],
        'attachment_formats': ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.ms-exce', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document','text/plain'],
        'upload_images_path': __dirname + '/../public/uploads/images/',
        'upload_files_path': __dirname + '/../public/uploads/files/',

        'image_size': 5000000, // 5MB
        'file_size': 5000000, //5MB
        'ssl': {
            key: './ssl/private.key',
            cert: './ssl/certificate.crt',
            ca: './ssl/ca_bundle.crt'
        },
        //'admin_email': 'zeeshan.tariq@discretelogix.com',
        'admin_email': ['zeeshan.tariq@discretelogix.com', 'sana.ullah@discretelogix.com', 'irum.manzoor@binexsolutions.com', 'farrukh.jamal@discretelogix.com', 'kinza.saghir@binexsolutions.com', 'awaisullah.khan@binexsolutions.com', 'ukasha.tahir@binexsolutions.com', 'muhammad.bilal@binexsolutions.com']
    };


    switch (process.env.NODE_ENV) {
        case 'development':
            return development;

        case 'production':
            return production;

        default:
            return development;
    }
};