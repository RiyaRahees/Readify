const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    fullName: String,
    phone: String,
    city: String,
    state: String,
    zip: String,
    addressType: String,
    fullAddress: String,

    isDefault: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

module.exports = mongoose.model("Address", addressSchema);