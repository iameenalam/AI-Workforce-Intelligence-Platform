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
    location: String,
    duration: String,
}, { _id: false });

const teamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, required: true },
    reportTo: { type: String, required: true },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    subfunctionIndex: { type: Number, required: true },
    invited: { type: Boolean, default: false },

    cvUrl: { type: String, default: "" },
    skills: { type: [String], default: [] },
    tools: { type: [String], default: [] },
    certifications: { type: [CertificationSchema], default: [] },
    experience: { type: [ExperienceSchema], default: [] },
    education: { type: [EducationSchema], default: [] }
  },
  { timestamps: true }
);

if (mongoose.models.TeamMember) {
  delete mongoose.models.TeamMember;
}

export const TeamMember = mongoose.model("TeamMember", teamMemberSchema);
