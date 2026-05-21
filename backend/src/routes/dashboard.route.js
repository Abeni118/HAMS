import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getPatientDashboard, getDoctorDashboard } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/patient", protectRoute, getPatientDashboard);
router.get("/doctor", protectRoute, getDoctorDashboard);

export default router;
