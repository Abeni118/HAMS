import Appointment from "../models/appointment.model.js";
import PatientQueue from "../models/patientQueue.model.js";
import { createNotification } from "./notification.controller.js";

export const getAppointments = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === "patient") query.patientId = req.user._id;
    else if (req.user.role === "doctor") query.doctorId = req.user._id;

    if (req.query.status) query.status = req.query.status;

    const appointments = await Appointment.find(query)
      .populate("doctorId", "fullName profilePic")
      .populate("patientId", "fullName profilePic phone")
      .sort({ date: 1, timeSlot: 1 });

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error in getAppointments: ", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const createAppointment = async (req, res) => {
  try {
    const { doctorId, department, date, timeSlot, notes } = req.body;

    const appointment = new Appointment({
      patientId: req.user._id,
      doctorId,
      department,
      date,
      timeSlot,
      notes,
    });

    const savedAppointment = await appointment.save();
    await savedAppointment.populate("doctorId", "fullName profilePic");
    
    // Notify Doctor
    await createNotification({
      userId: doctorId,
      title: "New Appointment Assigned",
      message: `${req.user.fullName} requested an appointment for ${date} at ${timeSlot}.`,
      type: "appointment",
      relatedEntityId: savedAppointment._id,
      relatedEntityType: "appointment",
      role: "doctor",
      priority: "normal"
    });

    res.status(201).json(savedAppointment);
  } catch (error) {
    console.error("Error in createAppointment: ", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) return res.status(404).json({ message: "Not found" });

    appointment.status = status;
    const updatedAppointment = await appointment.save();
    res.status(200).json(updatedAppointment);
  } catch (error) {
    console.error("Error in updateAppointmentStatus: ", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const approveAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "Approved" },
      { returnDocument: "after" }
    ).populate("patientId", "fullName profilePic phone");

    // Add to Nurse Queue automatically
    if (appointment) {
      // Find admin or system user as the creator, or leave nurseId null. Schema allows nurseId? Let's assume it's created by System. 
      // We will assign a queue entry without a specific nurse, any available nurse can pick it up.
      const queueEntry = new PatientQueue({
        patientId: appointment.patientId._id,
        doctorId: appointment.doctorId,
        priority: "Normal",
        notes: "Automatically queued from appointment approval.",
      });
      await queueEntry.save();
    }

    // Notify Patient
    if (appointment) {
      await createNotification({
        userId: appointment.patientId._id,
        title: "Appointment Confirmed",
        message: `Your appointment for ${appointment.date} at ${appointment.timeSlot} has been approved.`,
        type: "appointment",
        relatedEntityId: appointment._id,
        relatedEntityType: "appointment",
        role: "patient",
        priority: "normal"
      });
    }

    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const rejectAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "Cancelled" },
      { returnDocument: "after" }
    ).populate("patientId", "fullName profilePic phone");

    // Notify Patient
    if (appointment && req.user.role === "doctor") {
      await createNotification({
        userId: appointment.patientId._id,
        title: "Appointment Cancelled",
        message: `Your appointment for ${appointment.date} at ${appointment.timeSlot} was cancelled.`,
        type: "appointment",
        relatedEntityId: appointment._id,
        relatedEntityType: "appointment",
        role: "patient",
        priority: "normal"
      });
    } else if (appointment && req.user.role === "patient") {
      await createNotification({
        userId: appointment.doctorId,
        title: "Appointment Cancelled",
        message: `Patient ${appointment.patientId.fullName} cancelled their appointment for ${appointment.date} at ${appointment.timeSlot}.`,
        type: "appointment",
        relatedEntityId: appointment._id,
        relatedEntityType: "appointment",
        role: "doctor",
        priority: "normal"
      });
    }

    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const completeAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "Completed" },
      { returnDocument: "after" }
    ).populate("patientId", "fullName profilePic phone");

    if (appointment) {
      await PatientQueue.findOneAndUpdate(
        { patientId: appointment.patientId._id, status: { $ne: "Completed" } },
        { status: "Completed" }
      );
    }

    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const rescheduleAppointment = async (req, res) => {
  try {
    const { date, timeSlot } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { 
        date, 
        timeSlot, 
        status: "Approved" // Automatically approve if doctor reschedules
      },
      { returnDocument: "after" }
    ).populate("patientId", "fullName profilePic phone");

    if (appointment && req.user.role === "patient") {
      await createNotification({
        userId: appointment.doctorId,
        title: "Patient Rescheduled Appointment",
        message: `${appointment.patientId.fullName} rescheduled to ${date} at ${timeSlot}.`,
        type: "appointment",
        relatedEntityId: appointment._id,
        relatedEntityType: "appointment",
        role: "doctor",
        priority: "normal"
      });
    } else if (appointment && req.user.role === "doctor") {
      await createNotification({
        userId: appointment.patientId._id,
        title: "Appointment Rescheduled",
        message: `Your doctor rescheduled your appointment to ${date} at ${timeSlot}.`,
        type: "appointment",
        relatedEntityId: appointment._id,
        relatedEntityType: "appointment",
        role: "patient",
        priority: "normal"
      });
    }

    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getRecentPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.user._id })
      .populate("doctorId", "fullName department profilePic")
      .sort({ date: -1, timeSlot: -1 })
      .limit(5);
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error in getRecentPatientAppointments:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getUpcomingPatientAppointments = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const appointments = await Appointment.find({ 
      patientId: req.user._id,
      date: { $gte: today },
      status: { $in: ["Pending", "Approved"] }
    })
      .populate("doctorId", "fullName department profilePic specialization")
      .sort({ date: 1, timeSlot: 1 });
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error in getUpcomingPatientAppointments:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("doctorId", "fullName profilePic specialization department")
      .populate("patientId", "fullName profilePic email phoneNumber");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Ownership check: patient can only view their own, doctor can only view their assigned
    const userId = req.user._id.toString();
    const isPatient = req.user.role === "patient" && appointment.patientId._id.toString() === userId;
    const isDoctor = req.user.role === "doctor" && appointment.doctorId._id.toString() === userId;
    const isAdmin = req.user.role === "admin";
    const isNurse = req.user.role === "nurse";

    if (!isPatient && !isDoctor && !isAdmin && !isNurse) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(appointment);
  } catch (error) {
    console.error("Error in getAppointmentById:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
