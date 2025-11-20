"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Users, Settings } from "lucide-react";

const PERMISSION_CATEGORIES = {
  "Dashboard Access": [
    { key: "dashboardAccess", label: "Dashboard Access", description: "Can access the main dashboard" },
    { key: "canViewOverview", label: "View Overview", description: "Can view organization overview" },
    { key: "canViewEmployees", label: "View Employees", description: "Can view employee section" },
    { key: "canViewDepartments", label: "View Departments", description: "Can view departments section" },
    { key: "canViewRoleAssignment", label: "View Role Assignment", description: "Can view role assignment section" },
    { key: "canViewPayroll", label: "View Payroll", description: "Can view payroll section" },
    { key: "canViewPerformance", label: "View Performance", description: "Can view performance section" },
    { key: "canViewPermissions", label: "View Permissions", description: "Can view permissions settings" },
  ],
  "Employee Management": [
    { key: "canInviteEmployees", label: "Invite Employees", description: "Can send employee invitations" },
    { key: "canAssignRoles", label: "Assign Roles", description: "Can assign roles to employees" },
    { key: "canEditEmployeeProfiles", label: "Edit Employee Profiles", description: "Can edit employee information" },
    { key: "canDeleteEmployees", label: "Delete Employees", description: "Can remove employees" },
  ],
  "Department Management": [
    { key: "canCreateDepartments", label: "Create Departments", description: "Can create new departments" },
    { key: "canEditDepartments", label: "Edit Departments", description: "Can modify department information" },
    { key: "canDeleteDepartments", label: "Delete Departments", description: "Can remove departments" },
  ],
  "Payroll & Performance": [
    { key: "canSetPayroll", label: "Set Payroll", description: "Can set employee payroll information" },
    { key: "canViewAllPayroll", label: "View All Payroll", description: "Can view all employees' payroll" },
    { key: "canViewOwnPayroll", label: "View Own Payroll", description: "Can view own payroll information" },
    { key: "canSetPerformanceReviews", label: "Set Performance Reviews", description: "Can create performance reviews" },
    { key: "canViewAllPerformance", label: "View All Performance", description: "Can view all performance data" },
    { key: "canViewOwnPerformance", label: "View Own Performance", description: "Can view own performance data" },
  ],
  "System Access": [
    { key: "canViewOrgChart", label: "View Organization Chart", description: "Can access organization chart" },
    { key: "canAccessChatbot", label: "Access Chatbot", description: "Can use organization chatbot" },
  ],
};

const ACCESS_SCOPES = [
  { value: "all", label: "All Employees", description: "Can manage all employees in the organization" },
  { value: "department", label: "Department Only", description: "Can only manage employees in their department" },
  { value: "subfunction", label: "Subfunction Only", description: "Can only manage employees in their subfunction" },
  { value: "none", label: "No Management Access", description: "Cannot manage other employees" },
];

export function Permissions({
  permissions,
  onPermissionChange,
  selectedRole,
  onSelectRole,
  loading
}) {
  const roles = ["HOD", "Team Lead", "Team Member"];
  const currentRolePermissions = permissions[selectedRole] || {};

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1">
        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Select Role
          </h3>
          <div className="space-y-2">
            {roles.map(role => (
              <button
                key={role}
                onClick={() => onSelectRole(role)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedRole === role
                    ? "bg-blue-100 text-blue-900 border-2 border-blue-300"
                    : "bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100"
                }`}
              >
                <div className="font-medium">{role}</div>
                <div className="text-sm text-gray-500">
                  {role === "HOD" && "Head of Department"}
                  {role === "Team Lead" && "Team Leader"}
                  {role === "Team Member" && "Team Member"}
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>

      <div className="lg:col-span-3">
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Configure Permissions for {selectedRole}
          </h3>

          <div className="space-y-8">
            {Object.entries(PERMISSION_CATEGORIES).map(([category, categoryPermissions]) => (
              <div key={category}>
                <h4 className="font-medium text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  {category}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categoryPermissions.map(permission => (
                    <div key={permission.key} className="flex items-start space-x-3">
                      <div className="flex items-center h-5">
                        <input
                          type="checkbox"
                          id={`${selectedRole}-${permission.key}`}
                          checked={currentRolePermissions[permission.key] || false}
                          onChange={(e) => onPermissionChange(selectedRole, permission.key, e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex-1">
                        <Label
                          htmlFor={`${selectedRole}-${permission.key}`}
                          className="text-sm font-medium text-gray-900 cursor-pointer"
                        >
                          {permission.label}
                        </Label>
                        <p className="text-xs text-gray-500 mt-1">
                          {permission.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {selectedRole === "HOD" && (
              <div>
                <h4 className="font-medium text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Access Scope
                </h4>
                <div className="space-y-3">
                  {ACCESS_SCOPES.map(scope => (
                    <div key={scope.value} className="flex items-start space-x-3">
                      <div className="flex items-center h-5">
                        <input
                          type="radio"
                          id={`scope-${scope.value}`}
                          name="accessScope"
                          value={scope.value}
                          checked={currentRolePermissions.accessScope === scope.value}
                          onChange={(e) => onPermissionChange(selectedRole, "accessScope", e.target.value)}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex-1">
                        <Label
                          htmlFor={`scope-${scope.value}`}
                          className="text-sm font-medium text-gray-900 cursor-pointer"
                        >
                          {scope.label}
                        </Label>
                        <p className="text-xs text-gray-500 mt-1">
                          {scope.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
