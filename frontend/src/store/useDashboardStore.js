import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useDashboardStore = create((set, get) => ({
  stats: null,
  recentAppointments: [],
  upcomingSchedule: [],
  isLoadingStats: false,
  isLoadingRecent: false,
  isLoadingUpcoming: false,

  fetchDashboardStats: async () => {
    set({ isLoadingStats: true });
    try {
      const res = await axiosInstance.get("/dashboard/patient");
      set({ stats: res.data });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to fetch stats");
    } finally {
      set({ isLoadingStats: false });
    }
  },

  fetchDoctorDashboardStats: async () => {
    set({ isLoadingStats: true });
    try {
      const res = await axiosInstance.get("/dashboard/doctor");
      set({ stats: res.data });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to fetch stats");
    } finally {
      set({ isLoadingStats: false });
    }
  },

  fetchRecentAppointments: async () => {
    set({ isLoadingRecent: true });
    try {
      const res = await axiosInstance.get("/appointments/patient/recent");
      set({ recentAppointments: res.data });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to fetch recent appointments");
    } finally {
      set({ isLoadingRecent: false });
    }
  },

  fetchUpcomingSchedule: async () => {
    set({ isLoadingUpcoming: true });
    try {
      const res = await axiosInstance.get("/appointments/upcoming");
      set({ upcomingSchedule: res.data });
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch upcoming schedule");
    } finally {
      set({ isLoadingUpcoming: false });
    }
  },

  fetchAll: async () => {
    const { fetchDashboardStats, fetchRecentAppointments, fetchUpcomingSchedule } = get();
    await Promise.all([
      fetchDashboardStats(),
      fetchRecentAppointments(),
      fetchUpcomingSchedule()
    ]);
  }
}));
