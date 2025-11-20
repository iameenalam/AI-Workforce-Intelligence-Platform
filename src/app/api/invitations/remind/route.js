import { connectDb } from "@/connectDb";
import { NextResponse } from "next/server";
import { Invitation } from "../../../../../models/Invitation";
import { Organization } from "../../../../../models/Organization";
import { User } from "../../../../../models/User";
import { sendInvitationReminder } from "../../../../../lib/emailService";
import jwt from "jsonwebtoken";

// POST - Send invitation reminder
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

    const { invitationId } = await request.json();

    if (!invitationId) {
      return NextResponse.json(
        { message: "Invitation ID is required" },
        { status: 400 }
      );
    }

    // Get user and organization
    const user = await User.findById(userId);
    const organization = await Organization.findOne({ user: userId });
    
    if (!organization) {
      return NextResponse.json(
        { message: "Organization not found" },
        { status: 404 }
      );
    }

    // Find the invitation
    const invitation = await Invitation.findOne({
      _id: invitationId,
      organization: organization._id,
      status: "pending",
      expiresAt: { $gt: new Date() },
    });

    if (!invitation) {
      return NextResponse.json(
        { message: "Invitation not found or already processed/expired" },
        { status: 404 }
      );
    }

    // Send reminder email
    await sendInvitationReminder({
      email: invitation.email,
      name: invitation.name,
      inviterName: user.name,
      organizationName: organization.name,
      invitationToken: invitation.token,
    });

    return NextResponse.json({
      message: `Reminder sent to ${invitation.email}`,
    }, { status: 200 });
  } catch (error) {
    console.error("Error sending invitation reminder:", error);
    return NextResponse.json(
      { message: "Failed to send reminder" },
      { status: 500 }
    );
  }
}
