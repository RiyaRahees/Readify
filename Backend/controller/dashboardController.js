const Order = require("../model/Order");
const Product = require("../model/Product");
const User = require("../model/User");
const Category = require("../model/Category");
const PDFDocument = require("pdfkit");


exports.getDashboard = async (req, res) => {
    try {

        const totalRevenue = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$total" }
                }
            }
        ]);

        const totalOrders = await Order.countDocuments();

        const totalCustomers = await User.countDocuments({
            role: "user"
        });

        const totalProducts = await Product.countDocuments();

        const inStock = await Product.countDocuments({
            stock: { $gt: 0 }
        });

        const outOfStock = await Product.countDocuments({
            stock: 0
        });

        const topProductsAggregation = await Order.aggregate([
            { $unwind: "$items" },
            { $match: { "items.status": { $ne: "Cancelled" } } },
            {
                $group: {
                    _id: "$items.product",
                    sold: { $sum: "$items.quantity" }
                }
            },
            { $sort: { sold: -1 } },
            { $limit: 5 }
        ]);

        const topProducts = [];
        for (const item of topProductsAggregation) {
            if (item._id) {
                const prod = await Product.findById(item._id).lean();
                if (prod) {
                    topProducts.push({
                        ...prod,
                        sold: item.sold
                    });
                }
            }
        }

        if (topProducts.length < 5) {
            const excludeIds = topProducts.map(p => p._id);
            const remainingProducts = await Product.find({ _id: { $nin: excludeIds } }).limit(5 - topProducts.length).lean();
            for (const prod of remainingProducts) {
                topProducts.push({
                    ...prod,
                    sold: 0
                });
            }
        }

        const recentOrders = await Order.find()
            .populate("user")
            .sort({ createdAt: -1 })
            .limit(3);

        const pendingOrders = await Order.countDocuments({ orderStatus: "Pending" });
        const deliveredOrders = await Order.countDocuments({ orderStatus: "Delivered" });

        const paymentMethodStats = await Order.aggregate([
            {
                $group: {
                    _id: "$paymentMethod",
                    soldCount: { $sum: 1 }
                }
            },
            { $sort: { soldCount: -1 } }
        ]);

        const methods = ["Razorpay", "COD", "Wallet"];
        methods.forEach(m => {
            const exists = paymentMethodStats.find(item => item._id === m);
            if (!exists) {
                paymentMethodStats.push({ _id: m, soldCount: 0 });
            }
        });

        res.json({
            revenue: totalRevenue[0]?.total || 0,
            orders: totalOrders,
            customers: totalCustomers,
            products: totalProducts,
            inStock,
            outOfStock,
            pendingOrders,
            deliveredOrders,
            topProducts,
            recentOrders,
            paymentMethodStats
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};



exports.getSalesChart = async (req, res) => {
    try {
        const monthlySales = await Order.aggregate([
            {
                $group: {
                    _id: {
                        $dayOfWeek: "$createdAt"
                    },
                    revenue: {
                        $sum: "$total"
                    },
                    orderCount: {
                        $sum: 1
                    },
                    uniqueCustomers: {
                        $addToSet: "$user"
                    }
                }
            },
            {
                $sort: {
                    "_id": 1
                }
            }
        ]);

        const salesChartData = monthlySales.map(item => ({
            _id: item._id,
            revenue: item.revenue,
            orderCount: item.orderCount,
            customerCount: item.uniqueCustomers ? item.uniqueCustomers.length : 0
        }));

        res.json(salesChartData);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



exports.getWeeklyReport = async (req, res) => {
    try {

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const orders = await Order.find({
            createdAt: { $gte: oneWeekAgo }
        }).populate("user");

        const revenue = orders.reduce((sum, order) => sum + order.total, 0);

        const delivered = orders.filter(o => o.orderStatus === "Delivered").length;
        const pending = orders.filter(o => o.orderStatus === "Pending").length;
        const cancelled = orders.filter(o => o.orderStatus === "Cancelled").length;

        const doc = new PDFDocument({
            size: "A4",
            margin: 40
        });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=Readify-Weekly-Report.pdf"
        );

        doc.pipe(res);

        // ===========================
        // HEADER
        // ===========================

        doc.rect(0, 0, 595, 90)
            .fill("#1E3A8A");

        doc
            .fillColor("white")
            .fontSize(28)
            .font("Helvetica-Bold")
            .text("READIFY", 40, 25);

        doc
            .fontSize(18)
            .text("Weekly Sales Report", 40, 55);

        doc
            .fontSize(10)
            .text(
                `Generated : ${new Date().toLocaleString()}`,
                380,
                60,
                { align: "right" }
            );

        doc.moveDown(4);

        // ===========================
        // SUMMARY CARDS
        // ===========================

        const cardWidth = 150;
        const cardHeight = 70;
        const y = 120;

        function card(x, title, value) {

            doc.roundedRect(x, y, cardWidth, cardHeight, 8)
                .fillAndStroke("#F8FAFC", "#D1D5DB");

            doc
                .fillColor("#64748B")
                .fontSize(11)
                .font("Helvetica-Bold")
                .text(title, x + 15, y + 12);

            doc
                .fillColor("#1E3A8A")
                .fontSize(20)
                .font("Helvetica-Bold")
                .text(value, x + 15, y + 35);

        }

        card(40, "Revenue", `₹${revenue.toLocaleString()}`);
        card(220, "Orders", orders.length);
        card(400, "Customers", new Set(orders.map(o => o.user?._id?.toString())).size);

        doc.moveDown(5);

        // ===========================
        // ORDER STATUS
        // ===========================

        doc
            .fillColor("#1E3A8A")
            .fontSize(18)
            .font("Helvetica-Bold")
            .text("Order Summary", 40, 230);

        doc.moveDown();

        doc
            .fontSize(12)
            .fillColor("black");

        doc.text(`Delivered : ${delivered}`);
        doc.text(`Pending : ${pending}`);
        doc.text(`Cancelled : ${cancelled}`);

        doc.moveDown(2);

        // ===========================
        // TABLE HEADER
        // ===========================

        let tableTop = 320;

        doc.rect(40, tableTop, 515, 25)
            .fill("#1E3A8A");

        doc
            .fillColor("white")
            .fontSize(10)
            .font("Helvetica-Bold");

        doc.text("Order ID", 50, tableTop + 7);
        doc.text("Customer", 170, tableTop + 7);
        doc.text("Status", 300, tableTop + 7);
        doc.text("Amount", 390, tableTop + 7);
        doc.text("Date", 470, tableTop + 7);

        tableTop += 25;

        // ===========================
        // TABLE ROWS
        // ===========================

        orders.forEach((order, index) => {

            if (tableTop > 730) {
                doc.addPage();
                tableTop = 50;
            }

            if (index % 2 === 0) {
                doc.rect(40, tableTop, 515, 25)
                    .fill("#F8FAFC");
            }

            doc.fillColor("black").font("Helvetica");

            doc.text(order._id.toString().slice(-8), 50, tableTop + 7);

            doc.text(
                order.user?.name || "Guest",
                170,
                tableTop + 7
            );

            if (order.orderStatus === "Delivered")
                doc.fillColor("green");

            else if (order.orderStatus === "Pending")
                doc.fillColor("orange");

            else
                doc.fillColor("red");

            doc.text(order.orderStatus, 300, tableTop + 7);

            doc.fillColor("black");

            doc.text(
                `₹${order.total.toLocaleString()}`,
                390,
                tableTop + 7
            );

            doc.text(
                order.createdAt.toLocaleDateString(),
                470,
                tableTop + 7
            );

            tableTop += 25;

        });

        // ===========================
        // FOOTER
        // ===========================

        doc.moveDown(2);

        doc
            .fontSize(10)
            .fillColor("gray")
            .text(
                "Generated automatically by Readify Admin Dashboard",
                40,
                780,
                { align: "center" }
            );

        doc.end();

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};