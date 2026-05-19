import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("settings");
    res.status(200).json(user.settings);
  } catch (error) {
    console.error("Error in getSettings: ", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const { 
      emailNotifications, smsNotifications, language,
      appointmentNotifications, patientUpdates, reportNotifications,
      emergencyAlerts, profileVisibility, publicListingVisibility
    } = req.body;
    const userId = req.user._id;

    // We merge the existing settings with the new ones provided
    const user = await User.findById(userId);
    const updatedSettings = {
      ...user.settings,
      ...(emailNotifications !== undefined && { emailNotifications }),
      ...(smsNotifications !== undefined && { smsNotifications }),
      ...(appointmentNotifications !== undefined && { appointmentNotifications }),
      ...(patientUpdates !== undefined && { patientUpdates }),
      ...(reportNotifications !== undefined && { reportNotifications }),
      ...(emergencyAlerts !== undefined && { emergencyAlerts }),
      ...(profileVisibility !== undefined && { profileVisibility }),
      ...(publicListingVisibility !== undefined && { publicListingVisibility }),
      ...(language !== undefined && { language }),
    };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { settings: updatedSettings },
      { returnDocument: 'after' }
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error in updateSettings: ", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    // Need to explicitly select password since we might exclude it by default
    const user = await User.findById(userId).select("+password");

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error in changePassword: ", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId).select("+password");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    await User.findByIdAndDelete(userId);

    // Clear the auth cookie
    res.cookie("jwt", "", { maxAge: 0 });

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error in deleteAccount: ", error);
    res.status(500).json({ message: "Server Error" });
  }
};
