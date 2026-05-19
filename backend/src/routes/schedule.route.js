import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getDoctorSchedule, createSlot, updateSlot, deleteSlot } from "../controllers/schedule.controller.js";

const router = express.Router();

router.get("/doctor", protectRoute, getDoctorSchedule);
router.post("/create-slot", protectRoute, createSlot);
router.put("/update-slot/:id", protectRoute, updateSlot);
router.delete("/delete-slot/:id", protectRoute, deleteSlot);

export default router;
