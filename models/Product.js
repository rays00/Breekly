const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ProductSchema = new Schema({
    name: {
        type:String,
        required:true
    },
    description: {
        type:String
    },
    price: {
        type:Number
    },
    availability: {
        type:Boolean,
        required:true
    }
});
module.exports = Product = mongoose.model("product", ProductSchema);