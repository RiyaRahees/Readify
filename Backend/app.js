const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");

require("./config/passport");


const app = express();
const authRoute = require("./routes/authRoutes")
const categoryRoutes = require("./routes/categoryRoutes")
const productRoutes = require("./routes/productRoutes")
const cartRoutes =  require("./routes/cartRoutes")
const wishlistRoutes = require("./routes/wishlistRoutes")
const addressRoutes = require("./routes/addressRoutes");
const couponRoutes = require("./routes/couponRoutes");
const orderRoutes = require("./routes/orderRoutes")
const customerRoutes = require("./routes/customerRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const walletRoutes = require("./routes/walletRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");



const path = require("path");

app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);
// Middleware

app.use(cors());
app.use(express.json());

app.use(
    session({
        secret: process.env.JWT_SECRET,
        resave: false,
        saveUninitialized: false
    })
);

app.use(passport.initialize());
app.use(passport.session());

// Home Route

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Readify Backend Running Successfully"
    });
});

app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);

// API Routes

app.use("/api/auth", authRoute);

app.use("/api/cart",cartRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/coupons",couponRoutes);
app.use("/api/orders",orderRoutes);
app.use("/api/customers",customerRoutes);

app.use("/api/payment", paymentRoutes);
app.use("/api/wallet", walletRoutes);



app.use("/api/dashboard", dashboardRoutes);

module.exports = app;