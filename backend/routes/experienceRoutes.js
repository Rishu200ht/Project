// routes/experienceRoutes.js
import express from "express";
import Experience from "../models/experienceForm.js";

const router = express.Router();

// ------------------ CREATE EXPERIENCE (POST) ------------------
router.post("/submit-form", async (req, res) => {
  try {
    const {
      name,
      company,
      jobprofile,
      linkedin,
      placementtype,
      companytype,
      videoUrl,
    } = req.body;

    // Validate required fields
    if (!name || !company || !jobprofile || !placementtype || !videoUrl) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    // Create new experience entry
    const newExperience = new Experience({
      name,
      company,
      jobProfile: jobprofile,
      linkedIn: linkedin,
      placementType: placementtype,
      companyType: companytype,
      file: videoUrl, // storing video URL in 'file' field
    });

    // Save to MongoDB
    await newExperience.save();

    res.status(200).json({ message: "Experience saved successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Error saving experience",
      error: err.message,
    });
  }
});


router.get("/all", async (req, res) => {
  try {
    // Fetch all experiences (newest first)
    const experiences = await Experience.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Experiences fetched successfully",
      data: experiences,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching experiences",
      error: err.message,
    });
  }
});

export default router;
