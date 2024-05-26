import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { getApplications } from "../controllers/applicationController.js";

const router = express.Router();

router.get("/getapplications", verifyToken, getApplications);

export default router;
