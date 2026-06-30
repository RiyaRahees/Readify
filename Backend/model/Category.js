const mongoose = require("mongoose");
const { API_BASE_URL } = require("../../Frontend/apiConfig");

const categorySchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true,
        unique: true
    },

    description: {
        type: String,
        default: ""
    },

    imageUrl: {
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
    }
},
{
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true }
}
);

module.exports = mongoose.model("Category", categorySchema);