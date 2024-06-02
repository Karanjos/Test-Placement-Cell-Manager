import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    applicantName: {
      type: String,
      required: true,
    },
    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applicantEmail: {
      type: String,
      required: true,
      unique: false,
    },
    applicantPhone: {
      type: String,
      required: true,
    },
    applicantResume: {
      type: String,
      required: true,
    },
    applicantCoverLetter: {
      type: String,
    },
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      unique: [true, "You have already applied for this job"],
    },
    applicationStatus: {
      type: String,
      default: "pending",
      enum: ["pending", "rejected", "accepted"],
    },
  },
  { timestamps: true }
);

const Application = mongoose.model("Application", applicationSchema);

export default Application;
