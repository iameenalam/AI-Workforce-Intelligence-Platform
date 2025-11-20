import mongoose from "mongoose";

const invitationSchema = new mongoose.Schema(
  {
    // Basic invitation info
    email: {
      type: String,
      required: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    name: {
      type: String,
      required: true,
    },
    
    // Invitation token and status
    token: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "expired"],
      default: "pending",
    },
    
    // Organization and inviter info
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    // File uploads during invitation
    picUrl: {
      type: String,
      default: "",
    },
    cvUrl: {
      type: String,
      default: "",
    },
    
    // Expiration
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    },
    
    // Acceptance tracking
    acceptedAt: {
      type: Date,
      default: null,
    },
    acceptedByUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    
    // Employee record created after acceptance
    employeeRecord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },
  },
  { timestamps: true }
);

// Index for efficient queries
invitationSchema.index({ email: 1, organization: 1 });

// Clean up expired invitations
invitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

mongoose.models = {};
export const Invitation = mongoose.model("Invitation", invitationSchema);
