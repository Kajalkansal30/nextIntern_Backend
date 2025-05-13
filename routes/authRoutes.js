// import express from "express";
// // import { registerUser, verifyEmail } from "../controllers/authController.js";
// import { signup } from "../controllers/authController.js";

// const router = express.Router();

// // User Signup & Email Verification
// router.post("/signup", signup);
// // router.get("/verify-email", verifyEmail);

// export default router;

import express from "express";
import { check } from "express-validator";
import { registerUser } from "../controllers/authController.js";

const router = express.Router();

// Input validation middleware
const validateSignup = [
    check("fullname").notEmpty().withMessage("Full name is required"),
    check("email").isEmail().withMessage("Invalid email format"),
    check("phoneNumber").isMobilePhone().withMessage("Invalid phone number"),
    check("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
];

router.post("/register", validateSignup, registerUser);

export default router;

