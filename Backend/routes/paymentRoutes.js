const express = require("express");
const router = express.Router();

const {
createOrder
} = require("../controller/paymentController");

router.get("/get-key", (req, res) => {


res.json({
    key: process.env.RAZORPAY_KEY_ID
});


});

router.post("/create-order", createOrder);

module.exports = router;
