// import { User } from "../models/user.model.js";
// import nodemailer from "nodemailer";

// // ✅ User Registration & Send Email
// export const registerUser = async (req, res) => {
//     try {
//         const { fullname, email, phoneNumber, password, role } = req.body;

//         // Check if user already exists
//         const existingUser = await User.findOne({ email });
//         if (existingUser) return res.status(400).json({ message: "Email already exists" });

//         // Create new user
//         const newUser = new User({ fullname, email, phoneNumber, password, role });
//         const token = newUser.generateVerificationToken();
//         await newUser.save();

//         // ✅ Send Verification Email
//         const transporter = nodemailer.createTransport({
//             service: "gmail",
//             auth: { user: "your-email@gmail.com", pass: "your-email-password" }
//         });

//         const mailOptions = {
//             from: "your-email@gmail.com",
//             to: email,
//             subject: "Verify Your Email",
//             text: `Click this link to verify your email: http://localhost:8000/api/auth/verify-email?token=${token}`
//         };

//         await transporter.sendMail(mailOptions);
//         res.status(201).json({ message: "User registered! Please check your email for verification." });

//     } catch (error) {
//         res.status(500).json({ message: "Internal server error", error });
//     }
// };

// // ✅ Email Verification Logic
// export const verifyEmail = async (req, res) => {
//     try {
//         const { token } = req.query;
//         const user = await User.findOne({ verificationToken: token });

//         if (!user) return res.status(400).json({ message: "Invalid or expired token" });

//         user.isVerified = true;
//         user.verificationToken = null;
//         await user.save();

//         res.json({ message: "Email successfully verified! You can now log in." });

//     } catch (error) {
//         res.status(500).json({ message: "Internal server error", error });
//     }
// };

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { User } from "../models/user.model.js";

export const registerUser = async (req, res) => {
    try {
        console.log("🟢 Received Request:", req.body); // ✅ Log request body

        // Validate request body using express-validator
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log("🔴 Validation Errors:", errors.array()); // ✅ Log validation errors
            return res.status(400).json({ errors: errors.array() });
        }

        const { firstname,lastname, email, phoneNumber, password,reconfirmPassword, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("🔴 Email already exists:", email); // ✅ Log duplicate email
            return res.status(409).json({ message: "Email already exists" });
        }

        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const hashedreconfirmPassword = await bcrypt.hash(reconfirmPassword, salt);

        const newUser = new User({ firstname,lastname, email, phoneNumber, password: hashedPassword,reconfirmPassword:hashedreconfirmPassword, role });
        await newUser.save();
        console.log("✅ User Registered:", newUser); // ✅ Log success

        // Generate JWT token
        const token = jwt.sign({ id: newUser._id, role: newUser.role },  process.env.SECRET_KEY, {
            expiresIn: "7d",
        });

        res.status(201).json({
            message: "User registered successfully!",
            token,
            user: { id: newUser._id, firstname: newUser.firstname, lastname:newUser.lastname, email: newUser.email, role: newUser.role },
        });

    } catch (error) {
        console.error("❌ Internal Server Error:", error.message); // ✅ Log errors
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

