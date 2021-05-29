const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let SubscriptionSchema = new Schema({
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
    },
    addressId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
        required: true
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    }
});
SubscriptionSchema.index({ userId: 1, productId: 1, period: 1, qty: 1}, {unique: true});
module.exports = Subscription = mongoose.model("subscription", SubscriptionSchema);