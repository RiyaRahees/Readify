const Wallet = require("../model/Wallet");
const Order = require("../model/Order");
const Cart = require("../model/Cart");
const Product = require("../model/Product");

exports.placeOrder = async (req, res) => {


    try {

        const {
            userId,
            addressId,
            paymentMethod,
            deliveryMethod,
            subtotal,
            shipping,
            tax,
            discount,
            total
        } = req.body;

        const cartItems = await Cart.find({
            user: userId
        }).populate("product");

        if (!cartItems.length) {

            return res.status(400).json({
                success: false,
                message: "Cart is empty"
            });

        }

        // Check stock and reduce quantity

        for (const item of cartItems) {

            const product = await Product.findById(item.product._id);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `${product.name} has only ${product.stock} items left`
                });
            }

            product.stock -= item.quantity;

            await product.save();

        }



        // WALLET PAYMENT

        if (paymentMethod === "Wallet") {

            const wallet = await Wallet.findOne({
                userId
            });

            if (!wallet) {

                return res.status(404).json({
                    success: false,
                    message: "Wallet not found"
                });

            }

            if (wallet.balance < total) {

                return res.status(400).json({
                    success: false,
                    message: "Insufficient wallet balance"
                });

            }

            wallet.balance -= total;

            wallet.transactions.push({

                type: "debit",

                amount: total,

                description: "Order Payment"

            });

            await wallet.save();
        }

        const order = await Order.create({

            user: userId,

            items: cartItems.map(item => ({

                product: item.product._id,

                quantity: item.quantity,

                price: item.product.price

            })),

            address: addressId,

            paymentMethod,

            deliveryMethod,

            subtotal,

            shipping,

            tax,

            discount,

            total,

            orderStatus: "Pending"

        });

        await Cart.deleteMany({
            user: userId
        });

        res.status(201).json({

            success: true,

            message: "Order placed successfully",

            order

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }


};


exports.getOrderById = async (req, res) => {

    try {

        const order = await Order.findById(req.params.id)
            .populate("user")
            .populate("items.product")
            .populate("address");

        if (!order) {

            return res.status(404).json({
                message: "Order not found"
            });

        }

        res.status(200).json(order);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

exports.getUserOrders = async (req, res) => {

    try {

        const orders = await Order.find({

            user: req.params.userId

        })
            .populate("items.product")
            .sort({ createdAt: -1 });

        res.status(200).json(orders);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

exports.getAllOrders = async (req, res) => {

    try {

        const orders = await Order.find()
            .populate("user")
            .populate("items.product")
            .populate("address")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            orders
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

exports.updateOrderStatus = async (req, res) => {

    try {

        const { status } = req.body;

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { orderStatus: status },
            { new: true }
        );

        res.status(200).json({
            success: true,
            order
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


exports.cancelOrderItem = async (req, res) => {

    try {

        const { productId, reason } = req.body;

        const order = await Order.findById(
            req.params.id
        );

        if (!order) {

            return res.status(404).json({
                success: false,
                message: "Order not found"
            });

        }

        const item = order.items.find(
            item =>
                item.product.toString() === productId
        );

        if (!item) {

            return res.status(404).json({
                success: false,
                message: "Item not found"
            });

        }

        if (item.status === "Cancelled") {

    return res.status(400).json({
        success: false,
        message: "Item already cancelled"
    });

}

        item.status = "Cancelled";
        item.cancelReason = reason;
        item.cancelledAt = new Date();

        const product = await Product.findById(productId);

        if (product) {
            product.stock += item.quantity;
            await product.save();
        }

        // Refund amount to wallet for Razorpay/Wallet payments
if (
    order.paymentMethod === "Razorpay" ||
    order.paymentMethod === "Wallet"
) {

    const wallet = await Wallet.findOne({
        userId: order.user
    });

    if (wallet) {

        const refundAmount = item.price * item.quantity;

        wallet.balance += refundAmount;

        wallet.transactions.push({
            type: "credit",
            amount: refundAmount,
            description: `Refund for ${product.name}`
        });

        await wallet.save();
    }
}

        

        await order.save();

        res.json({
            success: true,
            message: "Item cancelled successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};



exports.updateItemStatus = async (req, res) => {
    try {
        console.log(req.body);
        const { productId, status } = req.body;

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        const item = order.items.find(
            item =>
                item.product &&
                (item.product.toString() === productId ||
                 (item.product._id && item.product._id.toString() === productId))
        );

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found in this order"
            });
        }

        item.status = status;

        // Auto-calculate overall orderStatus based on item statuses
        const allStatuses = order.items.map(i => i.status);
        if (allStatuses.every(s => s === "Delivered")) {
            order.orderStatus = "Delivered";
        } else if (allStatuses.every(s => s === "Cancelled")) {
            order.orderStatus = "Cancelled";
        } else if (allStatuses.some(s => s === "Shipped" || s === "Delivered")) {
            order.orderStatus = "Shipped";
        } else if (allStatuses.some(s => s === "Processing")) {
            order.orderStatus = "Processing";
        } else {
            order.orderStatus = "Pending";
        }

        await order.save();

        res.json({
            success: true
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



exports.getTransactions = async (req, res) => {
    try {

        const orders = await Order.find()
            .populate("user")
            .sort({ createdAt: -1 });

        const totalRevenue = orders
            .filter(o => o.orderStatus !== "Cancelled")
            .reduce((sum, o) => sum + o.total, 0);

        const completed = orders.filter(
            o => o.orderStatus === "Delivered"
        ).length;

        const pending = orders.filter(
            o => o.orderStatus === "Pending"
        ).length;

        const cancelled = orders.filter(
            o => o.orderStatus === "Cancelled"
        ).length;

        res.json({
            totalRevenue,
            completed,
            pending,
            cancelled,
            orders
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};