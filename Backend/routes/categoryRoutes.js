const express = require("express");

const router = express.Router();

const {
    addCategory,
    getCategories,
    deleteCategory
} = require("../controller/categoryController");


// Add Category
router.post("/", addCategory);

// Get Categories
router.get("/", getCategories);

// Delete Category
router.delete("/:id", deleteCategory);

module.exports = router;