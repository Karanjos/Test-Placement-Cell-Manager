import { errorHandler } from "../utils/error.js";
import Application from "../models/applicationModel.js";
import Job from "../models/jobModel.js";

export const postApplication = async (req, res, next) => {
  const {
    applicantName,
    applicantEmail,
    applicantPhone,
    applicantResume,
    applicantCoverLetter,
  } = req.body.formData;
  const { applicantId, jobId } = req.body;

  const job = await Job.findById(jobId);
  if (!job) {
    return next(errorHandler(404, "Job not found"));
  }
  if (job.postedBy.toString() === applicantId.toString()) {
    return next(errorHandler(403, "You cannot apply for your own job"));
  }
  const employerId = job.postedBy;
  if (!employerId) {
    return next(errorHandler(404, "Employer not found"));
  }
  if (
    !applicantName ||
    !applicantEmail ||
    !applicantPhone ||
    !applicantResume
  ) {
    return next(errorHandler(400, "Please provide all the required fields"));
  }
  if (await Application.findOne({ jobId, applicantId })) {
    return next(errorHandler(400, "You have already applied for this job"));
  }
  const newApplication = new Application({
    applicantName,
    applicantId,
    applicantEmail,
    applicantPhone,
    applicantResume,
    applicantCoverLetter,
    employerId,
    jobId,
  });
  try {
    const savedApplication = await newApplication.save();
    res.status(200).json(savedApplication);
  } catch (error) {
    next(error);
  }
};

export const getApplications = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort == "asc" ? 1 : -1;
    const applications = await Application.find({
      ...(req.query.applicantId && { applicantId: req.query.applicantId }),
      ...(req.query.jobId && { jobId: req.query.jobId }),
    })
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    const totalApplications = await Application.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthApplications = await Application.countDocuments({
      createdAt: { $gte: oneMonthAgo, $lt: now },
    });
    res.json({ applications, totalApplications, lastMonthApplications });
  } catch (error) {
    next(error);
  }
};
