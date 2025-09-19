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

    // Check if employee with this email already exists in this organization
    const existingEmployee = await Employee.findOne({
      email,
      organization: organization._id,
    });

    if (existingEmployee) {
      return NextResponse.json(
        { message: "Employee with this email already exists" },
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

    const employee = new Employee({
      name,
      email,
      pic: picUrl,
      organization: organization._id,
      user: userId,
      role: "Unassigned", // Default to unassigned
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

    // Check if user has permission to update this employee
    const { Organization } = await import("../../../../models/Organization");
    const organization = await Organization.findOne({ user: userId });

    let employee;
    if (organization) {
      // User is organization creator, can update any employee in their organization
      employee = await Employee.findOne({
        _id: employeeId,
        organization: organization._id,
      });
    } else {
      // User might be updating their own employee record
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

    // Update employee fields
    if (role) employee.role = role;
    if (departmentId) {
      employee.department = departmentId;
    } else if (departmentId === null) {
      employee.department = null;
    }
    if (subfunctionIndex !== undefined) employee.subfunctionIndex = subfunctionIndex;

    // Set reporting structure based on role and department
    if (role && departmentId) {
      const organization = await Organization.findById(employee.organization);
      if (role === "HOD") {
        employee.reportsTo = organization?.ceoName || "";
      } else if (role === "Team Lead" || role === "Team Member") {
        // Find HOD of the department
        const hod = await Employee.findOne({
          department: departmentId,
          role: "HOD",
          user: userId,
        });
        employee.reportsTo = hod?.name || "";
      }
    } else {
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

    const employee = await Employee.findOneAndDelete({
      _id: employeeId,
      user: userId,
    });

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
