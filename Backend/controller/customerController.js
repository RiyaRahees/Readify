const User = require("../model/User");
const Order = require("../model/Order");

exports.getAllCustomers = async (req, res) => {
    try {

        const users = await User.find({
            role: "user"
        });

        const customers = await Promise.all(

            users.map(async (user) => {

                const orders = await Order.find({
                    user: user._id
                });

                const totalSpend = orders.reduce(
                    (sum, order) => sum + order.total,
                    0
                );

                return {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    isBlocked: user.isBlocked,
                    isVerified: user.isVerified || false,
                    orderCount: orders.length,
                    totalSpend
                };
            })

        );

        res.status(200).json({
            success: true,
            customers
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};



exports.toggleBlockUser = async (req, res) => {

    try {

        const user = await User.findById(
            req.params.id
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.isBlocked = !user.isBlocked;

        await user.save();

        res.status(200).json({
            success: true,
            isBlocked: user.isBlocked
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};