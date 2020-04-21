const Property = require("../models/property");
var mongoose = require('mongoose');
const fs=require('fs');


exports.listAllProperties = (req, res) => {
    Property.find({}, (err, object) => {
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