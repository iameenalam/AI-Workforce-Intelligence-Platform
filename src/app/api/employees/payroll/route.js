import { connectDb } from "@/connectDb";
import { NextResponse } from "next/server";
import { Employee } from "../../../../../models/Employee";
import jwt from "jsonwebtoken";

// GET - Get payroll information for all employees
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

    const url = new URL(request.url);
    const employeeId = url.searchParams.get("employeeId");

    if (employeeId) {
      // Get payroll for specific employee
      const employee = await Employee.findOne({
        _id: employeeId,
        user: userId,
      }).select("name email payroll");

      if (!employee) {
        return NextResponse.json(
          { message: "Employee not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        employee: {
          _id: employee._id,
          name: employee.name,
          email: employee.email,
          payroll: employee.payroll,
        },
      });
    } else {
      // Get payroll for all employees
      const employees = await Employee.find({ user: userId })
        .select("name email payroll role department")
        .populate("department", "departmentName");

      return NextResponse.json({ employees });
    }
  } catch (error) {
    console.error("Error fetching payroll data:", error);
    return NextResponse.json(
      { message: "Failed to fetch payroll data" },
      { status: 500 }
    );
  }
}

// POST - Create or update payroll information for an employee
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

    const { employeeId, baseSalary, bonus, stockOptions } = await request.json();

    if (!employeeId || !baseSalary) {
      return NextResponse.json(
        { message: "Employee ID and base salary are required" },
        { status: 400 }
      );
    }

    const employee = await Employee.findOne({
      _id: employeeId,
      user: userId,
    });

    if (!employee) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 }
      );
    }

    // Update payroll information - always set lastRaiseDate to now for new payroll
    employee.payroll = {
      baseSalary: Number(baseSalary),
      bonus: Number(bonus) || 0,
      stockOptions: Number(stockOptions) || 0,
      lastRaiseDate: new Date(),
    };

    await employee.save();

    return NextResponse.json({
      message: "Payroll information updated successfully",
      employee: {
        _id: employee._id,
        name: employee.name,
        email: employee.email,
        payroll: employee.payroll,
      },
    });
  } catch (error) {
    console.error("Error updating payroll:", error);
    return NextResponse.json(
      { message: "Failed to update payroll information" },
      { status: 500 }
    );
  }
}

// PUT - Update existing payroll information
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

    const { employeeId, baseSalary, bonus, stockOptions } = await request.json();

    if (!employeeId) {
      return NextResponse.json(
        { message: "Employee ID is required" },
        { status: 400 }
      );
    }

    const employee = await Employee.findOne({
      _id: employeeId,
      user: userId,
    });

    if (!employee) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 }
      );
    }

    // Update only provided fields
    if (!employee.payroll) {
      employee.payroll = {
        baseSalary: 0,
        bonus: 0,
        stockOptions: 0,
        lastRaiseDate: new Date()
      };
    }

    // Check if salary is being increased
    const currentSalary = employee.payroll.baseSalary || 0;
    const newSalary = Number(baseSalary);
    const salaryIncreased = newSalary > currentSalary;

    if (baseSalary !== undefined) employee.payroll.baseSalary = newSalary;
    if (bonus !== undefined) employee.payroll.bonus = Number(bonus);
    if (stockOptions !== undefined) employee.payroll.stockOptions = Number(stockOptions);

    // Only update lastRaiseDate if salary was actually increased
    if (salaryIncreased) {
      employee.payroll.lastRaiseDate = new Date();
    }

    await employee.save();

    return NextResponse.json({
      message: "Payroll information updated successfully",
      employee: {
        _id: employee._id,
        name: employee.name,
        email: employee.email,
        payroll: employee.payroll,
      },
    });
  } catch (error) {
    console.error("Error updating payroll:", error);
    return NextResponse.json(
      { message: "Failed to update payroll information" },
      { status: 500 }
    );
  }
}

// DELETE - Remove payroll information for an employee
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
    const employeeId = url.searchParams.get("employeeId");

    if (!employeeId) {
      return NextResponse.json(
        { message: "Employee ID is required" },
        { status: 400 }
      );
    }

    const employee = await Employee.findOne({
      _id: employeeId,
      user: userId,
    });

    if (!employee) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 }
      );
    }

    employee.payroll = null;
    await employee.save();

    return NextResponse.json({
      message: "Payroll information removed successfully",
    });
  } catch (error) {
    console.error("Error removing payroll:", error);
    return NextResponse.json(
      { message: "Failed to remove payroll information" },
      { status: 500 }
    );
  }
}
