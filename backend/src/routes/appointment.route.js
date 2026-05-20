import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { 
  getAppointments, 
  createAppointment, 
  updateAppointmentStatus,
  approveAppointment,
  rejectAppointment,
  rescheduleAppointment,
  completeAppointment,
  getRecentPatientAppointments,
  getUpcomingPatientAppointments
} from "../controllers/appointment.controller.js";

const router = express.Router();

router.get("/", protectRoute, getAppointments);
router.post("/", protectRoute, createAppointment);
router.put("/:id/status", protectRoute, updateAppointmentStatus);

// Patient specific routes
router.get("/patient/recent", protectRoute, getRecentPatientAppointments);
router.get("/upcoming", protectRoute, getUpcomingPatientAppointments);

// Specific Status Action Routes
router.put("/approve/:id", protectRoute, approveAppointment);
router.put("/reject/:id", protectRoute, rejectAppointment);
router.put("/reschedule/:id", protectRoute, rescheduleAppointment);
router.put("/complete/:id", protectRoute, completeAppointment);

export default router;
