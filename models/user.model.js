import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    designation: {
        type: String,
        default: ''
      },
    phoneNumber: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    reconfirmPassword: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        enum: ['student', 'recruiter'],
        required: true
    },
    profile: {
        bio: { type: String, default: "" },
        skills: [{ type: String, default: "" }],
        pdfUrl: { type: String, default: "" }, // URL to resume file
        videoUrl: { type: String, default: "" }, //  ADD this
        pdfOriginalName: { type: String, default: "" },
        videoOriginalName: { type: String, default: "" }, //  ADD this
        company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', default: null },
        profilePhoto: {
            type: String,
            default: ""
        }
    },
}, { timestamps: true });


export const User = mongoose.model('User', userSchema);