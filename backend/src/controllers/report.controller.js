import fs from "fs";
import path from "path";
import Report from "../models/report.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getPatientReports = async (req, res) => {
  try {
    const patientId = req.user._id;
    
    // Check if we need to seed
    const count = await Report.countDocuments({ patientId });
    if (count === 0) {
      await seedDummyReports(patientId);
    }

    const reports = await Report.find({ patientId }).populate("doctorId", "fullName email").sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (error) {
    console.error("Error in getPatientReports:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Report.findOne({ _id: id, patientId: req.user._id }).populate("doctorId", "fullName email");
    
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json(report);
  } catch (error) {
    console.error("Error in getReportById:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const downloadReport = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Report.findOne({ _id: id, patientId: req.user._id });

    if (!report || !report.fileUrl) {
      return res.status(404).json({ message: "Report or file not found" });
    }

    const filePath = path.resolve(report.fileUrl);
    
    // Check if file exists, create a dummy one if it doesn't
    if (!fs.existsSync(filePath)) {
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(filePath, "Mock Medical Report PDF Content.");
    }

    res.download(filePath, `${report.title.replace(/\s+/g, '_')}.pdf`);
  } catch (error) {
    console.error("Error in downloadReport:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const seedDummyReports = async (patientId) => {
  let doctor = await User.findOne({ role: "doctor" });
  if (!doctor) {
     doctor = await User.create({
       fullName: "Dr. Sarah Mitchell",
       email: "sarah.mitchell@medisync.com",
       password: "hashedpassword123",
       role: "doctor",
     });
  }

  const dummyReports = [
    {
      patientId,
      doctorId: doctor._id,
      title: "Comprehensive Blood Panel",
      category: "Lab Result",
      description: "Annual full blood panel including CBC, Lipid, and Metabolic.",
      diagnosis: "Normal blood counts. Slightly elevated LDL cholesterol.",
      notes: "Patient should reduce saturated fat intake and follow up in 6 months.",
      fileUrl: "./uploads/reports/blood_panel_1.pdf",
      fileType: "application/pdf",
      size: "2.4 MB",
      department: "Pathology",
      status: "Final",
    },
    {
      patientId,
      doctorId: doctor._id,
      title: "Chest X-Ray Results",
      category: "Imaging",
      description: "Routine PA and Lateral chest views.",
      diagnosis: "Clear lung fields. No acute cardiopulmonary disease.",
      notes: "No signs of infection. Heart size is normal.",
      fileUrl: "./uploads/reports/chest_xray_1.pdf",
      fileType: "application/pdf",
      size: "8.1 MB",
      department: "Radiology",
      status: "Final",
    },
    {
      patientId,
      doctorId: doctor._id,
      title: "Cardiac Stress Test",
      category: "Diagnostics",
      description: "Treadmill stress test to evaluate cardiovascular fitness.",
      diagnosis: "Awaiting final cardiology review.",
      notes: "Patient achieved 85% of target heart rate without ischemic ECG changes.",
      fileUrl: "./uploads/reports/cardiac_stress_1.pdf",
      fileType: "application/pdf",
      size: "4.5 MB",
      department: "Cardiology",
      status: "Pending Review",
    }
  ];

  await Report.insertMany(dummyReports);
};

// DOCTOR CONTROLLERS

export const getDoctorReports = async (req, res) => {
  try {
    const doctorId = req.user._id;
    const reports = await Report.find({ doctorId })
      .populate("patientId", "fullName profilePic email")
      .sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (error) {
    console.error("Error in getDoctorReports:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const createReport = async (req, res) => {
  try {
    const doctorId = req.user._id;
    const { patientId, title, category, diagnosis, symptoms, recommendations, prescription, notes, fileUrl, fileType, size, status, department } = req.body;

    const report = new Report({
      patientId,
      doctorId,
      title,
      category,
      diagnosis,
      symptoms,
      recommendations,
      prescription,
      notes,
      fileUrl,
      fileType,
      size,
      status,
      department
    });

    const savedReport = await report.save();
    await savedReport.populate("patientId", "fullName profilePic email");
    res.status(201).json(savedReport);
  } catch (error) {
    console.error("Error in createReport:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const doctorId = req.user._id;

    const report = await Report.findOneAndUpdate(
      { _id: id, doctorId },
      { $set: req.body },
      { returnDocument: 'after' }
    ).populate("patientId", "fullName profilePic email");

    if (!report) return res.status(404).json({ message: "Report not found" });

    res.status(200).json(report);
  } catch (error) {
    console.error("Error in updateReport:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const doctorId = req.user._id;

    const report = await Report.findOneAndDelete({ _id: id, doctorId });
    if (!report) return res.status(404).json({ message: "Report not found" });

    res.status(200).json({ message: "Report deleted", id });
  } catch (error) {
    console.error("Error in deleteReport:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const uploadReportFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
    }

    // Upload to cloudinary as raw resource to support PDFs and images
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    
    // Auto resource_type allows PDF, raw docs, and images
    const uploadResponse = await cloudinary.uploader.upload(dataURI, {
      resource_type: "auto",
      folder: "hams/reports",
    });

    res.status(200).json({ 
      fileUrl: uploadResponse.secure_url,
      fileType: req.file.mimetype,
      size: (req.file.size / (1024 * 1024)).toFixed(2) + " MB"
    });
  } catch (error) {
    console.error("Error in uploadReportFile:", error);
    res.status(500).json({ message: "File upload failed" });
  }
};
