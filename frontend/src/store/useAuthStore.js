import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isUploadingAvatar: false,
  isUpdatingSettings: false,
  isChangingPassword: false,
  isDeletingAccount: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/users/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
      throw error;
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  uploadAvatar: async (file) => {
    set({ isUploadingAvatar: true });
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      
      const res = await axiosInstance.post("/users/upload-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      set({ authUser: res.data });
      toast.success("Avatar updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload avatar");
    } finally {
      set({ isUploadingAvatar: false });
    }
  },

  updateSettings: async (settingsData) => {
    set({ isUpdatingSettings: true });
    try {
      const res = await axiosInstance.put("/settings/update", settingsData);
      set({ authUser: res.data });
      toast.success("Settings saved successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update settings");
    } finally {
      set({ isUpdatingSettings: false });
    }
  },

  changePassword: async (data) => {
    set({ isChangingPassword: true });
    try {
      const res = await axiosInstance.put("/settings/change-password", data);
      toast.success(res.data.message || "Password updated successfully");
      return true; // Used to trigger form reset
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
      return false;
    } finally {
      set({ isChangingPassword: false });
    }
  },

  deleteAccount: async (password) => {
    set({ isDeletingAccount: true });
    try {
      await axiosInstance.delete("/settings/delete-account", { data: { password } });
      set({ authUser: null });
      toast.success("Account deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete account");
      throw error; // Let UI catch it
    } finally {
      set({ isDeletingAccount: false });
    }
  },
}));
