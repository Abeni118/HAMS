import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const usePatientStore = create((set, get) => ({
  patients: [],
  selectedPatient: null,
  patientHistory: { appointments: [], consultations: [] },
  patientReports: [],
  
  isLoadingPatients: false,
  isLoadingDetails: false,
  isUpdatingConsultation: false,

  fetchDoctorPatients: async () => {
    set({ isLoadingPatients: true });
    try {
      const res = await axiosInstance.get("/patients");
      set({ patients: res.data });
    } catch (error) {
      toast.error("Failed to fetch patients");
    } finally {
      set({ isLoadingPatients: false });
    }
  },

  fetchPatientDetails: async (id) => {
    set({ isLoadingDetails: true });
    try {
      // Run these in parallel for speed
      const [patientRes, historyRes, reportsRes] = await Promise.all([
        axiosInstance.get(`/patients/${id}`),
        axiosInstance.get(`/patients/${id}/history`),
        axiosInstance.get(`/patients/${id}/reports`)
      ]);

      set({ 
        selectedPatient: patientRes.data,
        patientHistory: historyRes.data,
        patientReports: reportsRes.data
      });
    } catch (error) {
      toast.error("Failed to fetch patient details");
    } finally {
      set({ isLoadingDetails: false });
    }
  },

  clearSelectedPatient: () => {
    set({ 
      selectedPatient: null, 
      patientHistory: { appointments: [], consultations: [] }, 
      patientReports: [] 
    });
  },

  createConsultation: async (data) => {
    set({ isUpdatingConsultation: true });
    try {
      const res = await axiosInstance.post("/consultations/create", data);
      set((state) => ({
        patientHistory: {
          ...state.patientHistory,
          consultations: [res.data, ...state.patientHistory.consultations]
        }
      }));
      toast.success("Consultation notes saved");
      return true;
    } catch (error) {
      toast.error("Failed to save consultation");
      return false;
    } finally {
      set({ isUpdatingConsultation: false });
    }
  },

  updateConsultation: async (id, data) => {
    set({ isUpdatingConsultation: true });
    try {
      const res = await axiosInstance.put(`/consultations/update/${id}`, data);
      set((state) => ({
        patientHistory: {
          ...state.patientHistory,
          consultations: state.patientHistory.consultations.map(c => c._id === id ? res.data : c)
        }
      }));
      toast.success("Consultation updated");
      return true;
    } catch (error) {
      toast.error("Failed to update consultation");
      return false;
    } finally {
      set({ isUpdatingConsultation: false });
    }
  },

  deleteConsultation: async (id) => {
    try {
      await axiosInstance.delete(`/consultations/delete/${id}`);
      set((state) => ({
        patientHistory: {
          ...state.patientHistory,
          consultations: state.patientHistory.consultations.filter(c => c._id !== id)
        }
      }));
      toast.success("Consultation deleted");
    } catch (error) {
      toast.error("Failed to delete consultation");
    }
  }
}));
