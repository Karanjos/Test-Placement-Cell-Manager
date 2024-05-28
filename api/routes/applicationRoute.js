import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  deleteApplication,
  getApplications,
  getApplication,
  updateApplication,
  updateApplicationStatus,
} from "../controllers/applicationController.js";

const router = express.Router();

router.get("/getapplications", verifyToken, getApplications);
router.get("/getapplications/:applicationId", verifyToken, getApplication);
router.delete(
  "/delete/:applicationId/:applicantId/:employerId",
  verifyToken,
  deleteApplication
);
router.put("/update/:applicationId", verifyToken, updateApplication);
router.put(
  "/updatestatus/:applicationId/:jobId/:applicantId/:employerId",
  verifyToken,
  updateApplicationStatus
);

export default router;
