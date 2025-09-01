import { connectDb } from "@/connectDb";
import { NextResponse } from "next/server";
import { Organization } from "../../../../models/Organization";
import { User } from "../../../../models/User";
import { isEmailConfigured } from "../../../../lib/emailService";
import jwt from "jsonwebtoken";

// GET - Test invitation system configuration
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

    // Get user and organization
    const user = await User.findById(userId);
    const organization = await Organization.findOne({ user: userId });
    
    if (!organization) {
      return NextResponse.json(
        { message: "Organization not found" },
        { status: 404 }
      );
    }

    // Check various configurations
    const emailConfigured = isEmailConfigured();
    const cloudinaryConfigured = !!(process.env.NEXT_PUBLIC_CLOUD_NAME && process.env.CLOUD_API && process.env.CLOUD_SECRET);
    const baseUrlConfigured = !!process.env.NEXT_PUBLIC_BASE_URL;

    return NextResponse.json({
      user: {
        name: user.name,
        email: user.email,
      },
      organization: {
        name: organization.name,
      },
      configuration: {
        emailConfigured,
        cloudinaryConfigured,
        baseUrlConfigured,
        jwtConfigured: !!process.env.JWT_SEC,
      },
      environmentVariables: {
        EMAIL_USER: process.env.EMAIL_USER ? "✓ Set" : "✗ Missing",
        EMAIL_PASS: process.env.EMAIL_PASS ? "✓ Set" : "✗ Missing",
        NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || "✗ Missing",
        NEXT_PUBLIC_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUD_NAME ? "✓ Set" : "✗ Missing",
        CLOUD_API: process.env.CLOUD_API ? "✓ Set" : "✗ Missing",
        CLOUD_SECRET: process.env.CLOUD_SECRET ? "✓ Set" : "✗ Missing",
      },
      recommendations: [
        !emailConfigured && "Configure EMAIL_USER and EMAIL_PASS for email invitations",
        !cloudinaryConfigured && "Configure Cloudinary for file uploads",
        !baseUrlConfigured && "Set NEXT_PUBLIC_BASE_URL for invitation links",
      ].filter(Boolean),
    }, { status: 200 });
  } catch (error) {
    console.error("Error testing invitation configuration:", error);
    return NextResponse.json(
      { 
        message: "Configuration test failed",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
