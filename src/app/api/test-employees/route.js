import { connectDb } from "@/connectDb";
import { NextResponse } from "next/server";
import { Employee } from "../../../../models/Employee";
import { Organization } from "../../../../models/Organization";
import { User } from "../../../../models/User";
import jwt from "jsonwebtoken";

// GET - Test employee fetching logic
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

    // Get user info
    const user = await User.findById(userId);
    
    // Check if user is organization creator
    const organization = await Organization.findOne({ user: userId });
    
    let organizationId;
    let userType;

    if (organization) {
      // User is organization creator
      organizationId = organization._id;
      userType = "Organization Creator";
    } else if (user && user.linkedOrganization) {
      // User is invited employee
      organizationId = user.linkedOrganization;
      userType = "Invited Employee";
    } else {
      userType = "No Organization";
    }

    // Fetch all employees for this organization
    const employees = await Employee.find({ organization: organizationId })
      .populate("department", "departmentName")
      .populate("organization", "name")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    // Also fetch employees by old method (user field) for comparison
    const employeesByUser = await Employee.find({ user: userId })
      .populate("department", "departmentName")
      .populate("organization", "name")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      userInfo: {
        _id: user._id,
        name: user.name,
        email: user.email,
        linkedOrganization: user.linkedOrganization,
        userType,
      },
      organizationInfo: organization ? {
        _id: organization._id,
        name: organization.name,
      } : null,
      employeesByOrganization: employees,
      employeesByUser: employeesByUser,
      counts: {
        byOrganization: employees.length,
        byUser: employeesByUser.length,
      },
    }, { status: 200 });
  } catch (error) {
    console.error("Error testing employees:", error);
    return NextResponse.json(
      { 
        message: "Test failed",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
