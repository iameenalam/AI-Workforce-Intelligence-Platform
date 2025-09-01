import { connectDb } from "@/connectDb";
import { NextResponse } from "next/server";
import { Employee } from "../../../../../models/Employee";
import { Notification } from "../../../../../models/Notification";
import { calculateOverallCompletion } from "../../../../lib/performanceUtils";
import jwt from "jsonwebtoken";

// GET - Get performance information for employees
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
      // Get performance for specific employee
      const { Organization } = await import("../../../../models/Organization");
      const organization = await Organization.findOne({ user: userId });

      let employee;
      if (organization) {
        // User is organization creator
        employee = await Employee.findOne({
          _id: employeeId,
          organization: organization._id,
        }).select("name email performance");
      } else {
        // User might be checking their own record
        employee = await Employee.findOne({
          _id: employeeId,
          user: userId,
        }).select("name email performance");
      }

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
          performance: employee.performance,
        },
      });
    } else {
      // Get performance for all employees
      const organization = await Organization.findOne({ user: userId });

      if (!organization) {
        return NextResponse.json({ employees: [] });
      }

      const employees = await Employee.find({ organization: organization._id })
        .select("name email performance role department")
        .populate("department", "departmentName");

      return NextResponse.json({ employees });
    }
  } catch (error) {
    console.error("Error fetching performance data:", error);
    return NextResponse.json(
      { message: "Failed to fetch performance data" },
      { status: 500 }
    );
  }
}

// POST - Create or update performance information for an employee
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

    const { employeeId, goals, reviewCadence } = await request.json();

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
      // User is organization creator
      employee = await Employee.findOne({
        _id: employeeId,
        organization: organization._id,
      });
    } else {
      // User might be updating their own record
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

    // Calculate next review date based on cadence
    const calculateNextReviewDate = (cadence) => {
      const monthsUntilNext = 12 / cadence;
      const nextDate = new Date();
      nextDate.setMonth(nextDate.getMonth() + monthsUntilNext);
      return nextDate;
    };

    // Auto-calculate overall completion from goals
    const processedGoals = goals || [];
    const overallCompletion = calculateOverallCompletion(processedGoals);

    // Update performance information
    employee.performance = {
      overallCompletion,
      goals: processedGoals,
      reviewCadence: Number(reviewCadence) || 2,
      lastReviewDate: new Date(),
      nextReviewDate: calculateNextReviewDate(Number(reviewCadence) || 2),
    };

    await employee.save();

    return NextResponse.json({
      message: "Performance information updated successfully",
      employee: {
        _id: employee._id,
        name: employee.name,
        email: employee.email,
        performance: employee.performance,
      },
    });
  } catch (error) {
    console.error("Error updating performance:", error);
    return NextResponse.json(
      { message: "Failed to update performance information" },
      { status: 500 }
    );
  }
}

// PUT - Update existing performance information
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

    const { employeeId, goals, reviewCadence } = await request.json();

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
      // User is organization creator - can update any employee in their org
      employee = await Employee.findOne({
        _id: employeeId,
        organization: organization._id,
      });
    } else {
      // User might be an invited employee - check if they can update this employee
      // First try to find by user ID (their own record)
      employee = await Employee.findOne({
        _id: employeeId,
        user: userId,
      });

      // If not found, check if they're in the same organization and have permission
      if (!employee) {
        const userEmployee = await Employee.findOne({ user: userId }).populate('organization');
        if (userEmployee && userEmployee.organization) {
          employee = await Employee.findOne({
            _id: employeeId,
            organization: userEmployee.organization._id,
          });
        }
      }
    }

    if (!employee) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 }
      );
    }

    // Initialize performance if it doesn't exist
    if (!employee.performance) {
      employee.performance = {
        overallCompletion: 0,
        goals: [],
        reviewCadence: 2,
        lastReviewDate: null,
        nextReviewDate: null,
      };
    }

    // Update goals and auto-calculate overall completion
    if (goals !== undefined) {
      employee.performance.goals = goals;
      employee.performance.overallCompletion = calculateOverallCompletion(goals);
    }

    if (reviewCadence !== undefined) {
      employee.performance.reviewCadence = Number(reviewCadence);
      // Recalculate next review date
      const monthsUntilNext = 12 / Number(reviewCadence);
      const nextDate = new Date();
      nextDate.setMonth(nextDate.getMonth() + monthsUntilNext);
      employee.performance.nextReviewDate = nextDate;
    }

    await employee.save();

    return NextResponse.json({
      message: "Performance information updated successfully",
      employee: {
        _id: employee._id,
        name: employee.name,
        email: employee.email,
        performance: employee.performance,
      },
    });
  } catch (error) {
    console.error("Error updating performance:", error);
    return NextResponse.json(
      { message: "Failed to update performance information" },
      { status: 500 }
    );
  }
}

// DELETE - Remove performance information for an employee
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

    employee.performance = null;
    await employee.save();

    return NextResponse.json({
      message: "Performance information removed successfully",
    });
  } catch (error) {
    console.error("Error removing performance:", error);
    return NextResponse.json(
      { message: "Failed to remove performance information" },
      { status: 500 }
    );
  }
}
