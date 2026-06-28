const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    items: [{

    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },

    quantity: Number,

    price: Number,

    status: {
        type: String,
        enum: [
            "Active",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled"
        ],
        default: "Active"
    },

    cancelReason: {
        type: String,
        default: ""
    },

    cancelComment: {
        type: String,
        default: ""
    },

    cancelledAt: Date

}],

    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address"
    },

    paymentMethod: String,

    deliveryMethod: String,

    subtotal: Number,

    shipping: Number,

    tax: Number,

    discount: Number,

    total: Number,

    orderStatus: {
        type: String,
        default: "Pending"
    }

}, { timestamps: true });

module.exports =
    mongoose.model("Order", orderSchema);