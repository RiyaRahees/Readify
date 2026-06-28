const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
    addProduct,
    getProducts,
    deleteProduct,
    getProductById,
    updateProduct
} = require("../controller/productController");

router.post(
    "/",
    upload.single("image"),
    addProduct
);

router.get("/", getProducts);

router.get("/:id", getProductById);

router.delete("/:id", deleteProduct);

router.put("/:id",upload.single("image"),updateProduct);

module.exports = router;