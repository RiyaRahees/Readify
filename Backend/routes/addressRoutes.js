const express = require("express");

const router = express.Router();
const {
    addAddress,
    getAddresses,
    deleteAddress
} = require("../controller/addressController")

router.post("/add", addAddress);

router.get("/:userId", getAddresses);

router.delete("/delete/:id", deleteAddress);


module.exports = router;