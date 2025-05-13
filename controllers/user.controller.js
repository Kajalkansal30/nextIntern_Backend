import { User } from "../models/user.model.js";
import { Company } from "../models/company.model.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../utils/cloudinary.js";
import { getDataUri } from "../utils/datauri.js";

export const register = async (req, res) => {
    try {
        console.log("Register Endpoint Hit"); // Debugging step
        console.log("Request Body:", req.body); // Check request payload

        const { firstname, lastname, email, phoneNumber, password, reconfirmPassword, role } = req.body;

        if (!firstname || !lastname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        const file = req.files?.image?.[0]; // image field for profile pic
        if (!file) return res.status(400).json({ message: "Profile photo is required", success: false });

        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        // const file = req.file;
        // const fileUri = getDataUri(file);
        // const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                message: 'User already exists with this email.',
                success: false,
            })
        }


        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            firstname,
            lastname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {
                profilePhoto: cloudResponse.secure_url,
            }
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true,
            user: newUser
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

export const login = async (req, res) => {
    try {
        console.log("Request Body:", req.body); // Debugging step
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "User does not exist.",
                success: false,
            });
        }
        let company = await Company.findOne({ userId: user._id })
        if (!company) {
            console.log("No company for the user");
        }
        else {
            user.companyId = company._id;
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect password.",
                success: false,
            });
        }

        // Check if the role matches
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with the selected role.",
                success: false
            });
        }

        const tokenData = { userId: user._id };
        const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        // user = {
        //     _id: user._id,
        //     firstname: user.firstname,
        //     lastname: user.lastname,
        //     email: user.email,
        //     phoneNumber: user.phoneNumber,
        //     role: user.role,
        //     profile: user.profile,
        // };
        // function getNextPage(user) {
        //     if (!user.personalDetailsFilled) return "/personal-details";
        //     if (!user.companyCreated) return "/create-company";
        //     if (!user.companySetupCompleted) return "/company-setup";
        //     if (!user.jobPosted) return "/post-job";
        //     return "/main";
        //   }
        let step; 

        if (user.role === "recruiter") {
            const isPersonalDetailsFilled = (user) => {
                return (
                    user.firstname?.trim() &&
                    user.lastname?.trim() &&
                    user.email?.trim() &&
                    user.phoneNumber?.trim() &&
                    user.designation?.trim()
                );
            };
            const isCompanyCreated = (company) => {
                return company && Object.keys(company).length > 0;
            };

            const isCompanySetupCompleted = (companyId) => {
                return (
                    companyId?.name?.trim() &&
                    companyId?.description?.trim() &&
                    companyId?.city?.trim() &&
                    companyId?.industry?.trim() &&
                    companyId?.employeeNumber?.trim()
                );
            };
            // const isJobPostedCompleted = async (companyId) => {
            //     const job = await Job.findOne({ companyId });
            //     return job ? true : false;
            // };
            const getNextPage = async (user, company) => {
                if (!isPersonalDetailsFilled(user)) return "AdminProfile1";
                if (!isCompanyCreated(company)) return "CompanyCreate";
                if (!isCompanySetupCompleted(company)) return "CompanySetup";
                return "AdminJobs";
            };

            console.log(" User::::::: ", user, " Company::::::: ", company)
            step = await getNextPage(user, company);
            // const step = await getNextPage(user, company);
            // console.log(" Step::::: ", user.step)

        }
        return res.status(200).cookie("token", token, {
            maxAge: 1 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
        }).json({
            message: `Welcome back, ${user.firstname} ${user.lastname}`,
            user,
            step,
            company: company ? company : null,
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

export const updateProfile = async (req, res) => {
    try {

        const { firstname, lastname, email, phoneNumber, bio, skills, designation } = req.body;
        const userId = req.id; // Middleware authentication
        let user = await User.findById(userId);
        let pdfUrl = user.profile.pdfUrl;
        let pdfOriginalName = user.profile.pdfOriginalName;

        if (req.files?.pdf?.[0]) {
            const fileUri = getDataUri(req.files.pdf[0]);
            const uploadRes = await cloudinary.uploader.upload(fileUri.content, {
                resource_type: "raw", // Optional: ensures PDF uploads correctly
            });
            pdfUrl = uploadRes.secure_url;
            pdfOriginalName = req.files.pdf[0].originalname;
        }

        // Handle Video Upload
        let videoUrl = user.profile.videoUrl;
        let videoOriginalName = user.profile.videoOriginalName;

        if (req.files?.video?.[0]) {
            const fileUri = getDataUri(req.files.video[0]);
            const uploadRest = await cloudinary.uploader.upload(fileUri.content, {
                resource_type: "video",
            });
            videoUrl = uploadRest.secure_url;
            videoOriginalName = req.files.video[0].originalname;
        }


        let skillsArray = skills ? skills.split(",").map(skill => skill.trim()) : [];

        if (!user) {
            return res.status(400).json({ message: "User not found.", success: false });
        }

        console.log("User ID from middleware:", req.id);

        // Updating user profile
        if (firstname) user.firstname = firstname;
        if (lastname) user.lastname = lastname;
        // if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (skillsArray) user.profile.skills = skillsArray;
        if (user.role === 'recruiter' && designation) {
            user.designation = designation; // Update designation for recruiter
        }

        // Saving resume and video URLs
        if (pdfUrl) {
            user.profile.pdfUrl = pdfUrl;
            user.profile.pdfOriginalName = pdfOriginalName;


        }
        if (videoUrl) {
            user.profile.videoUrl = videoUrl;
            user.profile.videoOriginalName = videoOriginalName;
        }

        const savedUser = await user.save();
        console.log("PDF uploaded to:", pdfUrl);
        console.log("Video uploaded to:", videoUrl);


        user = {
            _id: user._id,
            firstname: savedUser.firstname,
            lastname: savedUser.lastname,
            email: savedUser.email,
            phoneNumber: savedUser.phoneNumber,
            role: savedUser.role,
            profile: savedUser.profile,
            designation: savedUser.designation,
        };

        return res.status(200).json({
            message: "Profile updated successfully.",
            user,
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};


