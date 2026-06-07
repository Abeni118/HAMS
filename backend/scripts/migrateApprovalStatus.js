import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../src/models/user.model.js";

dotenv.config();

const migrateApprovalStatus = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected.");

    // Update Admins and Patients (always approved)
    const adminPatientResult = await User.updateMany(
      { role: { $in: ["admin", "patient"] }, approvalStatus: { $ne: "approved" } },
      { $set: { approvalStatus: "approved" } }
    );
    console.log(`Updated ${adminPatientResult.modifiedCount} Admin/Patient accounts.`);

    // Update existing Doctors and Nurses (if they don't have approvalStatus set in DB, they shouldn't be pending)
    // To identify existing users without the field, we can just update all users who currently exist but we want to be careful not to approve newly registered pending ones.
    // Wait, the prompt says: "For existing doctor/nurse accounts created before this feature: Set approvalStatus = approved"
    // Since the field was just added, anyone who has { approvalStatus: { $exists: false } } is an existing user.
    const staffResult = await User.updateMany(
      { role: { $in: ["doctor", "nurse"] }, approvalStatus: { $exists: false } },
      { $set: { approvalStatus: "approved" } }
    );
    console.log(`Updated ${staffResult.modifiedCount} existing Doctor/Nurse accounts.`);

    console.log("Migration complete.");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

migrateApprovalStatus();
