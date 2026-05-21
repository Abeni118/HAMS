import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { useAuthStore } from "./useAuthStore";

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoadingNotifications: false,
  socket: null,

  connectSocket: () => {
    const { authUser } = useAuthStore.getState();
    if (!authUser || get().socket?.connected) return;

    const socket = io(SOCKET_URL, {
      query: {
        userId: authUser._id,
      },
    });

    socket.connect();

    socket.on("newNotification", (notification) => {
      set((state) => ({
        notifications: [notification, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      }));
      
      // Optional: show a small toast for urgent priority
      if (notification.priority === "urgent") {
        toast.error(`URGENT: ${notification.title}`, { duration: 5000 });
      } else {
        toast.success(notification.title, { icon: '🔔' });
      }
    });

    set({ socket });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) {
      get().socket.disconnect();
      set({ socket: null });
    }
  },

  fetchNotifications: async () => {
    set({ isLoadingNotifications: true });
    try {
      const res = await axiosInstance.get("/notifications");
      set({ notifications: res.data });
      get().fetchUnreadCount();
    } catch (error) {
      console.error(error);
    } finally {
      set({ isLoadingNotifications: false });
    }
  },

  fetchUnreadCount: async () => {
    try {
      const res = await axiosInstance.get("/notifications/unread-count");
      set({ unreadCount: res.data.count });
    } catch (error) {
      console.error(error);
    }
  },

  markAsRead: async (id) => {
    try {
      await axiosInstance.put(`/notifications/read/${id}`);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n._id === id ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (error) {
      console.error(error);
      toast.error("Failed to mark as read");
    }
  },

  markAllAsRead: async () => {
    try {
      await axiosInstance.put(`/notifications/read-all`);
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0,
      }));
    } catch (error) {
      console.error(error);
      toast.error("Failed to mark all as read");
    }
  },

  deleteNotification: async (id) => {
    try {
      await axiosInstance.delete(`/notifications/delete/${id}`);
      set((state) => {
        const notif = state.notifications.find(n => n._id === id);
        return {
          notifications: state.notifications.filter((n) => n._id !== id),
          unreadCount: notif && !notif.read ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
        };
      });
      toast.success("Notification deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete notification");
    }
  },
}));
