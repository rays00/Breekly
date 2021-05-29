const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    email: {
        type:String,
        required:true
    },
    password: {
        type:String,
        required:true
    },
    firstName: {
        type:String,
        required:true
    },
    lastName: {
        type:String,
        required:true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    }
});
module.exports = User = mongoose.model("user", UserSchema);