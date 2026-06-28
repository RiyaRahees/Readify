const express = require("express");

const router = express.Router();

const {
  addToCart,
  getCart,
  removeCartItem,
} = require("../controller/cartController");

router.post("/add", addToCart);

router.get("/:userId", getCart);

router.delete("/:id", removeCartItem);

module.exports = router;