import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getSettings, updateSettings, changePassword, deleteAccount } from "../controllers/settings.controller.js";

const router = express.Router();

router.get("/", protectRoute, getSettings);
router.put("/update", protectRoute, updateSettings);
router.put("/change-password", protectRoute, changePassword);
router.delete("/delete-account", protectRoute, deleteAccount);

export default router;
