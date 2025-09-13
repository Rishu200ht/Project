// index.js
import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js";
import dotenv from "dotenv";
import cors from "cors"; 

dotenv.config();
// import logger from "./middleware/logger.js";

const app = express();
const port = 5000;

app.use(cors({
  origin: "*", // change to "http://localhost:3000" or your frontend URL for more security
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Middleware
app.use(express.json());
// app.use(logger); // custom middleware

// MongoDB Connection
try {
  await mongoose.connect(process.env.MONGODB_URL, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  });
  console.log("✅ MongoDB Connected");
} catch (err) {
  console.error("❌ MongoDB Connection Error:", err);
}

// Routes
app.use("/users", userRoutes);

// Root Route
app.get("/", (req, res) => {
  res.send("🚀 Express + Mongoose Project Running");
});

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server started on http://localhost:${port}`);
});
