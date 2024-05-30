import mongoose from "mongoose";

const placementRecordSchema = new mongoose.Schema(
  {
    applicantId: {
      type: String,
      required: true,
    },
    applicantName: {
      type: String,
      required: true,
    },
    applicantEmail: {
      type: String,
      required: true,
    },
    jobId: {
      type: String,
      required: true,
      unique: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    applicationId: {
      type: String,
      required: true,
      unique: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    employerId: {
      type: String,
      required: true,
    },
    employerName: {
      type: String,
      required: true,
    },
    jobCategory: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
    },
  },
  { timestamps: true }
);

const PlacementRecord = mongoose.model(
  "PlacementRecord",
  placementRecordSchema
);

export default PlacementRecord;
