import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead, deleteNotification } from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", protectRoute, getNotifications);
router.get("/unread-count", protectRoute, getUnreadCount);
router.put("/read-all", protectRoute, markAllAsRead);
router.put("/read/:id", protectRoute, markAsRead);
router.delete("/delete/:id", protectRoute, deleteNotification);

export default router;
