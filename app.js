const express = require('express');
const bodyParser = require("body-parser");
const userController = require('./controllers/userController');

const app = express();
require("./config/db");

const port = process.env.PORT || 3301;
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(function (req,res,next) {
    res.header('Access-Control-Allow-Origin',"*");
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    next();
});

app.get('*',function(req,res,next){
    res.locals.user = req.user || null;
    next();
});

app
    .route("/users")
    .get(userController.listAllUsers);
app
    .route("/user/register")
    .post(userController.user_signup);
app
    .route("/user/login")
    .post(userController.user_login);



app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


// function sayHello(name) {
//     console.log('Hello ' + name);
// }
//
// sayHello('You');