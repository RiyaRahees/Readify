const express = require("express");
const router = express.Router();

const {
    placeOrder,
    getOrderById,
    getUserOrders,
    getAllOrders,
    updateOrderStatus,
    cancelOrderItem,
    updateItemStatus,
    getTransactions
} = require("../controller/orderController");

router.post("/place", placeOrder);

router.get("/transactions", getTransactions);

router.get("/", getAllOrders);

router.get("/user/:userId", getUserOrders);

router.get("/:id", getOrderById);

router.patch("/:id/status", updateOrderStatus);

router.patch("/:id/cancel-item", cancelOrderItem);

router.patch("/:id/item-status", updateItemStatus);

module.exports = router;