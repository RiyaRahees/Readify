const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");




// Register User

const register = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "User registered successfully",
            user
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Login User

const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        if (user.isBlocked) {
    return res.status(403).json({
        success: false,
        message: "Your account has been blocked by admin"
    });
}

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
    {
        id: user._id,
        role: user.role
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "7d"
    }
);

res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    }
});

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};



const sendOtp = async (req, res) => {
  try {

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const otp = Math.floor(
      1000 + Math.random() * 9000
    ).toString();

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Readify Password Reset OTP",
      html: `
        <h2>Your OTP is: ${otp}</h2>
        <p>Valid for 5 minutes.</p>
      `
    });

    res.status(200).json({
      message: "OTP sent successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const verifyOtp = async (req, res) => {

  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  if (
    user.otp !== otp ||
    user.otpExpiry < Date.now()
  ) {
    return res.status(400).json({
      message: "Invalid or Expired OTP"
    });
  }

  res.status(200).json({
    message: "OTP Verified"
  });
};



const resetPassword = async (req, res) => {

  const { email, password } = req.body;

  const user = await User.findOne({ email });

  const hashedPassword =
    await bcrypt.hash(password, 10);

  user.password = hashedPassword;
  user.otp = null;
  user.otpExpiry = null;

  await user.save();

  res.status(200).json({
    message: "Password Reset Successful"
  });
};

const googleCallback = async (req, res) => {

    try {

        const token = jwt.sign(

            {
                id: req.user._id,
                role: req.user.role
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "7d"
            }

        );

       res.redirect(
    `http://127.0.0.1:5500/Frontend/User/home.html?token=${token}`
);

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Google users won't have a password
        if (!user.password) {
            return res.status(400).json({
                success: false,
                message: "This account uses Google Sign-In. Password cannot be changed."
            });
        }

        const isMatch = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect"
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);

        await user.save();

        res.json({
            success: true,
            message: "Password updated successfully"
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).json({
            success: true,
            user
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name, phone } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        if (name !== undefined) user.name = name;
        if (phone !== undefined) user.phone = phone;
        await user.save();
        
        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = {
    register,
    login,
    sendOtp,
    verifyOtp,
    resetPassword,
    googleCallback,
    changePassword,
    getProfile,
    updateProfile
};