import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    actorRole: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    entityType: {
      type: String, // e.g., 'User', 'Report', 'Appointment', 'Department'
      required: true,
    },
    entityId: {
      type: mongoose.Schema.Types.Mixed, // Sometimes an ID, sometimes a name string
    },
    ipAddress: {
      type: String,
      default: "127.0.0.1",
    },
    details: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const AuditLog = mongoose.model("AuditLog", auditLogSchema);

export default AuditLog;
