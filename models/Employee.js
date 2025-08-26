import mongoose from "mongoose";

// Experience Schema
const ExperienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  duration: { type: String, required: true },
  description: { type: String }
}, { _id: false });

// Education Schema
const EducationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  duration: { type: String, required: true },
  description: { type: String }
}, { _id: false });

// Certification Schema
const CertificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  issuer: { type: String, required: true },
  duration: { type: String, required: true },
  description: { type: String }
}, { _id: false });

// Payroll Schema
const PayrollSchema = new mongoose.Schema({
  baseSalary: { type: Number, required: true },
  bonus: { type: Number, default: 0 },
  stockOptions: { type: Number, default: 0 },
  lastRaiseDate: { type: Date, default: Date.now }
}, { _id: false });

// Performance Goal Schema
const GoalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  targetDate: { type: Date, required: true },
  completion: { type: Number, default: 0, min: 0, max: 100 },
  status: {
    type: String,
    enum: ["not_started", "in_progress", "completed", "overdue"],
    default: "not_started"
  }
}, { _id: false });

// Performance Schema
const PerformanceSchema = new mongoose.Schema({
  overallCompletion: { type: Number, default: 0, min: 0, max: 100 },
  goals: { type: [GoalSchema], default: [] },
  reviewCadence: { type: Number, default: 2 }, // reviews per year
  lastReviewDate: { type: Date, default: null },
  nextReviewDate: { type: Date, default: null }
}, { _id: false });

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    pic: { type: String, default: "" },
    
    // Role assignment - can be unassigned initially
    role: { 
      type: String, 
      enum: ["HOD", "Team Lead", "Team Member", "Unassigned"], 
      default: "Unassigned" 
    },
    
    // Department assignment - optional for unassigned employees
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null
    },
    
    // Subfunction assignment - optional
    subfunctionIndex: { type: Number, default: null },
    
    // Organization and user references
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
    
    // CV and professional details
    cvUrl: { type: String, default: "" },
    skills: { type: [String], default: [] },
    tools: { type: [String], default: [] },
    certifications: { type: [CertificationSchema], default: [] },
    experience: { type: [ExperienceSchema], default: [] },
    education: { type: [EducationSchema], default: [] },
    
    // Invitation status
    invited: { type: Boolean, default: false },

    // Reporting structure - will be determined by role and department assignment
    reportsTo: { type: String, default: "" },

    // Payroll information
    payroll: { type: PayrollSchema, default: null },

    // Performance tracking
    performance: { type: PerformanceSchema, default: null }
  },
  { timestamps: true }
);

// Index for efficient queries
employeeSchema.index({ organization: 1, user: 1 });
employeeSchema.index({ department: 1, role: 1 });
employeeSchema.index({ role: 1 });

// Clean up existing model if it exists
if (mongoose.models.Employee) {
  delete mongoose.models.Employee;
}

export const Employee = mongoose.model("Employee", employeeSchema);
