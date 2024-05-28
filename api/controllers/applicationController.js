import { errorHandler } from "../utils/error.js";
import Application from "../models/applicationModel.js";
import Job from "../models/jobModel.js";
import PlacementRecord from "../models/placementRecord.js";

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
      ...(req.query.employerId && { employerId: req.query.employerId }),
      ...(req.query.applicationId && { _id: req.query.applicationId }),
      ...(req.query.applicationStatus && {
        applicationStatus: req.query.applicationStatus,
      }),
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

export const deleteApplication = async (req, res, next) => {
  if (
    !req.user.isAdmin &&
    req.user.id !== req.params.applicantId &&
    req.user.id !== req.params.employerId
  ) {
    return next(
      errorHandler(403, "You are not allowed to delete this application")
    );
  }
  try {
    await Application.findByIdAndDelete(req.params.applicationId);
    res.status(200).json("Application has been deleted");
  } catch (error) {
    next(error);
  }
};

export const updateApplication = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.applicantId) {
    return next(
      errorHandler(403, "You are not allowed to update this application")
    );
  }
  try {
    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.applicationId,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedApplication);
  } catch (error) {
    next(error);
  }
};

export const updateApplicationStatus = async (req, res, next) => {
  console.log("applicationStatus", req.body.applicationStatus);

  if (!req.user.isAdmin && req.user.id !== req.params.employerId) {
    return next(
      errorHandler(403, "You are not allowed to update this application")
    );
  }
  try {
    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.applicationId,
      { applicationStatus: req.body.applicationStatus },
      { new: true }
    );
    console.log("updatedApplication", updatedApplication);
    if (req.body.applicationStatus === "Accepted") {
      console.log("yaha aa gya hu m accepted m");
      await Job.findByIdAndUpdate(req.body.jobId, {
        $push: { acceptedApplicants: req.params.applicationId },
      });
      const newPlacementRecord = new PlacementRecord({
        jobId: req.params.jobId,
        applicationId: req.params.applicationId,
        employerId: req.params.employerId,
        status: "pending",
      });
      await newPlacementRecord.save();
      console.log("newPlacementRecord", newPlacementRecord);
      // add this placement record to the user's schema
      await User.findByIdAndUpdate(req.params.applicantId, {
        $push: { placementRecords: newPlacementRecord._id },
      });
    } else if (req.body.applicationStatus === "rejected") {
      console.log("yaha aa gya hu m rejected m");
      await Job.findByIdAndUpdate(req.body.jobId, {
        $push: { rejectedApplicants: req.params.applicationId },
      });
    }

    res.status(200).json(updatedApplication);
  } catch (error) {
    next(error);
  }
};

export const getApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.applicationId);
    if (!application) {
      return next(errorHandler(404, "Application not found"));
    }
    res.status(200).json(application);
  } catch (error) {
    next(error);
  }
};
