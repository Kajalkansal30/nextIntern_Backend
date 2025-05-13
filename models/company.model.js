import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
    },
    practitioner: {
        type: Boolean,
    },
    city: {
        type: String
    },
    industry: {
        type: String,
        enum: ['IT', 'Healthcare', 'Finance', 'Education', 'Others'],
    },
    employeeNumber: {
        type: String // Number of employees
    },
    logoUrl: {
        type: String,
        // required: true,
    },
    verifiedDocUrl: {
        type: String,
        // required: true,
    },

    reqDoc: {
        type: Boolean
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

export const Company = mongoose.model("Company", companySchema);





// import mongoose from "mongoose";

// const companySchema = new mongoose.Schema({
//     name:{
//         type:String,
//         required:true,
//         unique:true
//     },
//     description:{
//         type:String,
//     },
//     website:{
//         type:String
//     },
//     location:{
//         type:String
//     },
//     logo:{
//         type:String // URL to company logo
//     },
//     userId:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:'User',
//         required:true
//     }
// },{timestamps:true})
// export const Company = mongoose.model("Company", companySchema);

