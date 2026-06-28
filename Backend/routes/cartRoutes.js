const express = require("express");

const router = express.Router();

const {
  addToCart,
  getCart,
  removeCartItem,
  updateCartQuantity,
} = require("../controller/cartController");

router.post("/add", addToCart);

router.get("/:userId", getCart);

router.delete("/:id", removeCartItem);

router.put("/update/:id", updateCartQuantity);

module.exports = router;