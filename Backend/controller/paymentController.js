const razorpay = require("../utilities/razorpay");

exports.createOrder = async (req, res) => {

    try {

        const { amount } = req.body;

        const order = await razorpay.orders.create({
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        });

        res.json(order);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};