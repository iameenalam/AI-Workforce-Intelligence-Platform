import { connectDb } from "@/connectDb";
import { NextResponse } from "next/server";
import { Employee } from "../../../../../models/Employee";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import { parseCv } from "@/lib/cvParser";
import { revalidatePath } from "next/cache";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUD_NAME,
  api_key: process.env.CLOUD_API,
  api_secret: process.env.CLOUD_SECRET,
});

export async function POST(request) {
  console.log("=== CV UPLOAD API CALLED ===");
  try {
    console.log("Connecting to database...");
    await connectDb();

    console.log("Checking authorization...");
    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      console.log("No token provided");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    console.log("Verifying JWT token...");
    let decoded, userId;
    try {
      decoded = jwt.verify(token, process.env.JWT_SEC);
      userId = decoded.id;
      console.log("User ID:", userId);
    } catch (jwtError) {
      console.error("JWT verification failed:", jwtError);
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    console.log("Parsing form data...");
    let formData, cvFile, employeeId;
    try {
      formData = await request.formData();
      cvFile = formData.get("cv");
      employeeId = formData.get("employeeId");

      console.log("Form data received:", {
        cvFile: cvFile ? `${cvFile.name} (${cvFile.size} bytes)` : "No file",
        employeeId,
        formDataKeys: Array.from(formData.keys())
      });
    } catch (formError) {
      console.error("Form data parsing failed:", formError);
      return NextResponse.json(
        { message: "Failed to parse form data" },
        { status: 400 }
      );
    }

    if (!cvFile || !employeeId) {
      console.log("Missing required fields");
      return NextResponse.json(
        { message: "CV file and employee ID are required" },
        { status: 400 }
      );
    }

    // Validate file type and size
    if (cvFile.type !== "application/pdf") {
      return NextResponse.json(
        { message: "Only PDF files are allowed" },
        { status: 400 }
      );
    }

    if (cvFile.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { message: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    // Find the employee with retry mechanism
    let employee = null;
    let retries = 3;

    while (retries > 0 && !employee) {
      employee = await Employee.findOne({
        _id: employeeId,
        user: userId,
      });

      if (!employee) {
        console.log(`Employee not found, retries left: ${retries - 1}`);
        if (retries > 1) {
          // Wait 1 second before retry
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        retries--;
      }
    }

    if (!employee) {
      console.error("Employee not found after retries:", employeeId);
      return NextResponse.json(
        { message: "Employee not found. Please ensure the employee was created successfully." },
        { status: 404 }
      );
    }

    console.log("Employee found for CV upload:", employee.name);

    // Convert file to buffer for processing
    const fileBuffer = Buffer.from(await cvFile.arrayBuffer());

    let uploadedCv;
    let parsedData = {};

    try {
      // Upload CV to Cloudinary
      uploadedCv = await cloudinary.uploader.upload(
        `data:${cvFile.type};base64,${fileBuffer.toString("base64")}`,
        {
          folder: "employee_cvs",
          resource_type: "raw",
          public_id: `employee_${employeeId}_cv_${Date.now()}`,
        }
      );
    } catch (uploadError) {
      console.error("Cloudinary upload error:", uploadError);
      return NextResponse.json(
        { message: "Failed to upload CV file" },
        { status: 500 }
      );
    }

    try {
      // Parse CV content (excluding job description as per requirements)
      parsedData = await parseCv(fileBuffer);
      if (!parsedData || typeof parsedData !== "object") {
        console.warn("CV parsing returned invalid data, using empty data");
        parsedData = {};
      }
    } catch (parseError) {
      console.error("CV parsing error:", parseError);
      // Continue with empty parsed data if parsing fails
      parsedData = {};
    }

    // Update employee with CV data
    employee.cvUrl = uploadedCv.secure_url;
    employee.skills = parsedData.skills || [];
    employee.tools = parsedData.tools || [];
    // Note: Experience includes what was previously job description
    employee.experience = parsedData.experience || [];

    // Ensure education has required fields with proper duration mapping
    employee.education = (parsedData.education || []).map(edu => ({
      degree: edu.degree || '',
      institution: edu.institution || '',
      year: edu.year || '',
      duration: edu.duration || edu.period || edu.years || edu.year || 'N/A' // Multiple fallbacks for duration
    }));

    // Ensure certifications have required fields with proper issuer mapping
    employee.certifications = (parsedData.certifications || []).map(cert => ({
      title: cert.title || cert.name || cert.certification || '',
      issuer: cert.issuer || '',
      duration: cert.duration || cert.period || cert.year || cert.validity || ''
    }));

    await employee.save();

    // Revalidate the employee profile page
    revalidatePath(`/employee/${employeeId}`);

    const updatedEmployee = await Employee.findById(employeeId)
      .populate("department", "departmentName")
      .populate("organization", "name");

    return NextResponse.json(
      {
        employee: updatedEmployee,
        message: "Employee profile successfully updated with CV data.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("=== CV UPLOAD ERROR ===");
    console.error("Error uploading employee CV:", error);
    console.error("Error stack:", error.stack);
    console.error("Error details:", {
      message: error.message,
      name: error.name,
      employeeId: employeeId || 'undefined',
      cvFileSize: cvFile?.size || 'undefined',
      cvFileType: cvFile?.type || 'undefined',
      hasCloudinaryConfig: !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)
    });
    console.error("=== END CV UPLOAD ERROR ===");

    // Ensure we always return a proper JSON response
    try {
      return NextResponse.json(
        {
          message: error.message || "Failed to upload CV",
          error: error.message,
          details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        },
        { status: 500 }
      );
    } catch (responseError) {
      console.error("Error creating error response:", responseError);
      return new Response("Internal Server Error", { status: 500 });
    }
  }
}

// GET - Download employee CV
export async function GET(request) {
  try {
    await connectDb();

    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    jwt.verify(token, process.env.JWT_SEC);

    const url = new URL(request.url);
    const employeeId = url.searchParams.get("employeeId");

    if (!employeeId) {
      return NextResponse.json(
        { message: "Employee ID is required" },
        { status: 400 }
      );
    }

    const employee = await Employee.findById(employeeId);

    if (!employee || !employee.cvUrl) {
      return NextResponse.json(
        { message: "CV not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { cvUrl: employee.cvUrl },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching employee CV:", error);
    return NextResponse.json(
      { message: "Failed to fetch CV" },
      { status: 500 }
    );
  }
}
