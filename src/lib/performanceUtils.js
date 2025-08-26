import { connectDb } from "@/connectDb";
import { Employee } from "../../models/Employee";
import { Notification } from "../../models/Notification";

/**
 * Check for due performance reviews and create notifications
 * This function should be called periodically (e.g., daily via cron job)
 */
export async function checkDuePerformanceReviews() {
  try {
    await connectDb();

    // Find employees with performance reviews due within the next 7 days
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const employeesWithDueReviews = await Employee.find({
      "performance.nextReviewDate": {
        $lte: sevenDaysFromNow,
        $gte: new Date(),
      },
    }).select("name email performance organization user");

    const notifications = [];

    for (const employee of employeesWithDueReviews) {
      // Check if notification already exists for this employee's review
      const existingNotification = await Notification.findOne({
        user: employee.user,
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
          user: employee.user,
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

    return {
      success: true,
      notificationsCreated: notifications.length,
      dueReviews: employeesWithDueReviews.length,
    };
  } catch (error) {
    console.error("Error checking due performance reviews:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Calculate next review date based on review cadence
 */
export function calculateNextReviewDate(cadence, lastReviewDate = null) {
  const monthsUntilNext = 12 / cadence;
  const baseDate = lastReviewDate ? new Date(lastReviewDate) : new Date();
  const nextDate = new Date(baseDate);
  nextDate.setMonth(nextDate.getMonth() + monthsUntilNext);
  return nextDate;
}

/**
 * Update goal status based on completion percentage and target date
 */
export function updateGoalStatus(goal) {
  const now = new Date();
  const targetDate = new Date(goal.targetDate);
  
  if (goal.completion >= 100) {
    return "completed";
  } else if (now > targetDate) {
    return "overdue";
  } else if (goal.completion > 0) {
    return "in_progress";
  } else {
    return "not_started";
  }
}

/**
 * Calculate overall completion percentage based on goals
 */
export function calculateOverallCompletion(goals) {
  if (!goals || goals.length === 0) return 0;

  const totalCompletion = goals.reduce((sum, goal) => sum + (goal.completion || 0), 0);
  return Math.round(totalCompletion / goals.length);
}

/**
 * Validate payroll data
 */
export function validatePayrollData(payrollData) {
  const errors = [];
  
  if (!payrollData.baseSalary || payrollData.baseSalary <= 0) {
    errors.push("Base salary must be greater than 0");
  }
  
  if (payrollData.bonus && payrollData.bonus < 0) {
    errors.push("Bonus cannot be negative");
  }
  
  if (payrollData.stockOptions && payrollData.stockOptions < 0) {
    errors.push("Stock options cannot be negative");
  }
  
  if (payrollData.lastRaiseDate && new Date(payrollData.lastRaiseDate) > new Date()) {
    errors.push("Last raise date cannot be in the future");
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate performance data
 */
export function validatePerformanceData(performanceData) {
  const errors = [];
  
  if (performanceData.overallCompletion < 0 || performanceData.overallCompletion > 100) {
    errors.push("Overall completion must be between 0 and 100");
  }
  
  if (performanceData.reviewCadence && ![1, 2, 4].includes(performanceData.reviewCadence)) {
    errors.push("Review cadence must be 1, 2, or 4 times per year");
  }
  
  if (performanceData.goals) {
    performanceData.goals.forEach((goal, index) => {
      if (!goal.name || goal.name.trim() === "") {
        errors.push(`Goal ${index + 1}: Name is required`);
      }
      
      if (!goal.targetDate) {
        errors.push(`Goal ${index + 1}: Target date is required`);
      } else if (new Date(goal.targetDate) < new Date()) {
        errors.push(`Goal ${index + 1}: Target date cannot be in the past`);
      }
      
      if (goal.completion < 0 || goal.completion > 100) {
        errors.push(`Goal ${index + 1}: Completion must be between 0 and 100`);
      }
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}
