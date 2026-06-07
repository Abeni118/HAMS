import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../lib/utils.js";

export const signup = async (req, res) => {
  const { fullName, email, password, role } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    if (role === "admin") {
      return res.status(403).json({ message: "Admin registration is restricted." });
    }

    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const isStaff = role === "doctor" || role === "nurse";
    const approvalStatus = isStaff ? "pending" : "approved";

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      role: role || "patient",
      approvalStatus,
      // Professional Fields
      medicalLicenseNumber: req.body.medicalLicenseNumber || req.body.licenseNumber || "",
      specialization: req.body.specialization || "",
      department: req.body.department || "",
      yearsOfExperience: req.body.yearsOfExperience || 0,
      assignedWard: role === "nurse" ? (req.body.department || req.body.assignedWard || "") : "",
      shiftType: role === "nurse" ? (req.body.shiftPreference || req.body.shiftType || "") : "",
    });

    if (newUser) {
      await newUser.save();

      if (isStaff) {
        return res.status(201).json({
          message: "Registration submitted successfully. Awaiting administrator approval.",
          requiresApproval: true
        });
      }

      // generate jwt token for patients
      generateTokenAndSetCookie(newUser._id, res);

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.approvalStatus === "pending") {
      return res.status(403).json({ message: "Your account is awaiting administrator approval." });
    }

    if (user.approvalStatus === "rejected") {
      return res.status(403).json({ message: "Your registration request was rejected." });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
