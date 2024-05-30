import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  deleteApplication,
  getApplications,
  getApplication,
  updateApplication,
  updateApplicationStatus,
  getPlacedStudents,
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
  "/updatestatus/:applicantId/:applicationId/:jobId/:employerId",
  verifyToken,
  updateApplicationStatus
);
router.get("/placedstudents", verifyToken, getPlacedStudents);

export default router;
