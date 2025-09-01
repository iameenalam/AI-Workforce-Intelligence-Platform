import { connectDb } from "@/connectDb";
import { NextResponse } from "next/server";
import { Employee } from "../../../../../models/Employee";
import jwt from "jsonwebtoken";

export async function GET(request, context) {
  try {
    const { id } = await context.params;
    await connectDb();

    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    jwt.verify(token, process.env.JWT_SEC);

    if (!id) {
      return NextResponse.json({ message: "Missing employee ID" }, { status: 400 });
    }

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json({ message: "Invalid employee ID format" }, { status: 400 });
    }

    const employee = await Employee.findById(id)
      .populate("organization", "name ceoName")
      .populate("department", "departmentName subfunctions")
      .lean();

    if (!employee) {
      return NextResponse.json({ message: "Employee not found" }, { status: 404 });
    }

    return NextResponse.json(employee, { status: 200 });
  } catch (error) {
    console.error("Error fetching employee:", error);
    return NextResponse.json({ message: "Failed to fetch employee" }, { status: 500 });
  }
}

export async function PUT(request, context) {
  try {
    const { id } = await context.params;
    await connectDb();

    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SEC);
    const userId = decoded.id;

    if (!id) {
      return NextResponse.json({ message: "Missing employee ID" }, { status: 400 });
    }

    const updateData = await request.json();

    // Check if user has permission to update this employee
    // Either they're the organization creator or they're updating their own record
    const { Organization } = await import("../../../../../models/Organization");
    const { User } = await import("../../../../../models/User");

    const organization = await Organization.findOne({ user: userId });
    let canUpdate = false;

    if (organization) {
      // User is organization creator, can update any employee in their organization
      canUpdate = true;
      var employee = await Employee.findOneAndUpdate(
        { _id: id, organization: organization._id },
        updateData,
        { new: true, runValidators: true }
      )
        .populate("organization", "name ceoName")
        .populate("department", "departmentName subfunctions");
    } else {
      // User might be updating their own employee record
      var employee = await Employee.findOneAndUpdate(
        { _id: id, user: userId },
        updateData,
        { new: true, runValidators: true }
      )
        .populate("organization", "name ceoName")
        .populate("department", "departmentName subfunctions");
    }

    if (!employee) {
      console.log("Employee not found for update:", { id, userId, organizationId: organization?._id });
      return NextResponse.json({ message: "Employee not found" }, { status: 404 });
    }

    console.log("Employee updated successfully:", {
      employeeId: employee._id,
      name: employee.name,
      updatedFields: Object.keys(updateData)
    });

    return NextResponse.json({ employee, message: "Employee updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating employee:", error);
    return NextResponse.json({ message: "Failed to update employee" }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  try {
    const { id } = await context.params;
    await connectDb();

    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SEC);
    const userId = decoded.id;

    if (!id) {
      return NextResponse.json({ message: "Missing employee ID" }, { status: 400 });
    }

    // Check if user has permission to delete this employee
    const organization = await Organization.findOne({ user: userId });
    let employee;

    if (organization) {
      // User is organization creator, can delete any employee in their organization
      employee = await Employee.findOneAndDelete({ _id: id, organization: organization._id });
    } else {
      // User can only delete their own employee record (if any)
      employee = await Employee.findOneAndDelete({ _id: id, user: userId });
    }

    if (!employee) {
      return NextResponse.json({ message: "Employee not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Employee deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting employee:", error);
    return NextResponse.json({ message: "Failed to delete employee" }, { status: 500 });
  }
}
