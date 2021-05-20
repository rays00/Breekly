const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    status: {
        type: Number,
        required: true,
        default: 0
    },
    subscriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subscription",
        required: true
    },
    time : { type : Date, default: Date.now }
});
module.exports = Order = mongoose.model("order", OrderSchema);