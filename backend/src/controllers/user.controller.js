import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select("-password");
    res.status(200).json(doctors);
  } catch (error) {
    console.error("Error in getDoctors: ", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: "patient" }).select("-password");
    res.status(200).json(patients);
  } catch (error) {
    console.error("Error in getPatients: ", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { fullName, phoneNumber, gender, dateOfBirth, address, 
      bloodType, allergies, medicalConditions, currentMedications, 
      emergencyContactName, emergencyRelationship, emergencyPhone,
      // Doctor Fields
      educationLevel, degree, institution, graduationYear, certifications,
      medicalLicenseNumber, yearsOfExperience, specialization, department,
      biography, languagesSpoken, workingDays, consultationStart, 
      consultationEnd, consultationDuration, emergencyAvailability,
      // Nurse Fields
      nursingLevel, assignedWard, shiftType
    } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          ...(fullName && { fullName }),
          ...(phoneNumber && { phoneNumber }),
          ...(gender && { gender }),
          ...(dateOfBirth && { dateOfBirth }),
          ...(address && { address }),
          ...(bloodType && { bloodType }),
          ...(allergies && { allergies }),
          ...(medicalConditions && { medicalConditions }),
          ...(currentMedications && { currentMedications }),
          ...(emergencyContactName && { emergencyContactName }),
          ...(emergencyRelationship && { emergencyRelationship }),
          ...(emergencyPhone && { emergencyPhone }),
          // Doctor Fields
          ...(educationLevel !== undefined && { educationLevel }),
          ...(degree !== undefined && { degree }),
          ...(institution !== undefined && { institution }),
          ...(graduationYear !== undefined && { graduationYear }),
          ...(certifications !== undefined && { certifications }),
          ...(medicalLicenseNumber !== undefined && { medicalLicenseNumber }),
          ...(yearsOfExperience !== undefined && { yearsOfExperience }),
          ...(specialization !== undefined && { specialization }),
          ...(department !== undefined && { department }),
          ...(biography !== undefined && { biography }),
          ...(languagesSpoken !== undefined && { languagesSpoken }),
          ...(workingDays !== undefined && { workingDays }),
          ...(consultationStart !== undefined && { consultationStart }),
          ...(consultationEnd !== undefined && { consultationEnd }),
          ...(consultationDuration !== undefined && { consultationDuration }),
          ...(emergencyAvailability !== undefined && { emergencyAvailability }),
          // Nurse Fields
          ...(nursingLevel !== undefined && { nursingLevel }),
          ...(assignedWard !== undefined && { assignedWard }),
          ...(shiftType !== undefined && { shiftType }),
        }
      },
      { returnDocument: 'after' }
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error in updateProfile: ", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image" });
    }

    // Convert buffer to data URI
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    
    // Upload to Cloudinary
    const cldRes = await cloudinary.uploader.upload(dataURI, {
      resource_type: "auto",
      folder: "hams_avatars",
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { profilePic: cldRes.secure_url },
      { returnDocument: 'after' }
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error in uploadAvatar: ", error);
    res.status(500).json({ message: "Server Error" });
  }
};
