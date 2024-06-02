import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createJob,
  deleteJob,
  getPostedJobsByEmployer,
  getjobs,
  updateJob,
} from "../controllers/jobController.js";
import {
  getAppliedJobs,
  postApplication,
} from "../controllers/applicationController.js";

const router = express.Router();

router.post("/create", verifyToken, createJob);
router.get("/getjobs", getjobs);
router.delete("/deletejob/:jobId/:postedBy", verifyToken, deleteJob);
router.put("/updatejob/:jobId/:postedBy", verifyToken, updateJob);
router.post("/apply/:jobId", verifyToken, postApplication);
router.get("/appliedjobs/:applicantId", verifyToken, getAppliedJobs);
router.get("/getpostedjobs/:postedBy", verifyToken, getPostedJobsByEmployer);

export default router;
