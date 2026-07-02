const { API_BASE_URL } = require("../../Frontend/apiConfig");
const Product = require("../model/Product");

// Add Product
const addProduct = async (req, res) => {
    try {
        const product = await Product.create({
            name: req.body.name,
            sku: req.body.sku,
            category: req.body.category,
            stock: Number(req.body.stock || 0),
            price: Number(req.body.price || 0),
            discountPrice: Number(req.body.discountPrice || 0),
            description: req.body.description,
            author: req.body.author || "Unknown Author",
            language: req.body.language || "English",
            pages: Number(req.body.pages || 0),
            deliveryInfo: req.body.deliveryInfo || "Free Delivery on orders above ₹499",
            returnPolicy: req.body.returnPolicy || "7 Day Return & Replacement",
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

        if (req.query.search) {
            filter.$or = [
                { name: { $regex: req.query.search, $options: "i" } },
                { author: { $regex: req.query.search, $options: "i" } }
            ];
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

// Delete Product
const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message: "Product deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Get Product by ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("category");
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

// Update Product
const updateProduct = async (req, res) => {
    try {
        const existingProduct = await Product.findById(req.params.id);
        if (!existingProduct) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        const updateData = {
            name: req.body.name,
            sku: req.body.sku,
            category: req.body.category,
            stock: Number(req.body.stock || 0),
            price: Number(req.body.price || 0),
            discountPrice: Number(req.body.discountPrice || 0),
            description: req.body.description,
            author: req.body.author || existingProduct.author,
            language: req.body.language || existingProduct.language,
            pages: Number(req.body.pages !== undefined ? req.body.pages : existingProduct.pages),
            deliveryInfo: req.body.deliveryInfo || existingProduct.deliveryInfo,
            returnPolicy: req.body.returnPolicy || existingProduct.returnPolicy
        };

        if (req.file) {
            updateData.image = `${API_BASE_URL}/uploads/${req.file.filename}`;
        } else if (req.body.image) {
            updateData.image = req.body.image;
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

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

// Add Review to Book
const addReview = async (req, res) => {
    try {
        const { userId, userName, rating, comment } = req.body;
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const review = {
            userId,
            userName,
            rating: Number(rating),
            comment,
            isVerified: true
        };

        product.reviews.push(review);
        await product.save();

        res.status(201).json({
            message: "Review added successfully",
            product
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Like/Unlike a Review
const likeReview = async (req, res) => {
    try {
        const { userId } = req.body;
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const review = product.reviews.id(req.params.reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        if (!review.likedBy) {
            review.likedBy = [];
        }

        const index = review.likedBy.indexOf(userId);
        if (index === -1) {
            review.likedBy.push(userId);
            review.likes += 1;
        } else {
            review.likedBy.splice(index, 1);
            review.likes = Math.max(0, review.likes - 1);
        }

        await product.save();
        res.status(200).json({ message: "Review reaction updated", product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Report a Review
const reportReview = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const review = product.reviews.id(req.params.reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        review.isReported = true;
        await product.save();

        res.status(200).json({ message: "Review reported successfully", product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addProduct,
    getProducts,
    deleteProduct,
    getProductById,
    updateProduct,
    addReview,
    likeReview,
    reportReview
};
