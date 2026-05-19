import mongoose from "mongoose";

const vitalSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    nurseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bloodPressure: {
      type: String, // e.g., "120/80"
      default: "",
    },
    temperature: {
      type: Number, // in Celsius or Fahrenheit
    },
    heartRate: {
      type: Number, // bpm
    },
    oxygenLevel: {
      type: Number, // percentage
    },
    weight: {
      type: Number, // in kg
    },
    height: {
      type: Number, // in cm
    },
    bloodSugar: {
      type: Number, // mg/dL
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Vital = mongoose.model("Vital", vitalSchema);
export default Vital;
