import { connectDb } from "@/connectDb";
import { NextResponse } from "next/server";
import { Invitation } from "../../../../../models/Invitation";
import { User } from "../../../../../models/User";
import { Employee } from "../../../../../models/Employee";
import { Organization } from "../../../../../models/Organization";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// GET - Validate invitation token and get invitation details
export async function GET(request) {
  try {
    await connectDb();

    const url = new URL(request.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { message: "Invitation token is required" },
        { status: 400 }
      );
    }

    const invitation = await Invitation.findOne({
      token,
      status: "pending",
      expiresAt: { $gt: new Date() },
    }).populate("organization", "name logoUrl");

    if (!invitation) {
      return NextResponse.json(
        { message: "Invalid or expired invitation" },
        { status: 404 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: invitation.email });
    
    return NextResponse.json({
      invitation: {
        name: invitation.name,
        email: invitation.email,
        organization: invitation.organization,
        token: invitation.token,
      },
      userExists: !!existingUser,
    }, { status: 200 });
  } catch (error) {
    console.error("Error validating invitation:", error);
    return NextResponse.json(
      { message: "Failed to validate invitation" },
      { status: 500 }
    );
  }
}

// POST - Accept invitation and create/link user account
export async function POST(request) {
  try {
    await connectDb();

    const body = await request.json();
    const { token, password, confirmPassword, userExists = false } = body;

    if (!token) {
      return NextResponse.json(
        { message: "Invitation token is required" },
        { status: 400 }
      );
    }

    // Find and validate invitation
    const invitation = await Invitation.findOne({
      token,
      status: "pending",
      expiresAt: { $gt: new Date() },
    }).populate("organization", "name");

    if (!invitation) {
      return NextResponse.json(
        { message: "Invalid or expired invitation" },
        { status: 404 }
      );
    }

    let user;
    let isNewUser = false;

    // Check if user already exists
    const existingUser = await User.findOne({ email: invitation.email });

    if (existingUser) {
      // User exists, just link to organization
      user = existingUser;
      user.linkedOrganization = invitation.organization._id;
      user.invitedBy = invitation.invitedBy;
      user.invitationToken = token;
      user.invitationAcceptedAt = new Date();
      await user.save();
    } else {
      // New user, validate password requirements
      if (!password || !confirmPassword) {
        return NextResponse.json(
          { message: "Password and confirmation are required for new users" },
          { status: 400 }
        );
      }

      if (password !== confirmPassword) {
        return NextResponse.json(
          { message: "Passwords do not match" },
          { status: 400 }
        );
      }

      if (password.length < 6) {
        return NextResponse.json(
          { message: "Password must be at least 6 characters long" },
          { status: 400 }
        );
      }

      // Create new user
      const hashedPassword = await bcrypt.hash(password, 10);
      
      user = new User({
        name: invitation.name,
        email: invitation.email,
        password: hashedPassword,
        linkedOrganization: invitation.organization._id,
        invitedBy: invitation.invitedBy,
        invitationToken: token,
        invitationAcceptedAt: new Date(),
        systemRole: "Employee",
      });

      await user.save();
      isNewUser = true;
    }

    // Create employee record
    const employee = new Employee({
      name: invitation.name,
      email: invitation.email,
      pic: invitation.picUrl,
      cvUrl: invitation.cvUrl,
      organization: invitation.organization._id,
      user: user._id,
      role: "Unassigned",
      invitationStatus: "accepted",
      invitationToken: token,
      invitationAcceptedAt: new Date(),
      invited: true, // For backward compatibility
    });

    await employee.save();
    console.log("Employee created successfully:", {
      employeeId: employee._id,
      name: employee.name,
      email: employee.email,
      organization: employee.organization,
      role: employee.role,
    });

    // Update invitation status
    invitation.status = "accepted";
    invitation.acceptedAt = new Date();
    invitation.acceptedByUser = user._id;
    invitation.employeeRecord = employee._id;
    await invitation.save();

    // Generate JWT token for immediate login
    const authToken = jwt.sign({ id: user._id }, process.env.JWT_SEC, {
      expiresIn: "5d",
    });

    return NextResponse.json({
      message: `Welcome to ${invitation.organization.name}! Your invitation has been accepted.`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        systemRole: user.systemRole,
        linkedOrganization: user.linkedOrganization,
      },
      employee: {
        _id: employee._id,
        name: employee.name,
        email: employee.email,
        role: employee.role,
        pic: employee.pic,
      },
      organization: invitation.organization,
      token: authToken,
      isNewUser,
    }, { status: 200 });
  } catch (error) {
    console.error("Error accepting invitation:", error);
    return NextResponse.json(
      { message: "Failed to accept invitation" },
      { status: 500 }
    );
  }
}
