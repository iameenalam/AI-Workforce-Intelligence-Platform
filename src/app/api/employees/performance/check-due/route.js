import { connectDb } from "@/connectDb";
import { NextResponse } from "next/server";
import { Employee } from "../../../../../../models/Employee";
import { Notification } from "../../../../../../models/Notification";
import jwt from "jsonwebtoken";

// POST - Check for due performance reviews and create notifications
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

    // Find employees with performance reviews due within the next 7 days
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const employeesWithDueReviews = await Employee.find({
      user: userId,
      "performance.nextReviewDate": {
        $lte: sevenDaysFromNow,
        $gte: new Date(),
      },
    }).select("name email performance organization");

    const notifications = [];

    for (const employee of employeesWithDueReviews) {
      // Check if notification already exists for this employee's review
      const existingNotification = await Notification.findOne({
        user: userId,
        employee: employee._id,
        type: "performance_review",
        isRead: false,
        createdAt: {
          $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Within last 7 days
        },
      });

      if (!existingNotification) {
        const daysUntilDue = Math.ceil(
          (employee.performance.nextReviewDate - new Date()) / (1000 * 60 * 60 * 24)
        );

        const notification = new Notification({
          title: "Performance Review Due",
          message: `Performance review for ${employee.name} is due in ${daysUntilDue} day(s)`,
          type: "performance_review",
          user: userId,
          organization: employee.organization,
          employee: employee._id,
          data: {
            daysUntilDue,
            reviewDate: employee.performance.nextReviewDate,
          },
          expiresAt: employee.performance.nextReviewDate,
        });

        await notification.save();
        notifications.push(notification);
      }
    }

    return NextResponse.json({
      message: `Created ${notifications.length} performance review notifications`,
      notifications: notifications.length,
      dueReviews: employeesWithDueReviews.length,
    });
  } catch (error) {
    console.error("Error checking due performance reviews:", error);
    return NextResponse.json(
      { message: "Failed to check due performance reviews" },
      { status: 500 }
    );
  }
}

// GET - Get employees with due performance reviews
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
    const daysAhead = parseInt(url.searchParams.get("days")) || 30;

    // Find employees with performance reviews due within specified days
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysAhead);

    const employeesWithDueReviews = await Employee.find({
      user: userId,
      "performance.nextReviewDate": {
        $lte: targetDate,
        $gte: new Date(),
      },
    })
      .select("name email performance role department")
      .populate("department", "departmentName")
      .sort({ "performance.nextReviewDate": 1 });

    return NextResponse.json({
      employees: employeesWithDueReviews,
      count: employeesWithDueReviews.length,
    });
  } catch (error) {
    console.error("Error fetching due performance reviews:", error);
    return NextResponse.json(
      { message: "Failed to fetch due performance reviews" },
      { status: 500 }
    );
  }
}
