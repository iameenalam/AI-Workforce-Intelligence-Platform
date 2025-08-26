import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { 
      type: String, 
      enum: ["performance_review", "payroll", "general"], 
      default: "general" 
    },
    isRead: { type: Boolean, default: false },
    
    // User who should receive the notification
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    // Organization context
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    
    // Employee context (if notification is about a specific employee)
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },
    
    // Additional data for the notification
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
    
    // Expiry date for the notification
    expiresAt: { type: Date, default: null }
  },
  { timestamps: true }
);

// Index for efficient queries
notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

if (mongoose.models.Notification) {
  delete mongoose.models.Notification;
}

export const Notification = mongoose.model("Notification", notificationSchema);
