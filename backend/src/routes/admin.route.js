import express from "express";
import { isAdmin } from "../middleware/admin.middleware.js";
import {
  getDashboardStats,
  getUsers, createUser, updateUser, deleteUser, toggleUserStatus,
  getDoctors, createDoctor, updateDoctor, deleteDoctor,
  getNurses, createNurse, updateNurse, deleteNurse,
  getAppointments, updateAppointment,
  getReports, getReportById,
  getDepartments, createDepartment, updateDepartment, deleteDepartment,
  getAdminProfile, updateAdminProfile, uploadAdminAvatar,
  getAuditLogs, createAuditLog,
  createAdmin, grantAdminAccess
} from "../controllers/admin.controller.js";

const router = express.Router();

// Apply admin middleware to all routes
router.use(isAdmin);

// Dashboard
router.get("/dashboard", getDashboardStats);

// Users
router.get("/users", getUsers);
router.post("/users/create", createUser);
router.put("/users/update/:id", updateUser);
router.delete("/users/delete/:id", deleteUser);
router.put("/users/toggle-status/:id", toggleUserStatus);
router.post("/create-admin", createAdmin);
router.put("/grant-admin/:id", grantAdminAccess);

// Doctors
router.get("/doctors", getDoctors);
router.post("/doctors/create", createDoctor);
router.put("/doctors/update/:id", updateDoctor);
router.delete("/doctors/delete/:id", deleteDoctor);

// Nurses
router.get("/nurses", getNurses);
router.post("/nurses/create", createNurse);
router.put("/nurses/update/:id", updateNurse);
router.delete("/nurses/delete/:id", deleteNurse);

// Appointments
router.get("/appointments", getAppointments);
router.put("/appointments/update/:id", updateAppointment);

// Reports
router.get("/reports", getReports);
router.get("/reports/:id", getReportById);

// Departments
router.get("/departments", getDepartments);
router.post("/departments/create", createDepartment);
router.put("/departments/update/:id", updateDepartment);
router.delete("/departments/delete/:id", deleteDepartment);

// Profile
router.get("/profile", getAdminProfile);
router.put("/update-profile", updateAdminProfile);
router.post("/upload-avatar", uploadAdminAvatar);

// Audit Logs
router.get("/audit-logs", getAuditLogs);
router.post("/audit-log/create", createAuditLog);

export default router;
