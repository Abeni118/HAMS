import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useReportStore = create((set) => ({
  reports: [],
  isFetchingReports: false,
  isDownloading: false,
  isUploading: false,
  isUpdating: false,

  fetchPatientReports: async () => {
    set({ isFetchingReports: true });
    try {
      const res = await axiosInstance.get("/reports/patient");
      set({ reports: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch reports");
    } finally {
      set({ isFetchingReports: false });
    }
  },

  downloadReport: async (id, filename) => {
    set({ isDownloading: true });
    try {
      const res = await axiosInstance.get(`/reports/download/${id}`, {
        responseType: "blob",
      });
      
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename || "medical_report.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("Download started successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to download report");
    } finally {
      set({ isDownloading: false });
    }
  },

  fetchDoctorReports: async () => {
    set({ isFetchingReports: true });
    try {
      const res = await axiosInstance.get("/reports/doctor");
      set({ reports: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch reports");
    } finally {
      set({ isFetchingReports: false });
    }
  },

  uploadReportFile: async (file) => {
    set({ isUploading: true });
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const res = await axiosInstance.post("/reports/upload-files", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return res.data; // { fileUrl, fileType, size }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload file");
      return null;
    } finally {
      set({ isUploading: false });
    }
  },

  createReport: async (reportData) => {
    set({ isUpdating: true });
    try {
      const res = await axiosInstance.post("/reports/create", reportData);
      set((state) => ({ reports: [res.data, ...state.reports] }));
      toast.success("Report created successfully");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create report");
      return false;
    } finally {
      set({ isUpdating: false });
    }
  },

  deleteReport: async (id) => {
    try {
      await axiosInstance.delete(`/reports/delete/${id}`);
      set((state) => ({
        reports: state.reports.filter((r) => r._id !== id),
      }));
      toast.success("Report deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete report");
    }
  },
}));
