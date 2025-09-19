import { connectDb } from "@/connectDb";
import { NextResponse } from "next/server";
import { User } from "../../../../../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    await connectDb();

    const formdata = await request.formData();
    const name = formdata.get("name");
    const email = formdata.get("email");
    const password = formdata.get("password");
    const confirmPassword = formdata.get("confirmPassword");
    const invitationToken = formdata.get("invitationToken"); // Optional invitation token

    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: "Passwords do not match." },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if this is an invited user
    let linkedOrganization = null;
    let invitedBy = null;
    let systemRole = "Admin"; // Default for non-invited users (they can create orgs)

    if (invitationToken) {
      // This is an invited user - they should not be able to create organizations
      const { Invitation } = await import("../../../../../models/Invitation");

      const invitation = await Invitation.findOne({
        token: invitationToken,
        email,
        status: "pending",
        expiresAt: { $gt: new Date() },
      }).populate("organization");

      if (invitation) {
        linkedOrganization = invitation.organization._id;
        invitedBy = invitation.invitedBy;
        systemRole = "Employee"; // Invited users are employees
      }
    }

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      linkedOrganization,
      invitedBy,
      invitationToken,
      systemRole,
      invitationAcceptedAt: invitationToken ? new Date() : null,
    });

    const token = jwt.sign({ id: user._id }, `${process.env.JWT_SEC}`, {
      expiresIn: "5d",
    });

    return NextResponse.json(
      {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          systemRole: user.systemRole,
          linkedOrganization: user.linkedOrganization,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        message: invitationToken ? "Account created and invitation accepted!" : "User registered",
        token,
        isInvitedUser: !!invitationToken,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
