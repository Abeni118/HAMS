import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { 
  getDoctorPatients, 
  getPatientDetails, 
  getPatientHistory, 
  getPatientReports 
} from "../controllers/patient.controller.js";

const router = express.Router();

router.get("/", protectRoute, getDoctorPatients);
router.get("/:id", protectRoute, getPatientDetails);
router.get("/:id/history", protectRoute, getPatientHistory);
router.get("/:id/reports", protectRoute, getPatientReports);

export default router;
