const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({

    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },

    discountType: {
        type: String,
        enum: ["percentage", "fixed", "shipping"],
        required: true
    },

    discountValue: {
        type: Number,
        required: true
    },

    minPurchase: {
        type: Number,
        default: 0
    },

    startDate: {
        type: Date,
        default: Date.now
    },

    expiryDate: {
        type: Date,
        required: true
    },

    isActive: {
        type: Boolean,
        default: true
    },

    usageCount: {
        type: Number,
        default: 0
    }

}, { timestamps: true });

module.exports = mongoose.model("Coupon", couponSchema);