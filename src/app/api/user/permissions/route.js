import { connectDb } from "@/connectDb";
import { NextResponse } from "next/server";
import { User } from "../../../../../models/User";
import { Organization } from "../../../../../models/Organization";
import { Employee } from "../../../../../models/Employee";
import { Permission } from "../../../../../models/Permission";
import jwt from "jsonwebtoken";

// GET - Get current user's role and permissions
export async function GET(request) {
  try {
    await connectDb();

    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SEC);
    const user = await User.findById(decoded.id);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Check if user is organization creator (Admin)
    const organization = await Organization.findOne({ user: user._id });

    if (organization) {
      // User is the organization creator - they have full admin access
      const adminPermissions = Permission.getDefaultPermissions("Admin");

      return NextResponse.json({
        role: "Admin",
        permissions: adminPermissions,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          systemRole: "Admin",
        },
        organization: {
          _id: organization._id,
          name: organization.name,
        },
        employee: null,
      }, { status: 200 });
    }

    // User is an invited employee - check their employee record and permissions
    const employee = await Employee.findOne({
      user: user._id,
      organization: user.linkedOrganization
    }).populate("organization");

    if (!employee) {
      // User is not an employee and doesn't own an organization
      // They should go to chart page and can create organization there
      const adminPermissions = Permission.getDefaultPermissions("Admin");

      return NextResponse.json({
        role: "Admin", // Treat as admin so they can create organization
        permissions: adminPermissions,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          systemRole: "Admin",
        },
        organization: null,
        employee: null,
      }, { status: 200 });
    }

    // If employee role is unassigned, return minimal permissions
    if (employee.role === "Unassigned" || !employee.role) {
      return NextResponse.json({
        role: "Unassigned",
        permissions: {
          dashboardAccess: false,
          canViewOrgChart: true,
          // All other permissions false
        },
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          systemRole: user.systemRole,
        },
        organization: {
          _id: employee.organization._id,
          name: employee.organization.name,
        },
        employee: {
          _id: employee._id,
          name: employee.name,
          role: employee.role || "Unassigned",
          department: employee.department,
        },
      }, { status: 200 });
    }

    // Get role permissions for assigned employees
    const permission = await Permission.findOne({
      organization: employee.organization._id,
      role: employee.role,
    });

    const permissions = permission ? permission.toObject() : Permission.getDefaultPermissions(employee.role);

    return NextResponse.json({
      role: employee.role,
      permissions,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        systemRole: user.systemRole,
      },
      organization: {
        _id: employee.organization._id,
        name: employee.organization.name,
      },
      employee: {
        _id: employee._id,
        name: employee.name,
        role: employee.role,
        department: employee.department,
      },
    }, { status: 200 });
  } catch (error) {
    console.error("Error getting user permissions:", error);
    return NextResponse.json(
      { message: "Failed to get user permissions" },
      { status: 500 }
    );
  }
}
