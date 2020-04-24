const Property = require("../models/property");
const mongoose = require('mongoose');
const fs = require('fs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

exports.listAllProperties = (req, res) => {
    Property.find({}, (err, object) => {
        if (err) {
            res.status(500).send(err);
        }
        res.status(200).json(object);
    });
};

exports.listProperty = (req, res) => {
    Property.findOne({_id: req.params.id}, (err, object)=>{
        if (err) {
            res.status(500).send(err);
        }
        res.status(200).json(object);
    });
};

exports.addProperties = (req, res) => {
    const photo = fs.readFileSync(req.file.path);
    let encode_image = photo.toString('base64');
    //define json object for the image
    let finalPhoto = {
        contentType: req.file.mimetype,
        path: req.file.path,
        image: new Buffer(encode_image, 'base64')
    };
    const property = new Property({
        _id: new mongoose.Types.ObjectId(),
        type: req.body.type,
        numberOfRooms: req.body.numberOfRooms,
        pricePerMonth: req.body.pricePerMonth,
        isAvailable: req.body.isAvailable,
        city: req.body.city,
        district: req.body.district,
        photo: finalPhoto
    });
    property
        .save()
        .then(result => {
            res.status(201).json({
                message: "Property added"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.changeAvailability = (req, res) => {
    Property.findOne({_id: req.body.id})
        .exec()
        .then(property => {
            let currentAvailability = property.isAvailable;
            property.isAvailable = !currentAvailability;

            property
                .save()
                .then(result => {
                    res.status(201).json({
                        message: "Availability changed"
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });

        });
};

exports.updateProperty = (req, res) => {
    Property.findOneAndUpdate(
        {_id: req.body.id},
        req.body,
        {new: true},
        (err, property) => {
            if (err) {
                res.status(500).send(err);
            }
            res.status(200).json(property);
        }
    );
};

exports.deleteProperty = (req, res) => {
    Property.deleteOne({_id: mongoose.Types.ObjectId(req.body.id)}, (err, property) => {
        if (err) {
            res.status(404).send(err);
        }
        res.status(200).json({message: "Property successfully deleted"});
    });
};

exports.viewProperty = (req, res) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'estateagency987@gmail.com',
            pass: 'haslo do sendera'
        }
    });

    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userData = decoded;

    let mailOptions = {
        from: req.userData.email,
        to: 'estateagency987@gmail.com',
        subject: 'Zgłoszono chęć obejrzenia posiadłości przez użytkownika ' + req.userData.name + ' ' + req.userData.surname,
        text: req.userData.email+' pisze:\n'+req.body.text+'\n\nWiadomość do nieruchomości o id: '+req.body.propertyid
    };
    transporter.sendMail(mailOptions, function(error, info) {
        if(error){
            res.status(500).send(error);
        }
        res.status(200).json({
            message: "Mail sent"
        });
    });
};