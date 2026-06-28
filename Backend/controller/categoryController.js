const Category = require("../model/Category");


// Add Category

const addCategory = async (req, res) => {

    try {

        const { name, description } = req.body;

        const categoryExists = await Category.findOne({
            name
        });

        if (categoryExists) {
            return res.status(400).json({
                message: "Category already exists"
            });
        }

        const category = await Category.create({
            name,
            description
        });

        res.status(201).json({
            message: "Category added successfully",
            category
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// Get All Categories

const getCategories = async (req, res) => {

    try {

        const Product = require("../model/Product");
        const categories = await Category.find();

        const categoriesWithCount = [];
        for (const cat of categories) {
            const count = await Product.countDocuments({ category: cat._id });
            categoriesWithCount.push({
                ...cat.toObject(),
                productCount: count
            });
        }

        res.status(200).json(categoriesWithCount);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// Delete Category

const deleteCategory = async (req, res) => {

    try {

        const category = await Category.findByIdAndDelete(
            req.params.id
        );

        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        res.status(200).json({
            message: "Category deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

module.exports = {
    addCategory,
    getCategories,
    deleteCategory
};