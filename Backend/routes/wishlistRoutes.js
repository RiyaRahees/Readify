const express = require("express");
const router = express.Router();

const {
  addToWishlist,
  getWishlist,
  removeWishlist
} = require("../controller/wishlistController");

router.post("/add", addToWishlist);

router.get("/:userId", getWishlist);

router.delete("/remove/:id",removeWishlist);

module.exports = router;