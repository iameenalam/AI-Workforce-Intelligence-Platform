import { connectDb } from "@/connectDb";
import { NextResponse } from "next/server";
import { Permission } from "../../../../models/Permission";
import { Organization } from "../../../../models/Organization";
import { Employee } from "../../../../models/Employee";
import { User } from "../../../../models/User";
import jwt from "jsonwebtoken";

// GET - Fetch permissions for an organization
export async function GET(request) {
  try {
    await connectDb();

    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SEC);
    const userId = decoded.id;

    // Get user's organization and verify admin access
    const organization = await Organization.findOne({ user: userId });
    if (!organization) {
      return NextResponse.json(
        { message: "Organization not found" },
        { status: 404 }
      );
    }

    // Only organization owner (admin) can view permissions
    if (organization.user.toString() !== userId) {
      return NextResponse.json(
        { message: "Access denied. Admin privileges required." },
        { status: 403 }
      );
    }

    // Get all permissions for this organization
    const permissions = await Permission.find({ organization: organization._id });

    // If no permissions exist, create default ones
    if (permissions.length === 0) {
      const roles = ["Admin", "HOD", "Team Lead", "Team Member"];
      const defaultPermissions = [];

      for (const role of roles) {
        const defaultPerms = Permission.getDefaultPermissions(role);
        const permission = new Permission({
          organization: organization._id,
          role,
          ...defaultPerms,
        });
        await permission.save();
        defaultPermissions.push(permission);
      }

      return NextResponse.json({ permissions: defaultPermissions }, { status: 200 });
    }

    return NextResponse.json({ permissions }, { status: 200 });
  } catch (error) {
    console.error("Error fetching permissions:", error);
    return NextResponse.json(
      { message: "Failed to fetch permissions" },
      { status: 500 }
    );
  }
}

// PUT - Update permissions for a role
export async function PUT(request) {
  try {
    await connectDb();

    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SEC);
    const userId = decoded.id;

    const { role, permissions: newPermissions } = await request.json();

    if (!role || !newPermissions) {
      return NextResponse.json(
        { message: "Role and permissions are required" },
        { status: 400 }
      );
    }

    // Get user's organization and verify admin access
    const organization = await Organization.findOne({ user: userId });
    if (!organization) {
      return NextResponse.json(
        { message: "Organization not found" },
        { status: 404 }
      );
    }

    // Only organization owner (admin) can update permissions
    if (organization.user.toString() !== userId) {
      return NextResponse.json(
        { message: "Access denied. Admin privileges required." },
        { status: 403 }
      );
    }

    // Prevent admin from removing their own admin permissions
    if (role === "Admin") {
      return NextResponse.json(
        { message: "Cannot modify Admin permissions" },
        { status: 400 }
      );
    }

    // Update or create permission record
    const permission = await Permission.findOneAndUpdate(
      { organization: organization._id, role },
      { ...newPermissions },
      { new: true, upsert: true, runValidators: true }
    );

    return NextResponse.json({
      message: `Permissions updated for ${role}`,
      permission,
    }, { status: 200 });
  } catch (error) {
    console.error("Error updating permissions:", error);
    return NextResponse.json(
      { message: "Failed to update permissions" },
      { status: 500 }
    );
  }
}

// POST - Initialize default permissions for an organization
export async function POST(request) {
  try {
    await connectDb();

    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SEC);
    const userId = decoded.id;

    // Get user's organization and verify admin access
    const organization = await Organization.findOne({ user: userId });
    if (!organization) {
      return NextResponse.json(
        { message: "Organization not found" },
        { status: 404 }
      );
    }

    // Only organization owner (admin) can initialize permissions
    if (organization.user.toString() !== userId) {
      return NextResponse.json(
        { message: "Access denied. Admin privileges required." },
        { status: 403 }
      );
    }

    // Check if permissions already exist
    const existingPermissions = await Permission.find({ organization: organization._id });
    if (existingPermissions.length > 0) {
      return NextResponse.json(
        { message: "Permissions already initialized" },
        { status: 400 }
      );
    }

    // Create default permissions for all roles
    const roles = ["Admin", "HOD", "Team Lead", "Team Member"];
    const permissions = [];

    for (const role of roles) {
      const defaultPerms = Permission.getDefaultPermissions(role);
      const permission = new Permission({
        organization: organization._id,
        role,
        ...defaultPerms,
      });
      await permission.save();
      permissions.push(permission);
    }

    return NextResponse.json({
      message: "Default permissions initialized",
      permissions,
    }, { status: 201 });
  } catch (error) {
    console.error("Error initializing permissions:", error);
    return NextResponse.json(
      { message: "Failed to initialize permissions" },
      { status: 500 }
    );
  }
}
