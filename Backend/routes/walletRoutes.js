const express = require("express");
const router = express.Router();

const {
    getWallet,
    addMoneyToWallet,
    payWithWallet
} = require("../controller/walletController");

router.get("/:userId", getWallet);
router.post("/add-money",addMoneyToWallet);
router.post("/pay",payWithWallet);

module.exports = router;