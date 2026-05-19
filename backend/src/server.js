import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import appointmentRoutes from "./routes/appointment.route.js";
import reportRoutes from "./routes/report.route.js";
import settingsRoutes from "./routes/settings.route.js";
import scheduleRoutes from "./routes/schedule.route.js";
import patientRoutes from "./routes/patient.route.js";
import consultationRoutes from "./routes/consultation.route.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: process.env.CLIENT_URL,
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

app.get("/", (req, res) => {
    res.send("HAMS API Running");
});

const PORT = process.env.PORT || 5001;
connectDB();
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});