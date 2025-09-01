"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import { Shield, Users, Settings, Eye, EyeOff, Save, RotateCcw } from "lucide-react";

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

export function Permissions() {
  const { organization } = useSelector((state) => state.organization);
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedRole, setSelectedRole] = useState("HOD");
  const [hasChanges, setHasChanges] = useState(false);
  const [originalPermissions, setOriginalPermissions] = useState({});

  const roles = ["HOD", "Team Lead", "Team Member"];

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const token = Cookies.get("token");
      const { data } = await axios.get("/api/permissions", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const permissionsMap = {};
      data.permissions.forEach(perm => {
        permissionsMap[perm.role] = perm;
      });

      setPermissions(permissionsMap);
      setOriginalPermissions(JSON.parse(JSON.stringify(permissionsMap)));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching permissions:", error);
      toast.error("Failed to load permissions");
      setLoading(false);
    }
  };

  const handlePermissionChange = (role, permissionKey, value) => {
    setPermissions(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [permissionKey]: value,
      }
    }));
    setHasChanges(true);
  };

  const handleSavePermissions = async () => {
    setSaving(true);
    try {
      const token = Cookies.get("token");
      
      for (const role of roles) {
        if (permissions[role]) {
          await axios.put("/api/permissions", {
            role,
            permissions: permissions[role],
          }, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }
      }

      toast.success("Permissions updated successfully");
      setHasChanges(false);
      setOriginalPermissions(JSON.parse(JSON.stringify(permissions)));
    } catch (error) {
      console.error("Error saving permissions:", error);
      toast.error("Failed to save permissions");
    } finally {
      setSaving(false);
    }
  };

  const handleResetPermissions = () => {
    setPermissions(JSON.parse(JSON.stringify(originalPermissions)));
    setHasChanges(false);
  };

  const currentRolePermissions = permissions[selectedRole] || {};

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Role Permissions</h2>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetPermissions}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          )}
          <Button
            onClick={handleSavePermissions}
            disabled={!hasChanges || saving}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Role Selection */}
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
                  onClick={() => setSelectedRole(role)}
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

        {/* Permissions Configuration */}
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
                            onChange={(e) => handlePermissionChange(selectedRole, permission.key, e.target.checked)}
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

              {/* Access Scope for HOD */}
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
                            onChange={(e) => handlePermissionChange(selectedRole, "accessScope", e.target.value)}
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

      {hasChanges && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-yellow-800">
            <Settings className="w-4 h-4" />
            <span className="font-medium">Unsaved Changes</span>
          </div>
          <p className="text-yellow-700 text-sm mt-1">
            You have unsaved permission changes. Click "Save Changes" to apply them.
          </p>
        </div>
      )}
    </div>
  );
}
