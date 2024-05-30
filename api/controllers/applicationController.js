import { errorHandler } from "../utils/error.js";
import Application from "../models/applicationModel.js";
import Job from "../models/jobModel.js";
import PlacementRecord from "../models/placementRecordModel.js";
import User from "../models/userModel.js";

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
  if (!req.user.isAdmin && req.user.id !== req.params.employerId) {
    return next(
      errorHandler(403, "You are not allowed to update this application")
    );
  }
  try {
    const application = await Application.findById(req.params.applicationId);
    if (!application) {
      return next(errorHandler(404, "Application not found"));
    }
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return next(errorHandler(404, "Job not found"));
    }
    if (job.postedBy.toString() !== req.params.employerId) {
      return next(
        errorHandler(403, "You are not allowed to update this application")
      );
    }
    const applicant = await User.findById(req.params.applicantId);
    if (!applicant) {
      return next(errorHandler(404, "Applicant not found"));
    }
    const employer = await User.findById(req.params.employerId);
    if (!employer) {
      return next(errorHandler(404, "Employer not found"));
    }
    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.applicationId,
      { applicationStatus: req.body.applicationStatus },
      { new: true }
    );
    if (req.body.applicationStatus === "Accepted") {
      await Job.findByIdAndUpdate(req.body.jobId, {
        $push: { acceptedApplicants: req.params.applicationId },
      });
      const existingRecord = await PlacementRecord.findOne({
        applicationId: req.params.applicationId,
      });
      if (existingRecord) {
        // Handle the case where a PlacementRecord with the given applicationId already exists
        // For example, you can return an error
        return res.status(400).json({
          error: "A PlacementRecord with this applicationId already exists",
        });
      } else {
        const newPlacementRecord = new PlacementRecord({
          jobId: req.params.jobId,
          applicationId: req.params.applicationId,
          employerId: req.params.employerId,
          status: "pending",
          applicantId: req.params.applicantId,
          applicantName: applicant.username,
          applicantEmail: applicant.email,
          jobTitle: job.jobTitle,
          companyName: job.companyName,
          employerName: employer.username,
          jobCategory: job.jobCategory,
        });
        await newPlacementRecord.save();
        // add this placement record to the user's schema
        await User.findOneAndUpdate(
          { _id: req.params.applicantId },
          { $push: { placementRecords: newPlacementRecord._id } },
          { new: true, useFindAndModify: false }
        );
      }
    } else if (req.body.applicationStatus === "Rejected") {
      await Job.findByIdAndUpdate(req.body.jobId, {
        $push: { rejectedApplicants: req.params.applicationId },
      });

      const updatedUser = await User.findOneAndUpdate(
        { _id: req.params.applicantId },
        { $pull: { placementRecords: req.params.applicationId } },
        { new: true, useFindAndModify: false }
      );
      if (!updatedUser) {
        return next(errorHandler(404, "User not found"));
      }
      // delete the record from placement record
      await PlacementRecord.findOneAndDelete({
        applicationId: req.params.applicationId,
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

export const getPlacedStudents = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort == "asc" ? 1 : -1;
    const placementRecords = await PlacementRecord.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    const totalPlacedStudents = await PlacementRecord.countDocuments({});

    res.json({ placementRecords, totalPlacedStudents });
  } catch (error) {
    next(error);
  }
};
