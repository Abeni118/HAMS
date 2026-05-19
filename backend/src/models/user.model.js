import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["patient", "doctor", "nurse", "admin"],
      default: "patient",
    },
    profilePic: {
      type: String,
      default: "",
    },
    phoneNumber: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", "Prefer not to say", ""],
      default: "",
    },
    dateOfBirth: {
      type: String, // Stored as YYYY-MM-DD
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    bloodType: {
      type: String,
      default: "",
    },
    allergies: {
      type: [String],
      default: [],
    },
    medicalConditions: {
      type: [String],
      default: [],
    },
    currentMedications: {
      type: [String],
      default: [],
    },
    emergencyContactName: {
      type: String,
      default: "",
    },
    emergencyRelationship: {
      type: String,
      default: "",
    },
    emergencyPhone: {
      type: String,
      default: "",
    },
    // Professional Fields (Doctor specific)
    educationLevel: { type: String, default: "" },
    degree: { type: String, default: "" },
    institution: { type: String, default: "" },
    graduationYear: { type: String, default: "" },
    certifications: { type: [String], default: [] },
    medicalLicenseNumber: { type: String, default: "" },
    yearsOfExperience: { type: Number, default: 0 },
    specialization: { type: String, default: "" },
    department: { type: String, default: "" },
    biography: { type: String, default: "" },
    languagesSpoken: { type: [String], default: [] },

    // Availability Fields (Doctor specific)
    workingDays: { type: [String], default: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
    consultationStart: { type: String, default: "09:00" },
    consultationEnd: { type: String, default: "17:00" },
    consultationDuration: { type: Number, default: 30 },
    emergencyAvailability: { type: Boolean, default: false },

    settings: {
      emailNotifications: { type: Boolean, default: true },
      smsNotifications: { type: Boolean, default: false },
      appointmentNotifications: { type: Boolean, default: true },
      patientUpdates: { type: Boolean, default: true },
      reportNotifications: { type: Boolean, default: true },
      emergencyAlerts: { type: Boolean, default: true },
      profileVisibility: { type: Boolean, default: true },
      publicListingVisibility: { type: Boolean, default: true },
      language: { type: String, default: "English (US)" },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
