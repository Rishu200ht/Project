// index.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();   // ✅ Load env FIRST

import userRoutes from "./routes/userRoutes.js"; // ✅ Now env vars exist
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { isAuthenticated } from "./middleware/auth.js";

const app = express();
const port = 5000;

// For __dirname (since ES Modules don’t have it)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
  origin: "http://localhost:3000", // change to your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

try {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("✅ MongoDB Connected");
} catch (err) {
  console.error("❌ MongoDB Connection Error:", err);
}

// ✅ Routes
app.use("/users", userRoutes);

// Serve static files
// Serve only assets, not HTML
app.use("/assets", express.static(path.join(__dirname, "frontend/assets")));

// Protected route
app.get("/iindex.html", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "iindex.html"));
});

// Public routes
app.get("/login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "login.html"));
});

app.get("/signup.html", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "signup.html"));
});

app.get("/index.html", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

app.get("/InterviewPrep/technical-interview.html", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "InterviewPrep/technical-interview.html"));
});

// Root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server started on http://localhost:${port}`);
});
