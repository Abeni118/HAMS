import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("HAMS API Running");
});

const PORT = process.env.PORT || 5001;
connectDB();
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});