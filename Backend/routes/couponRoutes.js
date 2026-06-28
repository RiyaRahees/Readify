const express = require("express");

const router = express.Router();

const {
    createCoupon,
    getCoupons,
    deleteCoupon,
    applyCoupon
} = require("../controller/couponController");

router.post("/add",createCoupon);

router.get("/",getCoupons);

router.delete("/:id",deleteCoupon);

router.post("/apply", applyCoupon);

module.exports = router;