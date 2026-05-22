import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL?.replace(/['"]+/g, '')?.trim() || "/api",
  withCredentials: true,
});