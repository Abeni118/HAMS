import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  recordVitals,
  getPatientVitals,
  updateVitals,
  addToQueue,
  getQueue,
  updateQueueStatus,
  getNurseStats,
  addNurseNote,
  getNurseNotes
} from "../controllers/nurse.controller.js";

const router = express.Router();

// Apply protectRoute to all nurse routes
router.use(protectRoute);

// Vitals Routes
router.post("/vitals", recordVitals);
router.get("/vitals/:patientId", getPatientVitals);
router.put("/vitals/:id", updateVitals);

// Queue Routes
router.post("/queue", addToQueue);
router.get("/queue", getQueue);
router.put("/queue/:id/status", updateQueueStatus);

// Stats Route
router.get("/stats", getNurseStats);

// Notes Routes
router.post("/notes", addNurseNote);
router.get("/notes/:patientId", getNurseNotes);

export default router;
