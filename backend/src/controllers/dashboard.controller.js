import Appointment from "../models/appointment.model.js";
import Report from "../models/report.model.js";

export const getPatientDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const [
      upcomingAppointments,
      pendingAppointments,
      reportsCount,
      completedVisits
    ] = await Promise.all([
      Appointment.countDocuments({ patientId: userId, status: "Approved", date: { $gte: new Date().toISOString().split("T")[0] } }),
      Appointment.countDocuments({ patientId: userId, status: "Pending" }),
      Report.countDocuments({ patientId: userId }),
      Appointment.countDocuments({ patientId: userId, status: "Completed" })
    ]);

    res.status(200).json({
      upcomingAppointments,
      pendingAppointments,
      reportsCount,
      completedVisits,
    });
  } catch (error) {
    console.error("Error in getPatientDashboard:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getDoctorDashboard = async (req, res) => {
  try {
    const doctorId = req.user._id;

    const [
      todaysPatients,
      totalAppointments,
      pendingReports,
      surgeries
    ] = await Promise.all([
      Appointment.countDocuments({ doctorId, date: new Date().toISOString().split("T")[0] }),
      Appointment.countDocuments({ doctorId }),
      Report.countDocuments({ doctorId, status: "Draft" }),
      Appointment.countDocuments({ doctorId, status: "Approved", department: /Surgery/i }) // Rough estimate based on dept
    ]);

    res.status(200).json({
      todaysPatients,
      totalAppointments,
      pendingReports,
      surgeries,
    });
  } catch (error) {
    console.error("Error in getDoctorDashboard:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
