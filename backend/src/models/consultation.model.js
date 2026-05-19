import mongoose from "mongoose";

const consultationSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      default: null,
    },
    diagnosis: {
      type: String,
      default: "",
    },
    symptoms: {
      type: [String],
      default: [],
    },
    prescriptions: {
      type: String,
      default: "",
    },
    recommendations: {
      type: String,
      default: "",
    },
    followUpDate: {
      type: String, // YYYY-MM-DD
      default: "",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Consultation = mongoose.model("Consultation", consultationSchema);

export default Consultation;
