import mongoose from "mongoose";

const ExperienceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  company: { type: String, required: true },
  jobProfile: { type: String, required: true },
  linkedIn: { type: String,},
  placementType: { type: String, required: true },
  companyType: { type: String,},
  file: { type: String, required: true},
});

const Experience = mongoose.model("Experience", ExperienceSchema);

export default Experience;
