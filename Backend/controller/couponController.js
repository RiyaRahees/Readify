const Coupon = require("../model/Coupon");

exports.createCoupon = async (req,res)=>{

    try{

        const coupon = await Coupon.create(req.body);

        res.status(201).json(coupon);

    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};

exports.getCoupons = async(req,res)=>{

    try{

        const coupons = await Coupon.find()
        .sort({createdAt:-1});

        res.json(coupons);

    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};

exports.deleteCoupon = async(req,res)=>{

    try{

        await Coupon.findByIdAndDelete(
            req.params.id
        );

        res.json({
            message:"Coupon Deleted"
        });

    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};

exports.applyCoupon = async (req, res) => {


try {

    const { code, subtotal } = req.body;

    const coupon = await Coupon.findOne({
        code: code.toUpperCase(),
        isActive: true
    });

    if (!coupon) {

        return res.status(404).json({
            message: "Invalid Coupon"
        });

    }

    const now = new Date();

    if (
        coupon.startDate &&
        new Date(coupon.startDate) > now
    ) {

        return res.status(400).json({
            message: "Coupon is not active yet"
        });

    }

    if (
        coupon.expiryDate &&
        new Date(coupon.expiryDate) < now
    ) {

        return res.status(400).json({
            message: "Coupon Expired"
        });

    }

    if (subtotal < coupon.minPurchase) {

        return res.status(400).json({
            message: `Minimum purchase ₹${coupon.minPurchase}`
        });

    }

    let discount = 0;

    if (coupon.discountType === "percentage") {

        discount =
            (subtotal * coupon.discountValue) / 100;

    } else if (coupon.discountType === "fixed") {

        discount = coupon.discountValue;

    }

    res.json({
        success: true,
        discount
    });

} catch (error) {

    res.status(500).json({
        message: error.message
    });

}

};
