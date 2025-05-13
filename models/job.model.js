import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    skills: [{
        type: String,
        required:true
    }],
    duration: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    jobMode:{
        type:String,
        required:true,
    },
    noOfOpening: {
        type: Number,
        required: true
    },
    jobType: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    responsibilities: {
        type: String,
        required: true
    },
    requirements: {
        type: String,
        required: true
    },
    salary: {
        type: String,
        required: true
    },
    ppOffer:{
        type: Boolean,
        required: true
    },
    stipendType:{
        type:String,
        required:true,
    },
    perks: [String],
    availability: {
        type: String,
        required: true
    },
    questions: [String],
    alternateMobileNo: {
        type: String,
        match: /^[0-9]{10}$/,
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    },
    
    applications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Application',
        }
    ]
},{timestamps:true});
export const Job = mongoose.model("Job", jobSchema);