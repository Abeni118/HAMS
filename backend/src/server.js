import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";
import User from "./models/user.model.js";
import bcrypt from "bcryptjs";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import appointmentRoutes from "./routes/appointment.route.js";
import reportRoutes from "./routes/report.route.js";
import settingsRoutes from "./routes/settings.route.js";
import scheduleRoutes from "./routes/schedule.route.js";
import patientRoutes from "./routes/patient.route.js";
import consultationRoutes from "./routes/consultation.route.js";
import nurseRoutes from "./routes/nurse.route.js";
import dashboardRoutes from "./routes/dashboard.route.js";
import notificationRoutes from "./routes/notification.route.js";
import adminRoutes from "./routes/admin.route.js";

dotenv.config();

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  "https://hams-1-1pbn.onrender.com"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/consultations", consultationRoutes);
app.use("/api/nurse", nurseRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
    res.send("HAMS API Running");
});

const PORT = process.env.PORT || 5001;

const seedAdmin = async () => {
    try {
        const adminExists = await User.findOne({ role: "admin" });
        if (!adminExists) {
            const adminEmail = process.env.ADMIN_EMAIL;
            const adminPassword = process.env.ADMIN_PASSWORD;

            if (adminEmail && adminPassword) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(adminPassword, salt);
                
                const admin = new User({
                    fullName: "System Administrator",
                    email: adminEmail,
                    password: hashedPassword,
                    role: "admin"
                });
                await admin.save();
                console.log("Bootstrap Admin account created.");
            } else {
                console.log("ADMIN_EMAIL or ADMIN_PASSWORD not provided in .env. Skipping bootstrap admin creation.");
            }
        }
    } catch (error) {
        console.error("Error creating bootstrap admin:", error);
    }
};

server.listen(PORT, async () => {
    await connectDB();
    await seedAdmin();
    console.log(`Server running on port ${PORT}`);
});