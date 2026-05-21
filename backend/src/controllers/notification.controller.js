import Notification from "../models/notification.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const createNotification = async ({ userId, title, message, type, relatedEntityId, relatedEntityType, role, priority }) => {
  try {
    const notification = new Notification({
      userId,
      title,
      message,
      type,
      relatedEntityId,
      relatedEntityType,
      role,
      priority,
    });
    
    await notification.save();

    // Send real-time notification
    const receiverSocketId = getReceiverSocketId(userId.toString());
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newNotification", notification);
    }
    
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error in getNotifications:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({ userId: req.user._id, read: false });
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error in getUnreadCount:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json(notification);
  } catch (error) {
    console.error("Error in markAsRead:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user._id, read: false }, { read: true });
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error in markAllAsRead:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findOneAndDelete({ _id: id, userId: req.user._id });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error in deleteNotification:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
