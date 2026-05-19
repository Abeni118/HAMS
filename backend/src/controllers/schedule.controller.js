import Schedule from "../models/schedule.model.js";

export const getDoctorSchedule = async (req, res) => {
  try {
    const doctorId = req.user._id;
    const { date } = req.query; // Optional filter

    let query = { doctorId };
    if (date) {
      query.date = date;
    }

    const schedules = await Schedule.find(query)
      .populate({
        path: "appointmentId",
        populate: { path: "patientId", select: "fullName profilePic" }
      })
      .sort({ date: 1, startTime: 1 });

    res.status(200).json(schedules);
  } catch (error) {
    console.error("Error in getDoctorSchedule: ", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const createSlot = async (req, res) => {
  try {
    const { date, startTime, endTime, recurring } = req.body;
    const doctorId = req.user._id;

    // Optional validation to prevent overlaps could go here

    const newSlot = new Schedule({
      doctorId,
      date,
      startTime,
      endTime,
      recurring: recurring || false,
      isAvailable: true,
    });

    const savedSlot = await newSlot.save();
    res.status(201).json(savedSlot);
  } catch (error) {
    console.error("Error in createSlot: ", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const { isAvailable, appointmentId } = req.body;
    const doctorId = req.user._id;

    const slot = await Schedule.findOne({ _id: id, doctorId });

    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    if (isAvailable !== undefined) slot.isAvailable = isAvailable;
    if (appointmentId !== undefined) slot.appointmentId = appointmentId;

    const updatedSlot = await slot.save();
    await updatedSlot.populate({
      path: "appointmentId",
      populate: { path: "patientId", select: "fullName profilePic" }
    });

    res.status(200).json(updatedSlot);
  } catch (error) {
    console.error("Error in updateSlot: ", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const doctorId = req.user._id;

    const deletedSlot = await Schedule.findOneAndDelete({ _id: id, doctorId });
    
    if (!deletedSlot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    res.status(200).json({ message: "Slot deleted successfully", id });
  } catch (error) {
    console.error("Error in deleteSlot: ", error);
    res.status(500).json({ message: "Server Error" });
  }
};
