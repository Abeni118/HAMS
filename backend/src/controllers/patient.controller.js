import User from "../models/user.model.js";
import Appointment from "../models/appointment.model.js";
import Report from "../models/report.model.js";
import Consultation from "../models/consultation.model.js";

export const getDoctorPatients = async (req, res) => {
  try {
    const doctorId = req.user._id;

    // Find all appointments for this doctor to get unique patient IDs
    const appointments = await Appointment.find({ doctorId }).select("patientId");
    
    // Get distinct patient IDs
    const patientIds = [...new Set(appointments.map(apt => apt.patientId.toString()))];

    if (patientIds.length === 0) {
      return res.status(200).json([]);
    }

    // Fetch the full patient objects
    const patients = await User.find({ _id: { $in: patientIds } }).select("-password");
    
    // Attach the last appointment date for the UI
    const patientsWithLastApt = await Promise.all(patients.map(async (p) => {
      const lastApt = await Appointment.findOne({ patientId: p._id, doctorId }).sort({ date: -1 });
      const patientObj = p.toObject();
      patientObj.lastAppointment = lastApt ? lastApt.date : "N/A";
      return patientObj;
    }));

    res.status(200).json(patientsWithLastApt);
  } catch (error) {
    console.error("Error in getDoctorPatients: ", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getPatientDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await User.findById(id).select("-password");
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    
    res.status(200).json(patient);
  } catch (error) {
    console.error("Error in getPatientDetails: ", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getPatientHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const doctorId = req.user._id;

    // Fetch appointments with this doctor
    const appointments = await Appointment.find({ patientId: id, doctorId }).sort({ date: -1 });
    
    // Fetch consultations with this doctor
    const consultations = await Consultation.find({ patientId: id, doctorId }).sort({ createdAt: -1 });

    res.status(200).json({ appointments, consultations });
  } catch (error) {
    console.error("Error in getPatientHistory: ", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getPatientReports = async (req, res) => {
  try {
    const { id } = req.params;
    const reports = await Report.find({ patientId: id }).sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (error) {
    console.error("Error in getPatientReports: ", error);
    res.status(500).json({ message: "Server Error" });
  }
};
