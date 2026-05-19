import Appointment from "../models/appointment.model.js";

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
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
