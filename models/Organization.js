import mongoose from "mongoose";

const ExperienceSchema = new mongoose.Schema({
  title: String,
  company: String,
  duration: String,
  description: String,
}, { _id: false });

const EducationSchema = new mongoose.Schema({
  degree: String,
  institution: String,
  year: String,
}, { _id: false });

const CertificationSchema = new mongoose.Schema({
    title: String,
    issuer: String,
    duration: String,
}, { _id: false });

const organizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logoUrl: { type: String, default: "" },
  ceoName: { type: String, required: true },
  email: { type: String, required: true, match: [/^\S+@\S+\.\S+$/, "Invalid email"] },
  ceoPic: String,
  industry: { type: String, required: true, enum: [
    "Healthcare and Social Assistance", "Finance and Insurance",
    "Professional, Scientific and Technical Services",
    "Information Technology (IT) and Software", "Telecommunications"
  ]},
  companySize: { type: String, required: true, enum: [
    "150-300", "300-450", "450-600", "600-850", "850-1000", "1000+", "5000+"
  ]},
  city: { type: String, required: true },
  country: { type: String, required: true },
  yearFounded: { type: Number, required: true },
  organizationType: { type: String, required: true, enum: ["Private", "Public", "Non-Profit", "Government"] },
  numberOfOffices: { type: Number, required: true, min: 0 },
  hrToolsUsed: { type: String, required: true },
  hiringLevel: { type: String, required: true, enum: ["Low", "Moderate", "High"] },
  workModel: { type: String, required: true, enum: ["Onsite", "Remote", "Hybrid", "Mixed"] },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  cvUrl: { type: String, default: "" },
  ceoSkills: { type: [String], default: [] },
  ceoTools: { type: [String], default: [] },
  ceoCertifications: { type: [CertificationSchema], default: [] },
  ceoExperience: { type: [ExperienceSchema], default: [] },
  ceoEducation: { type: [EducationSchema], default: [] }
}, { timestamps: true });

export const Organization = mongoose.models.Organization || mongoose.model("Organization", organizationSchema);
