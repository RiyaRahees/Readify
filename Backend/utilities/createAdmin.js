const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("../model/User");

dotenv.config();

const createAdmin = async () => {
    try {

        await mongoose.connect(process.env.MONGO_URI);

        const adminExists = await User.findOne({
            email: "admin@readify.com"
        });

        if (adminExists) {
            console.log("Admin already exists");
            process.exit();
        }

        const hashedPassword = await bcrypt.hash(
            "admin123",
            10
        );

        await User.create({
            name: "Admin",
            email: "admin@readify.com",
            password: hashedPassword,
            role: "admin"
        });

        console.log("Admin Created Successfully");

        process.exit();

    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

createAdmin();