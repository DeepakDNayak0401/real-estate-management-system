import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";


//Register User

export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit token   
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            isApproved: role === "seller" ? false : true, // Sellers need approval
            verificationToken
        });
        await user.save();

        try {
            await sendEmail({
                email: user.email,
                subject: "Account Verification - Real Estate Platform",
                message: `
                    <h2>Welcome to Real Estate Platform</h2>
                    <p>Thank you for registering.</p>
                    <p><strong>Verification Code:</strong> ${verificationToken}</p>
                    <p>This code will expire in 15 minutes.</p>
                `
            });
        } catch (error) {
            console.error("Error sending verification email:", error);
            return res.status(500).json({ message: "Could not send verification email", success: false });
        }
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isApproved: user.isApproved,
                isVerified: user.isVerified
            },
            success: true
        });
    } catch (err) {
        res.status(500).json({ message: err.message, success: false });
    }
};

//login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.isVerified) {
            return res.status(403).json({ message: "Email not verified. Please verify your email before logging in." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        if (user.isBlocked) {
            return res.status(403).json({ message: "Your account has been blocked. Please contact support." });
        }

        //token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );


        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isApproved: user.isApproved,
                isVerified: user.isVerified
            },
            token,
            success: true
        });
    } catch (err) {
        res.status(500).json({ message: err.message, success: false });
    }
};

//to get profile
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }
        res.status(200).json({ user, success: true });
    } catch (err) {
        res.status(500).json({ message: err.message, success: false });
    }
};

//verify the email
export const verifyEmail = async (req, res) => {
    try {
        const { email, code } = req.body;
        if (!email || !code) {
            return res.status(400).json({ message: "Email and verification code are required", success: false });
        }
        const user = await User.findOne({ email, verificationToken: code });
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired verification token", success: false });
        }
        if (user.isVerified) {
            return res.status(400).json({ message: "Email is already verified", success: false });
        }
        if (user.verificationToken !== code) {
            return res.status(400).json({ message: "Invalid verification code", success: false });
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();
        res.status(200).json({ message: "Email verified successfully", success: true });
    } catch (err) {
        res.status(500).json({ message: err.message, success: false });
    }
};

// Forgot Password
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "No user found with that email address" });
        }

        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 mins

        user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        user.resetPasswordExpire = resetPasswordExpire;
        await user.save();

        const clientUrl = "http://localhost:5173";
        const resetUrl = `${clientUrl}/reset-password/${resetToken}`;
        const message = `
            <h2>Password Reset Request</h2>
            <p>You requested a password reset. Please click on the link below to reset your password:</p>
            <a href="${resetUrl}" clicktracking="off">${resetUrl}</a>
            <p>This link will expire in 15 minutes.</p>
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: "Password Reset - Real Estate Platform",
                message,
            });
            res.status(200).json({ message: "Password reset email sent", success: true });
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            return res.status(500).json({ message: "Could not send email", success: false });
        }
    } catch (err) {
        res.status(500).json({ message: err.message, success: false });
    }
};


export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        if (!token || !newPassword) {
            return res.status(400).json({ message: "Token and new password are required", success: false });
        }
        const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpires: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired password reset token", success: false });
        }
        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.status(200).json({ message: "Password reset successful", success: true });
    } catch (err) {
        res.status(500).json({ message: err.message, success: false });
    }
}