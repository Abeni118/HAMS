import express from "express";
import multer from "multer";
import { protectRoute } from "../middleware/protectRoute.js";
import { 
  getPatientReports, 
  getReportById, 
  downloadReport,
  getDoctorReports,
  createReport,
  updateReport,
  deleteReport,
  uploadReportFile
} from "../controllers/report.controller.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Patient Routes
router.get("/patient", protectRoute, getPatientReports);
router.get("/download/:id", protectRoute, downloadReport);

// Doctor Routes
router.get("/doctor", protectRoute, getDoctorReports);
router.post("/create", protectRoute, createReport);
router.put("/update/:id", protectRoute, updateReport);
router.delete("/delete/:id", protectRoute, deleteReport);
router.post("/upload-files", protectRoute, upload.single("file"), uploadReportFile);

// Shared Route (Keep at bottom to prevent capturing specific paths)
router.get("/:id", protectRoute, getReportById);

export default router;
