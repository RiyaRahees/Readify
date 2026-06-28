const express = require("express");

const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/authMiddleware");

const {
    register,
    login,
    sendOtp,
    verifyOtp,
    resetPassword,
    googleCallback,
    changePassword,
    getProfile,
    updateProfile,
    resendSignupOtp
} = require("../controller/authController");

router.post("/register", register);

router.post("/login", login);

router.post("/forgot-password", sendOtp);

router.post("/verify-otp", verifyOtp);

router.post("/resend-signup-otp", resendSignupOtp);

router.post("/reset-password", resetPassword);

router.put("/change-password", verifyToken, changePassword);

router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, updateProfile);


// Google Authentication
router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"]
    })
);

router.get(
    "/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect: "http://127.0.0.1:5500/Frontend/User/login.html"
    }),
    googleCallback
);



module.exports = router;