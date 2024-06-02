import Job from "../models/jobModel.js";
import { errorHandler } from "../utils/error.js";

export const createJob = async (req, res, next) => {
  if (req.user.isAdmin || req.user.isEmployer) {
    const slug = req.body.jobTitle
      .toLowerCase()
      .split(" ")
      .join("-")
      .replace(/[^a-zA-Z0-9-]/g, "")
      .concat(`-${req.body.jobId}`);
    const newJob = new Job({
      ...req.body,
      slug,
      postedBy: req.user.id,
    });
    try {
      const savedJob = await newJob.save();
      res.status(201).json(savedJob);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(403, "You are not allowed to create a job!"));
  }
};

export const getjobs = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort == "asc" ? 1 : -1;
    const jobs = await Job.find({
      ...(req.query.postedBy && { postedBy: req.query.postedBy }),
      ...(req.query.jobCategory && { jobCategory: req.query.jobCategory }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.jobId && { _id: req.query.jobId }),
      ...(req.query.employmentType && {
        employmentType: req.query.employmentType,
      }),
      ...(req.query.jobLocation && { jobLocation: req.query.jobLocation }),
      ...(req.query.experienceLevel && {
        experienceLevel: req.query.experienceLevel,
      }),
      ...(req.query.skillsRequired && {
        skillsRequired: req.query.skillsRequired,
      }),
      ...(req.query.searchTerm && {
        $or: [
          { jobTitle: { $regex: req.query.searchTerm, $options: "i" } },
          { companyName: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    const totalJobs = await Job.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthJobs = await Job.countDocuments({
      createdAt: { $gte: oneMonthAgo, $lt: now },
    });

    res.status(200).json({ jobs, totalJobs, lastMonthJobs });
  } catch (error) {
    next(error);
  }
};

export const deleteJob = async (req, res, next) => {
  if (req.user.isAdmin || req.user.id === req.params.postedBy) {
    try {
      await Job.findByIdAndDelete(req.params.jobId);
      res.status(200).json("Job has been deleted");
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(403, "You are not allowed to delete this job"));
  }
};

export const updateJob = async (req, res, next) => {
  if (req.user.isAdmin || req.user.id === req.params.postedBy) {
    try {
      const updatedJob = await Job.findByIdAndUpdate(
        req.params.jobId,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedJob);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(403, "You are not allowed to update this job"));
  }
};

export const getPostedJobsByEmployer = async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 9;
  try {
    const jobs = await Job.find({ postedBy: req.params.postedBy }).limit(limit);
    res.status(200).json(jobs);
  } catch (error) {
    next(error);
  }
};
