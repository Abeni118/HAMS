import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Lab Result", "Prescription", "Imaging", "Clinical Note", "Diagnostics", "Other"],
      default: "Other",
    },
    description: {
      type: String,
      default: "",
    },
    diagnosis: {
      type: String,
      default: "",
    },
    notes: {
      type: String,
      default: "",
    },
    fileUrl: {
      type: String, // Local path e.g., /uploads/reports/file.pdf
      default: "",
    },
    fileType: {
      type: String, // e.g., "application/pdf"
      default: "",
    },
    size: {
      type: String, // e.g., "2.4 MB"
      default: "",
    },
    department: {
      type: String,
      default: "General",
    },
    status: {
      type: String,
      enum: ["Pending Review", "Final", "Revised"],
      default: "Final",
    },
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);

export default Report;
