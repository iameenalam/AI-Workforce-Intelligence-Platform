import { connectDb } from "@/connectDb";
import { NextResponse } from "next/server";
import { Employee } from "../../../../../models/Employee";
import jwt from "jsonwebtoken";

// GET - Fetch a specific employee
export async function GET(request, { params }) {
  try {
    await connectDb();

    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    jwt.verify(token, process.env.JWT_SEC);

    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { message: "Missing employee ID" },
        { status: 400 }
      );
    }

    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json(
        { message: "Invalid employee ID format" },
        { status: 400 }
      );
    }

    console.log("Fetching employee with ID:", id);
    const employee = await Employee.findById(id)
      .populate("organization", "name ceoName")
      .populate("department", "departmentName subfunctions")
      .lean();

    console.log("Employee found:", employee ? "Yes" : "No");

    if (!employee) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(employee, { status: 200 });
  } catch (error) {
    console.error("Error fetching employee:", error);
    return NextResponse.json(
      { message: "Failed to fetch employee" },
      { status: 500 }
    );
  }
}

// PUT - Update a specific employee
export async function PUT(request, { params }) {
  try {
    await connectDb();

    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SEC);
    const userId = decoded.id;

    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { message: "Missing employee ID" },
        { status: 400 }
      );
    }

    const updateData = await request.json();

    const employee = await Employee.findOneAndUpdate(
      { _id: id, user: userId },
      updateData,
      { new: true, runValidators: true }
    )
      .populate("organization", "name ceoName")
      .populate("department", "departmentName subfunctions");

    if (!employee) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        employee,
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

// DELETE - Delete a specific employee
export async function DELETE(request, { params }) {
  try {
    await connectDb();

    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SEC);
    const userId = decoded.id;

    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { message: "Missing employee ID" },
        { status: 400 }
      );
    }

    const employee = await Employee.findOneAndDelete({
      _id: id,
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
