const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const propertyTypes = ['mieszkanie', 'dom', 'pokój'];

const PropertySchema = new Schema({
    type: {
        type: String,
        required: true,
        enum: propertyTypes // FIXME chyba że tak nie ograniczać ze strony backendu, tylko z frontu np. z rozwijanej listy zrobić wybór?
    },
    numberOfRooms: {
        type: Number,
        required: true
    },
    pricePerMonth: {
        type: Number,
        required: true
    },
    isAvailable: {
        type: Boolean,
        required: true,
        default: true
    },
    city: {
        type: String
    },
    district: {
        type: String,
        required: true
    },
    photo: {
        image: Buffer,
        contentType: String
    }
})
;

module.exports = mongoose.model("Property", PropertySchema);