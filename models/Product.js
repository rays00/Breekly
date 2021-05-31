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
    },
    imagePaths: [{
        type: String 
    }]
});
module.exports = Product = mongoose.model("product", ProductSchema);