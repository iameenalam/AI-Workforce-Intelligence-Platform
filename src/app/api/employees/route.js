import { connectDb } from "@/connectDb";
import { NextResponse } from "next/server";
import { Employee } from "../../../../models/Employee";
import { Department } from "../../../../models/Departments";
import { Organization } from "../../../../models/Organization";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUD_NAME,
  api_key: process.env.CLOUD_API,
  api_secret: process.env.CLOUD_SECRET,
});

// GET - Fetch all employees for a user
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

    // Get user's organization (either as creator or as linked organization)
    const organization = await Organization.findOne({ user: userId });
    let organizationId;

    if (organization) {
      // User is organization creator
      organizationId = organization._id;
    } else {
      // User might be an invited employee, get their linked organization
      const { User } = await import("../../../../models/User");
      const user = await User.findById(userId);
      if (user && user.linkedOrganization) {
        organizationId = user.linkedOrganization;
      } else {
        return NextResponse.json({ employees: [] }, { status: 200 });
      }
    }

    // Fetch employees by organization, not by user
    const employees = await Employee.find({ organization: organizationId })
      .populate("department", "departmentName")
      .populate("organization", "name")
      .populate("user", "name email") // Also populate user info
      .sort({ createdAt: -1 });

    return NextResponse.json({ employees }, { status: 200 });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json(
      { message: "Failed to fetch employees" },
      { status: 500 }
    );
  }
}

// POST - Create a new employee (invite employee)
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
    const formData = await request.formData();
    const name = formData.get("name");
    const email = formData.get("email");
    const pic = formData.get("pic");
    if (!name || !email) {
      return NextResponse.json(
        { message: "Name and email are required" },
        { status: 400 }
      );
    }
    // Get user's organization
    const organization = await Organization.findOne({ user: userId });
    if (!organization) {
      return NextResponse.json(
        { message: "Organization not found" },
        { status: 404 }
      );
    }
    // Check if invitation already sent (pending) for this email/org
    const { Invitation } = await import("../../../../models/Invitation");
    const existingInvitation = await Invitation.findOne({
      email,
      organization: organization._id,
      status: "pending",
      expiresAt: { $gt: new Date() },
    });
    if (existingInvitation) {
      return NextResponse.json(
        { message: "Invitation already sent to that employee email" },
        { status: 400 }
      );
    }
    // Check if employee with this email already exists in this organization
    const existingEmployee = await Employee.findOne({
      email,
      organization: organization._id,
    });
    if (existingEmployee) {
      return NextResponse.json(
        { message: "Employee with this email is already in your organization" },
        { status: 400 }
      );
    }
    // Check if employee with this email exists in another organization
    const employeeInOtherOrg = await Employee.findOne({
      email,
      organization: { $ne: organization._id },
    });
    if (employeeInOtherOrg) {
      return NextResponse.json(
        { message: "Employee is already part of another organization" },
        { status: 400 }
      );
    }
    // Check if user with this email exists and is linked to another org
    const { User } = await import("../../../../models/User");
    const userWithEmail = await User.findOne({ email });
    if (userWithEmail && userWithEmail.linkedOrganization && userWithEmail.linkedOrganization.toString() !== organization._id.toString()) {
      return NextResponse.json(
        { message: "Employee is already part of another organization" },
        { status: 400 }
      );
    }
    let picUrl = "";
    if (pic && pic.size > 0) {
      const bytes = await pic.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadResult = await cloudinary.uploader.upload(
        `data:${pic.type};base64,${buffer.toString("base64")}`,
        {
          folder: "employee_pics",
          resource_type: "image",
        }
      );
      picUrl = uploadResult.secure_url;
    }
    // Create the employee (invited)
    const employee = new Employee({
      name,
      email,
      pic: picUrl,
      organization: organization._id,
      user: userId,
      role: "Unassigned",
      invited: true,
    });
    await employee.save();
    const populatedEmployee = await Employee.findById(employee._id)
      .populate("department", "departmentName")
      .populate("organization", "name");
    return NextResponse.json(
      {
        employee: populatedEmployee,
        message: "Employee(s) invited successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating employee:", error);
    return NextResponse.json(
      { message: "Failed to create employee" },
      { status: 500 }
    );
  }
}

// PUT - Update employee role and department assignment
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
    const { employeeId, role, departmentId, subfunctionIndex } = await request.json();
    if (!employeeId) {
      return NextResponse.json(
        { message: "Employee ID is required" },
        { status: 400 }
      );
    }
    const { Organization } = await import("../../../../models/Organization");
    const organization = await Organization.findOne({ user: userId });
    let employee;
    if (organization) {
      employee = await Employee.findOne({
        _id: employeeId,
        organization: organization._id,
      });
    } else {
      employee = await Employee.findOne({
        _id: employeeId,
        user: userId,
      });
    }
    if (!employee) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 }
      );
    }
    // Update only provided fields, skip unnecessary lookups
    if (role !== undefined) employee.role = role;
    if (departmentId !== undefined) employee.department = departmentId;
    if (subfunctionIndex !== undefined) employee.subfunctionIndex = subfunctionIndex;
    // Remove complex reporting structure logic for speed
    if (role !== undefined && departmentId !== undefined) {
      employee.reportsTo = "";
    }
    await employee.save();
    const updatedEmployee = await Employee.findById(employee._id)
      .populate("department", "departmentName")
      .populate("organization", "name");
    return NextResponse.json(
      {
        employee: updatedEmployee,
        message: "Employee updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating employee:", error);
    return NextResponse.json(
      { message: "Failed to update employee" },
      { status: 500 }
    );
  }
}

// DELETE - Delete an employee
export async function DELETE(request) {
  try {
    await connectDb();
    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SEC);
    const userId = decoded.id;
    const url = new URL(request.url);
    const employeeId = url.searchParams.get("id");
    if (!employeeId) {
      return NextResponse.json(
        { message: "Employee ID is required" },
        { status: 400 }
      );
    }
    // Try to find org by user
    const organization = await Organization.findOne({ user: userId });
    let employee;
    if (organization) {
      // Org creator: can delete any employee in org
      employee = await Employee.findOneAndDelete({ _id: employeeId, organization: organization._id });
    } else {
      // Regular user: can delete their own employee record
      employee = await Employee.findOneAndDelete({ _id: employeeId, user: userId });
    }
    if (!employee) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Employee deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting employee:", error);
    return NextResponse.json(
      { message: "Failed to delete employee" },
      { status: 500 }
    );
  }
}
