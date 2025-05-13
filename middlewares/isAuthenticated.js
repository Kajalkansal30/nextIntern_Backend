import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Company } from "../models/company.model.js";

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false,
            })
        }
        const decode = jwt.verify(token, process.env.SECRET_KEY);
        if (!decode) {
            return res.status(401).json({
                message: "Invalid token",
                success: false
            })
        };
        // req.id = decode.id;
        const user = await User.findById(decode.userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }
        const company=await Company.findOne({userId:user._id})
        req.id = decode.userId;
        req.user = user; // ✅ Set user data on request
        req.user.company=company
        console.log("req.user:", req.user); // Optional: for debugging


        next();
    } catch (error) {
        console.error("❌ isAuthenticated error:", error.message);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
}
export default isAuthenticated;