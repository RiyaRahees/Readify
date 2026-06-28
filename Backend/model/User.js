const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    phone: {
        type: String
    },

    password: {
        type: String,
        required: false
    },

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
     isBlocked: {
        type: Boolean,
        default: false
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    otp: {
        type: String
    },

    otpExpiry: {
        type: Date
    }
});

module.exports = mongoose.model("User", userSchema);