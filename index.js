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
app.use(express.json());  // Middleware to parse JSON
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
// middleware

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true
}

app.use(cors(corsOptions));



connectDB()
    .then(() => {
        console.log("✅ MongoDB Connected");
        app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
    })
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));
 

// api's
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
// console.log(`🚀 Server running on http://localhost:${PORT}`);
app.use((req, res, next) => {
    res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
    console.error("Error:", err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});

// app.listen(PORT,()=>{
//     connectDB();
//     console.log(`Server running at port ${PORT}`);
// })