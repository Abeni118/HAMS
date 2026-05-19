import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { 
  createConsultation, 
  updateConsultation, 
  deleteConsultation 
} from "../controllers/consultation.controller.js";

const router = express.Router();

router.post("/create", protectRoute, createConsultation);
router.put("/update/:id", protectRoute, updateConsultation);
router.delete("/delete/:id", protectRoute, deleteConsultation);

export default router;
