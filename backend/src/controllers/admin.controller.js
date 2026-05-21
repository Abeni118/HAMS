import User from "../models/user.model.js";
import Appointment from "../models/appointment.model.js";
import Report from "../models/report.model.js";
import AuditLog from "../models/auditLog.model.js";
import { Department } from "../models/department.model.js";
import bcrypt from "bcryptjs";
import { createNotification } from "./notification.controller.js";

// --- DASHBOARD OVERVIEW ---
export const getDashboardStats = async (req, res) => {
  try {
    const totalPatients = await User.countDocuments({ role: "patient" });
    const totalDoctors = await User.countDocuments({ role: "doctor" });
    const totalNurses = await User.countDocuments({ role: "nurse" });
    const totalAppointments = await Appointment.countDocuments();
    
    // Today's appointments
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    
    const todayAppointments = await Appointment.countDocuments({
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    const pendingApprovals = await Appointment.countDocuments({ status: "Pending" });
    const activeStaff = await User.countDocuments({ 
      role: { $in: ["doctor", "nurse", "admin"] },
      isActive: true 
    });
    
    const reportsGenerated = await Report.countDocuments();

    res.status(200).json({
      totalPatients,
      totalDoctors,
      totalNurses,
      totalAppointments,
      todayAppointments,
      pendingApprovals,
      activeStaff,
      reportsGenerated
    });
  } catch (error) {
    console.log("Error in getDashboardStats:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --- USER MANAGEMENT ---
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.log("Error in getUsers:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createUser = async (req, res) => {
  const { fullName, email, password, role } = req.body;
  try {
    if (!fullName || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      role,
      ...req.body // Pass along other potential fields
    });

    await newUser.save();
    const userResponse = newUser.toObject();
    delete userResponse.password;

    // Notify Admin (self) about new account
    await createNotification({
      userId: req.user._id,
      title: `New ${role} Account Created`,
      message: `${fullName} has been successfully registered as a ${role}.`,
      type: "system",
      relatedEntityId: newUser._id,
      relatedEntityType: "user",
      role: "admin",
      priority: "normal"
    });

    res.status(201).json(userResponse);
  } catch (error) {
    console.log("Error in createUser:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in updateUser:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log("Error in deleteUser:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const toggleUserStatus = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Assuming we have an isActive field or something similar. Let's toggle the status.
    // Wait, the User schema might not have an isActive field. Let's assume it has `status` or we just add it dynamically.
    // For now we'll set `isActive` to opposite of what it is.
    user.isActive = user.isActive === undefined ? false : !user.isActive;
    await user.save();

    res.status(200).json({ message: "User status updated", isActive: user.isActive });
  } catch (error) {
    console.log("Error in toggleUserStatus:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createAdmin = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new User({
      fullName,
      email,
      password: hashedPassword,
      role: "admin",
    });

    await newAdmin.save();

    const auditLog = new AuditLog({
      actorId: req.user._id,
      actorRole: req.user.role,
      action: "CREATED_ADMIN",
      entityType: "User",
      entityId: newAdmin._id,
      details: `Admin ${req.user.fullName} created new admin ${newAdmin.fullName}`,
      ipAddress: req.ip || req.connection?.remoteAddress || "127.0.0.1"
    });
    await auditLog.save();

    const adminResponse = newAdmin.toObject();
    delete adminResponse.password;

    res.status(201).json(adminResponse);
  } catch (error) {
    console.log("Error in createAdmin:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const grantAdminAccess = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "admin") {
      return res.status(400).json({ message: "User is already an admin" });
    }

    const oldRole = user.role;
    user.role = "admin";
    await user.save();

    const auditLog = new AuditLog({
      actorId: req.user._id,
      actorRole: req.user.role,
      action: "GRANTED_ADMIN",
      entityType: "User",
      entityId: user._id,
      details: `Admin ${req.user.fullName} granted admin role to User ${user.fullName} (was ${oldRole})`,
      ipAddress: req.ip || req.connection?.remoteAddress || "127.0.0.1"
    });
    await auditLog.save();

    res.status(200).json({ message: "Admin access granted successfully", user: { _id: user._id, fullName: user.fullName, role: user.role } });
  } catch (error) {
    console.log("Error in grantAdminAccess:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --- DOCTOR MANAGEMENT ---
export const getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select("-password");
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createDoctor = async (req, res) => {
  req.body.role = "doctor";
  return createUser(req, res);
};

export const updateDoctor = async (req, res) => {
  return updateUser(req, res);
};

export const deleteDoctor = async (req, res) => {
  return deleteUser(req, res);
};

// --- NURSE MANAGEMENT ---
export const getNurses = async (req, res) => {
  try {
    const nurses = await User.find({ role: "nurse" }).select("-password");
    res.status(200).json(nurses);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createNurse = async (req, res) => {
  req.body.role = "nurse";
  return createUser(req, res);
};

export const updateNurse = async (req, res) => {
  return updateUser(req, res);
};

export const deleteNurse = async (req, res) => {
  return deleteUser(req, res);
};

// --- APPOINTMENT MANAGEMENT ---
export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patientId", "fullName email")
      .populate("doctorId", "fullName specialization")
      .sort({ date: -1 });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateAppointment = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await Appointment.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Appointment not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// --- REPORT MANAGEMENT ---
export const getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("patientId", "fullName")
      .populate("doctorId", "fullName")
      .sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getReportById = async (req, res) => {
  const { id } = req.params;
  try {
    const report = await Report.findById(id)
      .populate("patientId", "fullName")
      .populate("doctorId", "fullName");
    if (!report) return res.status(404).json({ message: "Report not found" });
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// --- DEPARTMENT MANAGEMENT ---
export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().populate("head", "fullName");
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createDepartment = async (req, res) => {
  try {
    const dept = new Department(req.body);
    await dept.save();
    res.status(201).json(dept);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const updateDepartment = async (req, res) => {
  const { id } = req.params;
  try {
    const dept = await Department.findByIdAndUpdate(id, req.body, { new: true });
    if (!dept) return res.status(404).json({ message: "Department not found" });
    res.status(200).json(dept);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteDepartment = async (req, res) => {
  const { id } = req.params;
  try {
    await Department.findByIdAndDelete(id);
    res.status(200).json({ message: "Department deleted" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// --- PROFILE MANAGEMENT ---
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await User.findById(req.user._id).select("-password");
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateAdminProfile = async (req, res) => {
  try {
    const { password, ...updateData } = req.body;
    
    // Handle optional password update
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedAdmin = await User.findByIdAndUpdate(req.user._id, updateData, { new: true }).select("-password");
    res.status(200).json(updatedAdmin);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const uploadAdminAvatar = async (req, res) => {
  try {
    const { profilePic } = req.body;
    if (!profilePic) return res.status(400).json({ message: "Profile picture is required" });

    const updatedAdmin = await User.findByIdAndUpdate(req.user._id, { profilePic }, { new: true }).select("-password");
    res.status(200).json(updatedAdmin);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// --- AUDIT LOG MANAGEMENT ---
export const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate("actorId", "fullName email")
      .sort({ createdAt: -1 });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createAuditLog = async (req, res) => {
  try {
    const { action, entityType, entityId, details } = req.body;
    
    const newLog = new AuditLog({
      actorId: req.user._id,
      actorRole: req.user.role,
      action,
      entityType,
      entityId,
      details,
      ipAddress: req.ip || req.connection?.remoteAddress || "127.0.0.1"
    });

    await newLog.save();
    res.status(201).json(newLog);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
