import mongoose from "mongoose";

// Define permission schema for role-based access control
const permissionSchema = new mongoose.Schema(
  {
    // Organization this permission set belongs to
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    
    // Role this permission applies to
    role: {
      type: String,
      enum: ["Admin", "HOD", "Team Lead", "Team Member"],
      required: true,
    },
    
    // Dashboard access permissions
    dashboardAccess: {
      type: Boolean,
      default: false,
    },
    
    // Specific dashboard sections access
    canViewOverview: {
      type: Boolean,
      default: false,
    },
    canViewEmployees: {
      type: Boolean,
      default: false,
    },
    canViewDepartments: {
      type: Boolean,
      default: false,
    },
    canViewRoleAssignment: {
      type: Boolean,
      default: false,
    },
    canViewPayroll: {
      type: Boolean,
      default: false,
    },
    canViewPerformance: {
      type: Boolean,
      default: false,
    },
    canViewPermissions: {
      type: Boolean,
      default: false,
    },
    
    // Employee management permissions
    canInviteEmployees: {
      type: Boolean,
      default: false,
    },
    canAssignRoles: {
      type: Boolean,
      default: false,
    },
    canEditEmployeeProfiles: {
      type: Boolean,
      default: false,
    },
    canDeleteEmployees: {
      type: Boolean,
      default: false,
    },
    
    // Department management permissions
    canCreateDepartments: {
      type: Boolean,
      default: false,
    },
    canEditDepartments: {
      type: Boolean,
      default: false,
    },
    canDeleteDepartments: {
      type: Boolean,
      default: false,
    },
    
    // Payroll permissions
    canSetPayroll: {
      type: Boolean,
      default: false,
    },
    canViewAllPayroll: {
      type: Boolean,
      default: false,
    },
    canViewOwnPayroll: {
      type: Boolean,
      default: false,
    },
    
    // Performance permissions
    canSetPerformanceReviews: {
      type: Boolean,
      default: false,
    },
    canViewAllPerformance: {
      type: Boolean,
      default: false,
    },
    canViewOwnPerformance: {
      type: Boolean,
      default: false,
    },
    
    // Organization chart access
    canViewOrgChart: {
      type: Boolean,
      default: true, // All roles can view org chart by default
    },
    
    // Chatbot access
    canAccessChatbot: {
      type: Boolean,
      default: false,
    },
    
    // Scope of access (for HODs - which employees they can manage)
    accessScope: {
      type: String,
      enum: ["all", "department", "subfunction", "none"],
      default: "none",
    },
  },
  { timestamps: true }
);

// Ensure unique permission set per role per organization
permissionSchema.index({ organization: 1, role: 1 }, { unique: true });

// Static method to get default permissions for each role
permissionSchema.statics.getDefaultPermissions = function(role) {
  const defaults = {
    Admin: {
      dashboardAccess: true,
      canViewOverview: true,
      canViewEmployees: true,
      canViewDepartments: true,
      canViewRoleAssignment: true,
      canViewPayroll: true,
      canViewPerformance: true,
      canViewPermissions: true,
      canInviteEmployees: true,
      canAssignRoles: true,
      canEditEmployeeProfiles: true,
      canDeleteEmployees: true,
      canCreateDepartments: true,
      canEditDepartments: true,
      canDeleteDepartments: true,
      canSetPayroll: true,
      canViewAllPayroll: true,
      canViewOwnPayroll: true,
      canSetPerformanceReviews: true,
      canViewAllPerformance: true,
      canViewOwnPerformance: true,
      canViewOrgChart: true,
      canAccessChatbot: true,
      accessScope: "all",
    },
    HOD: {
      dashboardAccess: true,
      canViewOverview: false,
      canViewEmployees: true,
      canViewDepartments: false,
      canViewRoleAssignment: true,
      canViewPayroll: true,
      canViewPerformance: true,
      canViewPermissions: false,
      canInviteEmployees: false,
      canAssignRoles: true,
      canEditEmployeeProfiles: true,
      canDeleteEmployees: false,
      canCreateDepartments: false,
      canEditDepartments: false,
      canDeleteDepartments: false,
      canSetPayroll: true,
      canViewAllPayroll: false,
      canViewOwnPayroll: true,
      canSetPerformanceReviews: true,
      canViewAllPerformance: false,
      canViewOwnPerformance: true,
      canViewOrgChart: true,
      canAccessChatbot: false,
      accessScope: "department",
    },
    "Team Lead": {
      dashboardAccess: false,
      canViewOverview: false,
      canViewEmployees: false,
      canViewDepartments: false,
      canViewRoleAssignment: false,
      canViewPayroll: false,
      canViewPerformance: false,
      canViewPermissions: false,
      canInviteEmployees: false,
      canAssignRoles: false,
      canEditEmployeeProfiles: false,
      canDeleteEmployees: false,
      canCreateDepartments: false,
      canEditDepartments: false,
      canDeleteDepartments: false,
      canSetPayroll: false,
      canViewAllPayroll: false,
      canViewOwnPayroll: true,
      canSetPerformanceReviews: false,
      canViewAllPerformance: false,
      canViewOwnPerformance: true,
      canViewOrgChart: true,
      canAccessChatbot: false,
      accessScope: "none",
    },
    "Team Member": {
      dashboardAccess: false,
      canViewOverview: false,
      canViewEmployees: false,
      canViewDepartments: false,
      canViewRoleAssignment: false,
      canViewPayroll: false,
      canViewPerformance: false,
      canViewPermissions: false,
      canInviteEmployees: false,
      canAssignRoles: false,
      canEditEmployeeProfiles: false,
      canDeleteEmployees: false,
      canCreateDepartments: false,
      canEditDepartments: false,
      canDeleteDepartments: false,
      canSetPayroll: false,
      canViewAllPayroll: false,
      canViewOwnPayroll: true,
      canSetPerformanceReviews: false,
      canViewAllPerformance: false,
      canViewOwnPerformance: true,
      canViewOrgChart: true,
      canAccessChatbot: false,
      accessScope: "none",
    },
  };
  
  return defaults[role] || {};
};

mongoose.models = {};
export const Permission = mongoose.model("Permission", permissionSchema);
