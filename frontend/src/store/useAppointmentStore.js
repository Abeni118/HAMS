import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAppointmentStore = create((set, get) => ({
  appointments: [],
  doctors: [],
  selectedAppointment: null,
  isFetchingAppointments: false,
  isFetchingDoctors: false,
  isBooking: false,
  isUpdatingStatus: false,
  detailLoading: false,

  fetchAppointments: async () => {
    set({ isFetchingAppointments: true });
    try {
      const res = await axiosInstance.get("/appointments");
      set({ appointments: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch appointments");
    } finally {
      set({ isFetchingAppointments: false });
    }
  },

  fetchDoctors: async () => {
    set({ isFetchingDoctors: true });
    try {
      const res = await axiosInstance.get("/users/doctors");
      set({ doctors: res.data });
    } catch (error) {
      toast.error("Failed to fetch doctors");
    } finally {
      set({ isFetchingDoctors: false });
    }
  },

  bookAppointment: async (appointmentData) => {
    set({ isBooking: true });
    try {
      const res = await axiosInstance.post("/appointments", appointmentData);
      set((state) => ({ appointments: [...state.appointments, res.data] }));
      toast.success("Appointment booked successfully!");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to book appointment");
      return false;
    } finally {
      set({ isBooking: false });
    }
  },

  updateAppointmentStatus: async (appointmentId, status) => {
    set({ isUpdatingStatus: true });
    try {
      const res = await axiosInstance.put(`/appointments/${appointmentId}/status`, { status });
      set((state) => ({
        appointments: state.appointments.map((apt) =>
          apt._id === appointmentId ? { ...apt, status: res.data.status } : apt
        ),
      }));
      toast.success(`Appointment marked as ${status}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update appointment");
    } finally {
      set({ isUpdatingStatus: false });
    }
  },

  rescheduleAppointment: async (appointmentId, data) => {
    set({ isUpdatingStatus: true });
    try {
      const res = await axiosInstance.put(`/appointments/reschedule/${appointmentId}`, data);
      set((state) => ({
        appointments: state.appointments.map((apt) =>
          apt._id === appointmentId ? { ...apt, ...res.data } : apt
        ),
      }));
      toast.success("Appointment rescheduled successfully!");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reschedule appointment");
      return false;
    } finally {
      set({ isUpdatingStatus: false });
    }
  },

  fetchAppointmentDetail: async (appointmentId) => {
    set({ detailLoading: true, selectedAppointment: null });
    try {
      const res = await axiosInstance.get(`/appointments/${appointmentId}`);
      set({ selectedAppointment: res.data });
    } catch (error) {
      const status = error.response?.status;
      if (status === 404) toast.error("Appointment not found.");
      else if (status === 403) toast.error("Access denied.");
      else toast.error("Failed to load appointment details.");
    } finally {
      set({ detailLoading: false });
    }
  },

  clearSelectedAppointment: () => set({ selectedAppointment: null }),
}));
