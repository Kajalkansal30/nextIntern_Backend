import {v2 as cloudinary} from "cloudinary";
import dotenv from "dotenv";
// import multer from "multer";
dotenv.config(); 

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
});

console.log("Cloudinary Config:", {
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY? "Exists" : "Not Found",
    api_secret: process.env.API_SECRET ? "Exists" : "Not Found"
});

export default cloudinary;