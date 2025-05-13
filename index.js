import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import { multipleUpload } from "./middlewares/multer.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Middleware for parsing cookies

// Dynamically set allowed origins based on environment
const allowedOrigins = [
    'http://localhost:5173', // Local development
    'https://next-internn-frontend.vercel.app', // Production frontend
];

// CORS configuration
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true); // Allow request
        } else {
            callback(new Error("Not allowed by CORS")); // Reject request
        }
    },
    credentials: true, // Allow cookies and credentials
};

app.use(cors(corsOptions)); // Apply CORS middleware

// Connect to MongoDB
connectDB()
    .then(() => {
        console.log("✅ MongoDB Connected");
        app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
    })
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Root API route
app.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to the Backend API" });
});

// API routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

// 404 Error handler for undefined routes
app.use((req, res, next) => {
    res.status(404).json({ message: "Route not found" });
});

// General error handler
app.use((err, req, res, next) => {
    console.error("Error:", err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});
