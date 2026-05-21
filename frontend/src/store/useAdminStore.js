import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAdminStore = create((set, get) => ({
  stats: null,
  users: [],
  doctors: [],
  nurses: [],
  appointments: [],
  reports: [],
  departments: [],
  auditLogs: [],
  
  isLoadingStats: false,
  isLoadingUsers: false,
  isLoadingDepartments: false,
  isLoadingAppointments: false,
  isLoadingReports: false,
  isLoadingAuditLogs: false,
  
  // Dashboard Stats
  fetchDashboardStats: async () => {
    set({ isLoadingStats: true });
    try {
      const res = await axiosInstance.get("/admin/dashboard");
      set({ stats: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch stats");
    } finally {
      set({ isLoadingStats: false });
    }
  },

  // Users
  fetchUsers: async () => {
    set({ isLoadingUsers: true });
    try {
      const res = await axiosInstance.get("/admin/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      set({ isLoadingUsers: false });
    }
  },

  createUser: async (userData) => {
    try {
      const res = await axiosInstance.post("/admin/users/create", userData);
      set((state) => ({ users: [res.data, ...state.users] }));
      toast.success("User created successfully");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create user");
      return false;
    }
  },

  updateUser: async (id, userData) => {
    try {
      const res = await axiosInstance.put(`/admin/users/update/${id}`, userData);
      set((state) => ({
        users: state.users.map((u) => (u._id === id ? res.data : u)),
      }));
      toast.success("User updated successfully");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update user");
      return false;
    }
  },

  deleteUser: async (id) => {
    try {
      await axiosInstance.delete(`/admin/users/delete/${id}`);
      set((state) => ({
        users: state.users.filter((u) => u._id !== id),
      }));
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  },

  toggleUserStatus: async (id) => {
    try {
      const res = await axiosInstance.put(`/admin/users/toggle-status/${id}`);
      set((state) => ({
        users: state.users.map((u) => 
          u._id === id ? { ...u, isActive: res.data.isActive } : u
        ),
      }));
      toast.success("User status updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to toggle status");
    }
  },

  // Appointments
  fetchAppointments: async () => {
    set({ isLoadingAppointments: true });
    try {
      const res = await axiosInstance.get("/admin/appointments");
      set({ appointments: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch appointments");
    } finally {
      set({ isLoadingAppointments: false });
    }
  },

  updateAppointment: async (id, data) => {
    try {
      const res = await axiosInstance.put(`/admin/appointments/update/${id}`, data);
      set((state) => ({
        appointments: state.appointments.map((a) => (a._id === id ? res.data : a)),
      }));
      toast.success("Appointment updated");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update appointment");
      return false;
    }
  },

  // Departments
  fetchDepartments: async () => {
    set({ isLoadingDepartments: true });
    try {
      const res = await axiosInstance.get("/admin/departments");
      set({ departments: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch departments");
    } finally {
      set({ isLoadingDepartments: false });
    }
  },

  createDepartment: async (data) => {
    try {
      const res = await axiosInstance.post("/admin/departments/create", data);
      set((state) => ({ departments: [...state.departments, res.data] }));
      toast.success("Department created");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create department");
      return false;
    }
  },
  
  deleteDepartment: async (id) => {
    try {
      await axiosInstance.delete(`/admin/departments/delete/${id}`);
      set((state) => ({
        departments: state.departments.filter((d) => d._id !== id),
      }));
      toast.success("Department deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete department");
    }
  },

  // Reports
  fetchReports: async () => {
    set({ isLoadingReports: true });
    try {
      const res = await axiosInstance.get("/admin/reports");
      set({ reports: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch reports");
    } finally {
      set({ isLoadingReports: false });
    }
  },

  // Audit Logs
  fetchAuditLogs: async () => {
    set({ isLoadingAuditLogs: true });
    try {
      const res = await axiosInstance.get("/admin/audit-logs");
      set({ auditLogs: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch audit logs");
    } finally {
      set({ isLoadingAuditLogs: false });
    }
  }

}));
