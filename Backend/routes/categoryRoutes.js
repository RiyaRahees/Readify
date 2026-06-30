const express = require("express");

const router = express.Router();
const upload = require("../middleware/upload");

const {
    addCategory,
    getCategories,
    deleteCategory
} = require("../controller/categoryController");


// Add Category
router.post("/", upload.single("image"), addCategory);

// Get Categories
router.get("/", getCategories);

// Delete Category
router.delete("/:id", deleteCategory);

module.exports = router;