const mongoose = require("mongoose");
const { API_BASE_URL } = require("../../Frontend/apiConfig");

const formatUrl = (val) => {
    if (!val) return "";
    try {
        if (val.startsWith("http")) {
            const urlObj = new URL(val);
            return `${API_BASE_URL}${urlObj.pathname}`;
        }
        if (val.startsWith("/uploads")) {
            return `${API_BASE_URL}${val}`;
        }
        return `${API_BASE_URL}/uploads/${val}`;
    } catch (e) {
        return val;
    }
};

const reviewSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        userName: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            required: true
        },
        likes: {
            type: Number,
            default: 0
        },
        likedBy: {
            type: [String],
            default: []
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        isReported: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
        toJSON: { getters: true },
        toObject: { getters: true }
    }
);

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        sku: {
            type: String,
            required: true,
            unique: true
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },
        stock: {
            type: Number,
            default: 0
        },
        price: {
            type: Number,
            required: true
        },
        discountPrice: {
            type: Number,
            default: 0
        },
        description: {
            type: String
        },
        author: {
            type: String,
            default: "Unknown Author"
        },
        language: {
            type: String,
            default: "English"
        },
        pages: {
            type: Number,
            default: 0
        },
        deliveryInfo: {
            type: String,
            default: "Free Delivery on orders above ₹499"
        },
        returnPolicy: {
            type: String,
            default: "7 Day Return & Replacement"
        },
        image: {
            type: String,
            default: "",
            get: formatUrl
        },
        reviews: {
            type: [reviewSchema],
            default: []
        }
    },
    {
        timestamps: true,
        toJSON: { getters: true },
        toObject: { getters: true }
    }
);

module.exports = mongoose.model("Product", productSchema);