const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AddressSchema = new Schema({
    street: {
        type:String,
        required:true
    },
    number: {
        type:String,
        required:true
    },
    details: {
        type:String
    },
    city: {
        type:String,
        required:true
    },
    userId: {
        type:String,
        required:true
    }
});
module.exports = Address = mongoose.model("address", AddressSchema);