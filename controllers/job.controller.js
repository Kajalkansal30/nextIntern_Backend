import { Job } from "../models/job.model.js";

// admin post krega job
export const postJob = async (req, res) => {
    try {
        const { title, description, skills, duration, jobMode, location, noOfOpening, jobType, startDate, responsibilities, requirements, salary, ppOffer, stipendType, perks, availability, questions, alternateMobileNo, companyId } = req.body;
        const userId = req.id;
        console.log("Job data received:");
        console.log({
            title,
            description,
            skills,
            duration,
            location,
            jobMode,
            noOfOpening,
            jobType,
            startDate,
            responsibilities,
            requirements,
            salary,
            ppOffer,
            stipendType,
            perks,
            availability,
            questions,
            alternateMobileNo,
            created_by: req.user?._id,
            company: req.user?.company?._id,
        });

        if (!title || !description || !skills || !location || !duration || !jobMode || !noOfOpening || !jobType || !startDate || !responsibilities || !requirements || !salary || !ppOffer || !stipendType || !perks || !availability) {
            return res.status(400).json({
                message: "Something is missing.",
                success: false
            })
        };
        const job = await Job.create({
            title,
            description,
            skills: Array.isArray(skills) ? skills : skills.split(","),
            duration: Number(duration),
            jobMode,
            noOfOpening,
            jobType,
            startDate,
            location,
            responsibilities,
            requirements,
            salary,
            ppOffer,
            stipendType,
            perks: Array.isArray(perks) ? perks : perks.split(","),
            availability,
            questions,
            alternateMobileNo,
            company: req.user.company._id,
            created_by: userId
        });
        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
}
// student k liye
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const regex = new RegExp(keyword, "i");

        const jobs = await Job.aggregate([
            {
                $lookup: {
                    from: "companies",
                    localField: "company",
                    foreignField: "_id",
                    as: "company"
                }
            },
            { $unwind: "$company" },
            {
                $match: {
                    $or: [
                        { title: { $regex: regex } },
                        { description: { $regex: regex } },
                        { location: { $regex: regex } },
                        { "company.name": { $regex: regex } }
                    ]
                }
            },
            { $sort: { createdAt: -1 } }
        ]);

        if (!jobs || jobs.length === 0) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            });
        }

        return res.status(200).json({
            jobs,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
}
// student
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path: "applications"
        }).populate({
            path: "company",
            select: "name" // Fetch only the company name
        });
        // const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
}
// admin kitne job create kra hai abhi tk
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId })
            .populate('company')
            .populate('applications');  // Populate applications to get applicants count

        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
}
// export const updateJobById = async (req, res) => {
//     try {
//         const jobId = req.params.id;
//         console.log("Updating job with ID:", jobId);

//         const updatedJob = await Job.findByIdAndUpdate(jobId, req.body, { new: true });

//         if (!updatedJob) {
//             return res.status(404).json({ message: "Job not found.", success: false });
//         }

//         return res.status(200).json({ message: "Job updated successfully.", success: true, updatedJob });
//     } catch (error) {
//         console.error("Error updating job:", error);
//         return res.status(500).json({ message: "Server error", success: false });
//     }
// };
export const updateJobById = async (req, res) => {
    try {
        const { title,
            description,
            skills,
            duration,
            jobMode,
            noOfOpening,
            jobType,
            startDate,
            location,
            responsibilities,
            requirements,
            salary,
            ppOffer,
            stipendType,
            perks,
            availability,
            questions,
            alternateMobileNo } = req.body;
        const jobId = req.params.id;

        // Validate ObjectId format
        if (!jobId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid job ID format.", success: false });
        }

        let job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found.", success: false });
        }

        // Authorization check: only creator can update
        if (job.created_by.toString() !== req.id) {
            return res.status(403).json({ message: "Unauthorized to update this job.", success: false });
        }

        // Validate required fields (example: title, description)
        if (!title || !description) {
            return res.status(400).json({ message: "Title and description are required.", success: false });
        }

        // Update fields
        job.title = title;
        job.description = description;
        job.skills = skills || job.skills;
        job.duration = duration || job.duration;
        job.jobMode = jobMode || job.jobMode;
        job.noOfOpening = noOfOpening || job.noOfOpening;
        job.jobType = jobType || job.jobType;
        job.startDate = startDate || job.startDate;
        job.location = location || job.location;
        job.responsibilities = responsibilities || job.responsibilities;
        job.requirements = requirements || job.requirements;
        job.salary = salary || job.salary;
        job.ppOffer = ppOffer || job.ppOffer;
        job.stipendType = stipendType || job.stipendType;
        job.perks = perks || job.perks;
        job.availability = availability || job.availability;
        job.questions = questions || job.questions;
        job.alternateMobileNo = alternateMobileNo || job.alternateMobileNo;

        const savedJob = await job.save();

        return res.status(200).json({ message: "Job updated successfully.", success: true, job: savedJob });
    } catch (error) {
        console.error("Error updating job:", error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};

