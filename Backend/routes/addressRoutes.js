const express = require("express");

const router = express.Router();
const {
    addAddress,
    getAddresses,
    deleteAddress,
    setDefaultAddress
} = require("../controller/addressController")

router.post("/add", addAddress);

router.get("/:userId", getAddresses);

router.delete("/delete/:id", deleteAddress);

router.put("/default/:id", setDefaultAddress);

module.exports = router;