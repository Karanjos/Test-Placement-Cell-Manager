import mongoose from "mongoose";

const placementRecordSchema = new mongoose.Schema(
  {
    jobId: {
      type: String,
      required: true,
    },
    applicationId: {
      type: String,
      required: true,
    },
    employerId: {
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
