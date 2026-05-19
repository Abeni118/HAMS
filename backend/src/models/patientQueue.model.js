import mongoose from "mongoose";

const patientQueueSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    nurseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["Waiting", "In Progress", "Completed", "Emergency"],
      default: "Waiting",
    },
    priority: {
      type: String,
      enum: ["Normal", "High", "Urgent"],
      default: "Normal",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const PatientQueue = mongoose.model("PatientQueue", patientQueueSchema);
export default PatientQueue;
