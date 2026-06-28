const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const path = require("path");
const User = require("../model/User");

// Load .env from Backend folder
dotenv.config({
    path: path.join(__dirname, "..", ".env"),
});

// Check if MONGO_URI is loaded
console.log("MONGO_URI:", process.env.MONGO_URI);

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected");

        const adminExists = await User.findOne({
            email: "admin@readify.com",
        });

        if (adminExists) {
            console.log("Admin already exists");
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash("admin123", 10);

        await User.create({
            name: "Admin",
            email: "admin@readify.com",
            password: hashedPassword,
            role: "admin",
        });

        console.log("✅ Admin Created Successfully");
        process.exit(0);

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

createAdmin();