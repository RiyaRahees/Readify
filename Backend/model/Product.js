const mongoose = require("mongoose");
const { API_BASE_URL } = require("../../Frontend/apiConfig");

const productSchema = new mongoose.Schema(
{

    name: {
        type: String,
        required: true
    },

    image: {
    type: String,
    default: "",
    get: (val) => {
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
    }
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
    }
},
{
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true }
}
);

module.exports = mongoose.model(
    "Product",
    productSchema
);