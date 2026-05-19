import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useScheduleStore = create((set, get) => ({
  schedules: [],
  appointments: [],
  isLoadingSchedules: false,
  isLoadingAppointments: false,
  isUpdating: false,

  fetchSchedules: async (date) => {
    set({ isLoadingSchedules: true });
    try {
      const url = date ? `/schedule/doctor?date=${date}` : "/schedule/doctor";
      const res = await axiosInstance.get(url);
      set({ schedules: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch schedules");
    } finally {
      set({ isLoadingSchedules: false });
    }
  },

  fetchAppointments: async () => {
    set({ isLoadingAppointments: true });
    try {
      const res = await axiosInstance.get("/appointments");
      set({ appointments: res.data });
    } catch (error) {
      toast.error("Failed to fetch appointments");
    } finally {
      set({ isLoadingAppointments: false });
    }
  },

  createSlot: async (slotData) => {
    set({ isUpdating: true });
    try {
      const res = await axiosInstance.post("/schedule/create-slot", slotData);
      set((state) => ({ schedules: [...state.schedules, res.data] }));
      toast.success("Time slot created");
    } catch (error) {
      toast.error("Failed to create time slot");
    } finally {
      set({ isUpdating: false });
    }
  },

  deleteSlot: async (id) => {
    try {
      await axiosInstance.delete(`/schedule/delete-slot/${id}`);
      set((state) => ({
        schedules: state.schedules.filter((s) => s._id !== id),
      }));
      toast.success("Time slot removed");
    } catch (error) {
      toast.error("Failed to remove time slot");
    }
  },

  approveAppointment: async (id) => {
    try {
      const res = await axiosInstance.put(`/appointments/approve/${id}`);
      set((state) => ({
        appointments: state.appointments.map((apt) => 
          apt._id === id ? res.data : apt
        ),
      }));
      toast.success("Appointment approved");
    } catch (error) {
      toast.error("Failed to approve appointment");
    }
  },

  rejectAppointment: async (id) => {
    try {
      const res = await axiosInstance.put(`/appointments/reject/${id}`);
      set((state) => ({
        appointments: state.appointments.map((apt) => 
          apt._id === id ? res.data : apt
        ),
      }));
      toast.success("Appointment rejected");
    } catch (error) {
      toast.error("Failed to reject appointment");
    }
  },

  rescheduleAppointment: async (id, data) => {
    try {
      const res = await axiosInstance.put(`/appointments/reschedule/${id}`, data);
      set((state) => ({
        appointments: state.appointments.map((apt) => 
          apt._id === id ? res.data : apt
        ),
      }));
      toast.success("Appointment rescheduled");
      return true;
    } catch (error) {
      toast.error("Failed to reschedule appointment");
      return false;
    }
  },

  completeAppointment: async (id) => {
    try {
      const res = await axiosInstance.put(`/appointments/complete/${id}`);
      set((state) => ({
        appointments: state.appointments.map((apt) => 
          apt._id === id ? res.data : apt
        ),
      }));
      toast.success("Appointment marked as completed");
    } catch (error) {
      toast.error("Failed to complete appointment");
    }
  },
}));
