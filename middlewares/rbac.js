import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { Employee } from "../models/Employee";
import { Organization } from "../models/Organization";
import { Permission } from "../models/Permission";

// Check if user has required permission
export async function checkPermission(token, requiredPermission, organizationId = null) {
  try {
    if (!token) {
      return { hasPermission: false, error: "No authentication token provided" };
    }

    const decoded = jwt.verify(token, process.env.JWT_SEC);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return { hasPermission: false, error: "User not found" };
    }

    // Check if user is organization creator (Admin) - they have all permissions
    const organization = await Organization.findOne({ user: user._id });
    if (organization && (!organizationId || organization._id.toString() === organizationId)) {
      return {
        hasPermission: true,
        user,
        organization,
        role: "Admin",
        employee: null
      };
    }

    // For invited users, check their employee role and permissions
    let targetOrgId = organizationId || user.linkedOrganization;
    if (!targetOrgId) {
      return { hasPermission: false, error: "No organization context" };
    }

    const employee = await Employee.findOne({ 
      user: user._id, 
      organization: targetOrgId 
    }).populate("organization");

    if (!employee) {
      return { hasPermission: false, error: "Employee record not found" };
    }

    // Get role permissions
    const permission = await Permission.findOne({
      organization: targetOrgId,
      role: employee.role,
    });

    if (!permission) {
      // If no custom permissions, use defaults
      const defaultPerms = Permission.getDefaultPermissions(employee.role);
      const hasPermission = defaultPerms[requiredPermission] || false;
      
      return {
        hasPermission,
        user,
        organization: employee.organization,
        role: employee.role,
        employee,
        permissions: defaultPerms,
      };
    }

    const hasPermission = permission[requiredPermission] || false;

    return {
      hasPermission,
      user,
      organization: employee.organization,
      role: employee.role,
      employee,
      permissions: permission.toObject(),
    };
  } catch (error) {
    console.error("Error checking permission:", error);
    return { hasPermission: false, error: error.message };
  }
}

// Get user's role and permissions in an organization
export async function getUserRoleAndPermissions(token, organizationId = null) {
  try {
    if (!token) {
      return { role: null, permissions: null, error: "No authentication token provided" };
    }

    const decoded = jwt.verify(token, process.env.JWT_SEC);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return { role: null, permissions: null, error: "User not found" };
    }

    // Check if user is organization creator (Admin)
    const organization = await Organization.findOne({ user: user._id });
    if (organization && (!organizationId || organization._id.toString() === organizationId)) {
      const adminPermissions = Permission.getDefaultPermissions("Admin");
      return {
        role: "Admin",
        permissions: adminPermissions,
        user,
        organization,
        employee: null
      };
    }

    // For invited users, get their employee role
    let targetOrgId = organizationId || user.linkedOrganization;
    if (!targetOrgId) {
      return { role: null, permissions: null, error: "No organization context" };
    }

    const employee = await Employee.findOne({ 
      user: user._id, 
      organization: targetOrgId 
    }).populate("organization");

    if (!employee) {
      return { role: null, permissions: null, error: "Employee record not found" };
    }

    // Get role permissions
    const permission = await Permission.findOne({
      organization: targetOrgId,
      role: employee.role,
    });

    const permissions = permission ? permission.toObject() : Permission.getDefaultPermissions(employee.role);

    return {
      role: employee.role,
      permissions,
      user,
      organization: employee.organization,
      employee,
    };
  } catch (error) {
    console.error("Error getting user role and permissions:", error);
    return { role: null, permissions: null, error: error.message };
  }
}

// Middleware function for API routes
export function requirePermission(requiredPermission) {
  return async (request, context) => {
    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    
    const result = await checkPermission(token, requiredPermission);
    
    if (!result.hasPermission) {
      return NextResponse.json(
        { message: result.error || "Access denied" },
        { status: result.error === "No authentication token provided" ? 401 : 403 }
      );
    }

    // Add user context to request for use in the handler
    request.userContext = {
      user: result.user,
      organization: result.organization,
      role: result.role,
      employee: result.employee,
      permissions: result.permissions,
    };

    return null; // Continue to the actual handler
  };
}

// Check if user can access specific employees (for HOD scope)
export async function canAccessEmployee(token, targetEmployeeId) {
  try {
    const roleResult = await getUserRoleAndPermissions(token);
    
    if (!roleResult.role) {
      return { canAccess: false, error: roleResult.error };
    }

    // Admin can access all employees
    if (roleResult.role === "Admin") {
      return { canAccess: true, scope: "all" };
    }

    // HOD can access employees in their department
    if (roleResult.role === "HOD" && roleResult.permissions.accessScope === "department") {
      const targetEmployee = await Employee.findById(targetEmployeeId);
      if (!targetEmployee) {
        return { canAccess: false, error: "Target employee not found" };
      }

      // Check if target employee is in the same department
      const isSameDepartment = targetEmployee.department && 
        roleResult.employee.department && 
        targetEmployee.department.toString() === roleResult.employee.department.toString();

      return { canAccess: isSameDepartment, scope: "department" };
    }

    // Team Leads and Team Members can only access their own records
    if (targetEmployeeId === roleResult.employee._id.toString()) {
      return { canAccess: true, scope: "self" };
    }

    return { canAccess: false, error: "Access denied" };
  } catch (error) {
    console.error("Error checking employee access:", error);
    return { canAccess: false, error: error.message };
  }
}
