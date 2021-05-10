const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SubscriptionSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true 
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true 
    },
    period: {
        type:Number,
        required: true
    },
    qty: {
        type: Number,
        required: true
    }
});
module.exports = Subscription = mongoose.model("subscription", SubscriptionSchema);