import express from "express";
import multer from "multer";
import { protectRoute } from "../middleware/protectRoute.js";
import { getDoctors, getPatients, updateProfile, uploadAvatar } from "../controllers/user.controller.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.get("/doctors", protectRoute, getDoctors);
router.get("/patients", protectRoute, getPatients);
router.put("/update-profile", protectRoute, updateProfile);
router.post("/upload-avatar", protectRoute, upload.single("avatar"), uploadAvatar);

export default router;
