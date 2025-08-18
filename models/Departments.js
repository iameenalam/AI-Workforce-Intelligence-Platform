import mongoose from "mongoose";

const subfunctionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  details: { type: String },
});

const HodExperienceSchema = new mongoose.Schema({
  title: { type: String },
  company: { type: String },
  duration: { type: String },
  description: { type: String },
}, { _id: false });

const HodEducationSchema = new mongoose.Schema({
  degree: { type: String },
  institution: { type: String },
  year: { type: String },
}, { _id: false });

const HodCertificationSchema = new mongoose.Schema({
    title: String,
    location: String,
    duration: String,
}, { _id: false });


const departmentSchema = new mongoose.Schema(
  {
    departmentName: { type: String, required: true },
    hodName: { type: String, required: true },
    hodPic: { type: String },
    hodEmail: {
      type: String,
      required: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    role: { type: String, required: true },
    departmentDetails: { type: String },
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
    subfunctions: [subfunctionSchema],

    hodCvUrl: { type: String, default: "" },
    hodSkills: { type: [String], default: [] },
    hodTools: { type: [String], default: [] },
    hodCertifications: { type: [HodCertificationSchema], default: [] },
    hodExperience: { type: [HodExperienceSchema], default: [] },
    hodEducation: { type: [HodEducationSchema], default: [] },
  },
  { timestamps: true }
);

departmentSchema.index(
  { organization: 1, user: 1, departmentName: 1 },
  { unique: true }
);

if (mongoose.models.Department) {
  delete mongoose.models.Department;
}

export const Department = mongoose.model("Department", departmentSchema);
