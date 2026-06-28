const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
{

    name: {
        type: String,
        required: true
    },

    image: {
    type: String,
    default: ""
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
    timestamps: true
}
);

module.exports = mongoose.model(
    "Product",
    productSchema
);