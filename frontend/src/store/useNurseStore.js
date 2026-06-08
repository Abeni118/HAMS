import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useNurseStore = create((set, get) => ({
  stats: null,
  patientQueue: [],
  vitals: [],
  nurseNotes: [],
  isFetchingStats: false,
  isFetchingQueue: false,
  isFetchingVitals: false,
  isFetchingNotes: false,
  isRecordingVitals: false,
  isUpdatingQueue: false,
  patients: [],
  isFetchingPatients: false,

  fetchPatients: async () => {
    set({ isFetchingPatients: true });
    try {
      console.log("Fetching patients from /users/patients...");
      const res = await axiosInstance.get("/users/patients");
      console.log("API Response Status:", res.status);
      console.log("API Response Data:", res.data);
      console.log("Number of patients fetched:", res.data?.length || 0);
      set({ patients: res.data || [] });
    } catch (error) {
      console.error("Error fetching patients (API failure):", error);
      console.error("Response data:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to fetch patients");
      set({ patients: [] });
    } finally {
      set({ isFetchingPatients: false });
    }
  },

  fetchStats: async () => {
    set({ isFetchingStats: true });
    try {
      const res = await axiosInstance.get("/nurse/stats");
      set({ stats: res.data });
    } catch (error) {
      console.error("Error fetching nurse stats:", error);
      toast.error(error.response?.data?.message || "Failed to fetch stats");
    } finally {
      set({ isFetchingStats: false });
    }
  },

  fetchQueue: async () => {
    set({ isFetchingQueue: true });
    try {
      const res = await axiosInstance.get("/nurse/queue");
      set({ patientQueue: res.data });
    } catch (error) {
      console.error("Error fetching patient queue:", error);
      toast.error(error.response?.data?.message || "Failed to fetch patient queue");
    } finally {
      set({ isFetchingQueue: false });
    }
  },

  updateQueueStatus: async (id, status) => {
    set({ isUpdatingQueue: true });
    try {
      const res = await axiosInstance.put(`/nurse/queue/${id}/status`, { status });
      set((state) => ({
        patientQueue: state.patientQueue.map((entry) =>
          entry._id === id ? res.data : entry
        ),
      }));
      toast.success("Queue status updated");
    } catch (error) {
      console.error("Error updating queue status:", error);
      toast.error(error.response?.data?.message || "Failed to update queue status");
    } finally {
      set({ isUpdatingQueue: false });
    }
  },

  addToQueue: async (data) => {
    try {
      const res = await axiosInstance.post("/nurse/queue", data);
      set((state) => ({ patientQueue: [...state.patientQueue, res.data] }));
      toast.success("Added to queue");
    } catch (error) {
      console.error("Error adding to queue:", error);
      toast.error(error.response?.data?.message || "Failed to add to queue");
    }
  },

  recordVitals: async (data) => {
    set({ isRecordingVitals: true });
    try {
      const res = await axiosInstance.post("/nurse/vitals", data);
      set((state) => ({ vitals: [res.data, ...state.vitals] }));
      toast.success("Vitals recorded successfully");
      return true;
    } catch (error) {
      console.error("Error recording vitals:", error);
      toast.error(error.response?.data?.message || "Failed to record vitals");
      return false;
    } finally {
      set({ isRecordingVitals: false });
    }
  },

  fetchVitals: async (patientId) => {
    set({ isFetchingVitals: true });
    try {
      const res = await axiosInstance.get(`/nurse/vitals/${patientId}`);
      set({ vitals: res.data });
    } catch (error) {
      console.error("Error fetching vitals:", error);
      toast.error(error.response?.data?.message || "Failed to fetch vitals");
    } finally {
      set({ isFetchingVitals: false });
    }
  },

  addNurseNote: async (data) => {
    try {
      const res = await axiosInstance.post("/nurse/notes", data);
      set((state) => ({ nurseNotes: [res.data, ...state.nurseNotes] }));
      toast.success("Note added successfully");
    } catch (error) {
      console.error("Error adding note:", error);
      toast.error(error.response?.data?.message || "Failed to add note");
    }
  },

  fetchNurseNotes: async (patientId) => {
    set({ isFetchingNotes: true });
    try {
      const res = await axiosInstance.get(`/nurse/notes/${patientId}`);
      set({ nurseNotes: res.data });
    } catch (error) {
      console.error("Error fetching notes:", error);
      toast.error(error.response?.data?.message || "Failed to fetch notes");
    } finally {
      set({ isFetchingNotes: false });
    }
  },
}));
