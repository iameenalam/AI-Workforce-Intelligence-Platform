import { connectDb } from "@/connectDb";
import { NextResponse } from "next/server";
import { Invitation } from "../../../../models/Invitation";
import { Organization } from "../../../../models/Organization";
import { User } from "../../../../models/User";
import { Employee } from "../../../../models/Employee";
import { sendInvitationEmail, isEmailConfigured } from "../../../../lib/emailService";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import uploadFile from "../../../../middlewares/upload";

// GET - Fetch invitations for an organization
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

    // Get user's organization
    const organization = await Organization.findOne({ user: userId });
    if (!organization) {
      return NextResponse.json(
        { message: "Organization not found" },
        { status: 404 }
      );
    }

    const invitations = await Invitation.find({ organization: organization._id })
      .populate("invitedBy", "name email")
      .populate("organization", "name")
      .sort({ createdAt: -1 });

    return NextResponse.json({ invitations }, { status: 200 });
  } catch (error) {
    console.error("Error fetching invitations:", error);
    return NextResponse.json(
      { message: "Failed to fetch invitations" },
      { status: 500 }
    );
  }
}

// POST - Send employee invitations
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

    // Get user and organization
    const user = await User.findById(userId);
    const organization = await Organization.findOne({ user: userId });
    
    if (!organization) {
      return NextResponse.json(
        { message: "Organization not found" },
        { status: 404 }
      );
    }

    // Check email configuration (make it optional for testing)
    const emailConfigValid = isEmailConfigured();
    if (!emailConfigValid) {
      console.warn("Email not configured - invitations will be created but emails won't be sent");
    }

    const formData = await request.formData();
    const employeesData = JSON.parse(formData.get("employees") || "[]");

    if (!employeesData || employeesData.length === 0) {
      return NextResponse.json(
        { message: "No employee data provided" },
        { status: 400 }
      );
    }

    const invitations = [];
    const errors = [];
    const errorDetails = [];

    for (let i = 0; i < employeesData.length; i++) {
      const empData = employeesData[i];
      const { name, email } = empData;

      if (!name || !email) {
        errors.push(`Employee ${i + 1}: Name and email are required`);
        errorDetails.push({ email, error: `Name and email are required` });
        continue;
      }

      try {
        // Check if user with this email exists (regardless of employee status)
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          errors.push(`Employee is already part of another organization`);
          errorDetails.push({ email, error: `Employee is already part of another organization` });
          continue;
        }
        // Check if employee with this email already exists in this organization
        const existingEmployee = await Employee.findOne({ 
          email, 
          organization: organization._id 
        });
        if (existingEmployee) {
          errors.push(`Employee with this email is already in your organization`);
          errorDetails.push({ email, error: `Employee with this email is already in your organization` });
          continue;
        }
        // Check if employee with this email exists in another organization
        const employeeInOtherOrg = await Employee.findOne({
          email,
          organization: { $ne: organization._id },
        });
        if (employeeInOtherOrg) {
          errors.push(`Employee is already part of another organization`);
          errorDetails.push({ email, error: `Employee is already part of another organization` });
          continue;
        }
        // Check if user with this email exists and is linked to another org
        if (existingUser && existingUser.linkedOrganization && existingUser.linkedOrganization.toString() !== organization._id.toString()) {
          errors.push(`Employee is already part of another organization`);
          errorDetails.push({ email, error: `Employee is already part of another organization` });
          continue;
        }
        // Check if there's already a pending invitation
        const existingInvitation = await Invitation.findOne({
          email,
          organization: organization._id,
          status: "pending",
        });
        if (existingInvitation) {
          errors.push(`Invitation already sent to that employee email`);
          errorDetails.push({ email, error: `Invitation already sent to that employee email` });
          continue;
        }

        // Generate unique invitation token
        const invitationToken = crypto.randomBytes(32).toString("hex");

        // Handle file uploads
        let picUrl = "";
        let cvUrl = "";

        try {
          // Handle profile picture
          const picFile = formData.get(`pic_${i}`);
          if (picFile && picFile.size > 0) {
            const uploadResult = await uploadFile(picFile);
            picUrl = uploadResult?.secure_url || "";
          }

          // Handle CV
          const cvFile = formData.get(`cv_${i}`);
          if (cvFile && cvFile.size > 0) {
            const uploadResult = await uploadFile(cvFile);
            cvUrl = uploadResult?.secure_url || "";
          }
        } catch (uploadError) {
          console.error(`File upload error for ${email}:`, uploadError);
          // Continue without files rather than failing the entire invitation
        }

        // Create invitation record
        const invitation = new Invitation({
          email,
          name,
          token: invitationToken,
          organization: organization._id,
          invitedBy: userId,
          picUrl,
          cvUrl,
        });

        await invitation.save();

        // Send invitation email (if email is configured)
        if (emailConfigValid) {
          try {
            await sendInvitationEmail({
              email,
              name,
              inviterName: user.name,
              organizationName: organization.name,
              invitationToken,
              logoUrl: organization.logoUrl,
            });
          } catch (emailError) {
            console.error(`Email sending failed for ${email}:`, emailError);
            errors.push(`Invitation created for ${email} but email failed to send: ${emailError.message}`);
          }
        } else {
          console.log(`Invitation created for ${email} - Email not configured, manual sharing required`);
          const invitationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/accept-invitation?token=${invitationToken}`;
          errors.push(`✅ Invitation created for ${email}. 📧 Email not configured - Share this link: ${invitationUrl}`);
        }

        invitations.push(invitation);
      } catch (error) {
        console.error(`Error processing invitation for ${email}:`, error);
        errors.push(`Failed to invite ${email}: ${error.message}`);
      }
    }

    if (invitations.length === 0 && errors.length > 0) {
      return NextResponse.json(
        { message: "Failed to send any invitations", errors, errorDetails },
        { status: 400 }
      );
    }

    const response = {
      message: `Successfully sent ${invitations.length} invitation(s)`,
      invitations: invitations.length,
      errors: errors.length > 0 ? errors : undefined,
      errorDetails: errorDetails.length > 0 ? errorDetails : undefined,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Error sending invitations:", error);
    return NextResponse.json(
      { message: "Failed to send invitations" },
      { status: 500 }
    );
  }
}

// DELETE - Cancel/revoke an invitation
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
    const invitationId = url.searchParams.get("id");

    if (!invitationId) {
      return NextResponse.json(
        { message: "Invitation ID is required" },
        { status: 400 }
      );
    }

    // Get user's organization
    const organization = await Organization.findOne({ user: userId });
    if (!organization) {
      return NextResponse.json(
        { message: "Organization not found" },
        { status: 404 }
      );
    }

    const invitation = await Invitation.findOneAndDelete({
      _id: invitationId,
      organization: organization._id,
      status: "pending",
    });

    if (!invitation) {
      return NextResponse.json(
        { message: "Invitation not found or already processed" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Invitation cancelled successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error cancelling invitation:", error);
    return NextResponse.json(
      { message: "Failed to cancel invitation" },
      { status: 500 }
    );
  }
}
