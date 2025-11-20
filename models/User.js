import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String, unique: true, sparse: true },

    // Invitation tracking
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    invitationToken: {
      type: String,
      default: null,
    },
    invitationAcceptedAt: {
      type: Date,
      default: null,
    },

    // Organization linking for invited users
    linkedOrganization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      default: null,
    },

    // User role in the system (different from employee role)
    systemRole: {
      type: String,
      enum: ["Admin", "Employee"],
      default: "Employee",
    },
  },
  { timestamps: true }
);

mongoose.models = {};
export const User = mongoose.model("User", schema);
