const { API_BASE_URL } = require("../../../Frontend/apiConfig");
const Product = require("../model/Product");

// Add Product

const addProduct = async (req, res) => {

    try {

        const product = await Product.create({

            name: req.body.name,
            sku: req.body.sku,
            category: req.body.category,
            stock: req.body.stock,
            price: req.body.price,
            discountPrice: req.body.discountPrice,
            description: req.body.description,

            image: req.file
                ? `${API_BASE_URL}/uploads/${req.file.filename}`
                : ""

        });

        res.status(201).json({
            message: "Product Added Successfully",
            product
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};
// Get Products
const getProducts = async (req, res) => {

    try {

        const filter = {};

        if (req.query.category) {
            filter.category = req.query.category;
        }

        let sort = {};

        switch (req.query.sort) {

            case "priceAsc":
                sort.price = 1;
                break;

            case "priceDesc":
                sort.price = -1;
                break;

            case "nameAsc":
                sort.name = 1;
                break;

            case "nameDesc":
                sort.name = -1;
                break;

            case "newest":
                sort.createdAt = -1;
                break;

            default:
                sort.createdAt = -1;
        }

        const products = await Product.find(filter)
            .populate("category", "name")
            .sort(sort);

        res.status(200).json(products);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

const deleteProduct = async (req, res) => {

    try {

        await Product.findByIdAndDelete(
            req.params.id
        );

        res.status(200).json({
            message: "Product deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


const getProductById = async (req, res) => {
    try {

        const product = await Product.findById(req.params.id)
            .populate("category");

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json(product);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


const updateProduct = async (req, res) => {

    try {

        const updateData = {

            name: req.body.name,
            sku: req.body.sku,
            category: req.body.category,
            stock: req.body.stock,
            price: req.body.price,
            discountPrice: req.body.discountPrice,
            description: req.body.description

        };

        if (req.file) {

            updateData.image =
                `${API_BASE_URL}/uploads/${req.file.filename}`;

        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true
            }
        );

        if (!product) {

            return res.status(404).json({
                message: "Product not found"
            });

        }

        res.json({
            message: "Product updated successfully",
            product
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


module.exports = {
    addProduct,
    getProducts,
    deleteProduct,
    getProductById,
    updateProduct
};


