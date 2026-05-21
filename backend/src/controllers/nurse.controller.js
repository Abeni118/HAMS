import Vital from "../models/vital.model.js";
import PatientQueue from "../models/patientQueue.model.js";
import NurseNote from "../models/nurseNote.model.js";
import User from "../models/user.model.js";
import AuditLog from "../models/auditLog.model.js";
import { createNotification } from "./notification.controller.js";

// --- Vitals ---

export const recordVitals = async (req, res) => {
  try {
    const { patientId, bloodPressure, temperature, heartRate, oxygenLevel, weight, height, bloodSugar, notes } = req.body;
    const nurseId = req.user._id;

    if (!patientId) {
      return res.status(400).json({ message: "Patient ID is required" });
    }

    const newVital = new Vital({
      patientId,
      nurseId,
      bloodPressure,
      temperature,
      heartRate,
      oxygenLevel,
      weight,
      height,
      bloodSugar,
      notes,
    });

    await newVital.save();

    await AuditLog.create({
      action: "Vitals Recorded",
      performedBy: nurseId,
      details: `Vitals recorded for patient ${patientId}`,
      entityType: "Vital",
      entityId: newVital._id,
    });

    res.status(201).json(newVital);
  } catch (error) {
    console.error("Error in recordVitals controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getPatientVitals = async (req, res) => {
  try {
    const { patientId } = req.params;
    const vitals = await Vital.find({ patientId }).populate("nurseId", "fullName").sort({ createdAt: -1 });
    res.status(200).json(vitals);
  } catch (error) {
    console.error("Error in getPatientVitals controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateVitals = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedVital = await Vital.findByIdAndUpdate(id, req.body, { new: true });
    
    if (!updatedVital) {
      return res.status(404).json({ message: "Vitals record not found" });
    }

    res.status(200).json(updatedVital);
  } catch (error) {
    console.error("Error in updateVitals controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// --- Patient Queue ---

export const addToQueue = async (req, res) => {
  try {
    const { patientId, doctorId, priority, notes } = req.body;
    const nurseId = req.user._id;

    if (!patientId) {
      return res.status(400).json({ message: "Patient ID is required" });
    }

    const queueEntry = new PatientQueue({
      patientId,
      nurseId,
      doctorId,
      priority,
      notes,
    });

    await queueEntry.save();
    
    const populatedEntry = await PatientQueue.findById(queueEntry._id)
      .populate("patientId", "fullName profilePic")
      .populate("doctorId", "fullName");

    // Notify Doctor
    if (doctorId) {
      await createNotification({
        userId: doctorId,
        title: "Patient Added to Queue",
        message: `${populatedEntry.patientId.fullName} has been triaged and is waiting.`,
        type: "system",
        relatedEntityId: populatedEntry._id,
        relatedEntityType: "queue",
        role: "doctor",
        priority: priority === "Emergency" ? "urgent" : "normal"
      });
    }

    res.status(201).json(populatedEntry);
  } catch (error) {
    console.error("Error in addToQueue controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getQueue = async (req, res) => {
  try {
    const queue = await PatientQueue.find()
      .populate("patientId", "fullName profilePic")
      .populate("doctorId", "fullName")
      .sort({ createdAt: 1 });
    
    res.status(200).json(queue);
  } catch (error) {
    console.error("Error in getQueue controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateQueueStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["Waiting", "In Progress", "Completed", "Emergency"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updatedEntry = await PatientQueue.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("patientId", "fullName profilePic").populate("doctorId", "fullName");

    if (!updatedEntry) {
      return res.status(404).json({ message: "Queue entry not found" });
    }

    // Notify Doctor if Patient is ready or emergency
    if (updatedEntry.doctorId && (status === "In Progress" || status === "Emergency")) {
      await createNotification({
        userId: updatedEntry.doctorId._id,
        title: status === "Emergency" ? "EMERGENCY: Patient Ready" : "Patient Ready in Triage",
        message: `${updatedEntry.patientId.fullName} has completed triage and is waiting for consultation.`,
        type: status === "Emergency" ? "emergency" : "queue",
        relatedEntityId: updatedEntry._id,
        relatedEntityType: "queue",
        role: "doctor",
        priority: status === "Emergency" ? "urgent" : "normal"
      });
    }

    await AuditLog.create({
      action: "Queue Status Updated",
      performedBy: req.user._id,
      details: `Queue status changed to ${status} for patient ${updatedEntry.patientId._id}`,
      entityType: "PatientQueue",
      entityId: updatedEntry._id,
    });

    res.status(200).json(updatedEntry);
  } catch (error) {
    console.error("Error in updateQueueStatus controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// --- Dashboard Stats ---

export const getNurseStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const patientsInQueue = await PatientQueue.countDocuments({ status: { $ne: "Completed" } });
    const vitalsRecorded = await Vital.countDocuments({ 
      nurseId: req.user._id,
      createdAt: { $gte: today } 
    });
    const totalVitals = await Vital.countDocuments();
    const completedTasks = await PatientQueue.countDocuments({ status: "Completed" });

    res.status(200).json({
      patientsInQueue,
      vitalsRecordedToday: vitalsRecorded,
      totalVitalsRecorded: totalVitals,
      tasksCompleted: completedTasks
    });
  } catch (error) {
    console.error("Error in getNurseStats controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// --- Nurse Notes ---

export const addNurseNote = async (req, res) => {
  try {
    const { patientId, noteContent } = req.body;
    const nurseId = req.user._id;

    if (!patientId || !noteContent) {
      return res.status(400).json({ message: "Patient ID and Note Content are required" });
    }

    const newNote = new NurseNote({ patientId, nurseId, noteContent });
    await newNote.save();
    
    await AuditLog.create({
      action: "Nurse Note Added",
      performedBy: nurseId,
      details: `Added triage note for patient ${patientId}`,
      entityType: "NurseNote",
      entityId: newNote._id,
    });

    res.status(201).json(newNote);
  } catch (error) {
    console.error("Error in addNurseNote controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getNurseNotes = async (req, res) => {
  try {
    const { patientId } = req.params;
    const notes = await NurseNote.find({ patientId })
      .populate("nurseId", "fullName")
      .sort({ createdAt: -1 });
    
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error in getNurseNotes controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
