const express = require('express');
const bodyParser = require("body-parser");
const userController = require('./controllers/userController');
const propertyController = require('./controllers/propertyController');
const multer = require('multer');
const storage = multer.diskStorage({
    // destination: function (req, file, cb) {
    //     cb(null, './uploads');
    // },
    filename: function (req, file, cb) {
        cb(null, new Date().getTime() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Wrong photo type, can be either jpeg of png.'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

const app = express();
require("./config/db");

const port = process.env.PORT || 3301;
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    next();
});

app.get('*', function (req, res, next) {
    res.locals.user = req.user || null;
    next();
});

//TODO delete listAllUsers
app
    .route("/users")
    .get(userController.listAllUsers);
app
    .route("/user/register")
    .post(userController.user_signup);
app
    .route("/user/login")
    .post(userController.user_login);
app
    .route("/property/show")
    .get(userController.grantAccess('readAny', 'profile'), propertyController.listAllProperties);

app.route("/property/add")
    .post(userController.grantAccess('updateAny', 'profile'), upload.single('propertyPhoto'), propertyController.addProperties);



app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});