import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getPatientDashboard } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/patient", protectRoute, getPatientDashboard);

export default router;
