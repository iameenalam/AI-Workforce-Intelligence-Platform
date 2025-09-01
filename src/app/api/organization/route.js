import { connectDb } from "@/connectDb";
import { NextResponse } from "next/server";
import { Organization } from "../../../../models/Organization";
import { Department } from "../../../../models/Departments";
import { Employee } from "../../../../models/Employee";
import jwt from "jsonwebtoken";
import uploadFile from "../../../../middlewares/upload";
import { v2 as cloudinary } from "cloudinary";
import { parseCv } from "@/lib/cvParser";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUD_NAME,
  api_key: process.env.CLOUD_API,
  api_secret: process.env.CLOUD_SECRET,
});

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

    // First try to find organization owned by user
    let organization = await Organization.findOne({ user: userId });

    if (!organization) {
      // If not found, user might be an invited employee
      // Get their linked organization from User model
      const { User } = await import("../../../../models/User");
      const user = await User.findById(userId);

      if (user && user.linkedOrganization) {
        organization = await Organization.findById(user.linkedOrganization);
      }
    }

    if (!organization) {
      return NextResponse.json(
        { message: "Organization not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(organization, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDb();

    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SEC);
    const userId = decoded.id;

    const existingOrg = await Organization.findOne({ user: userId });
    if (existingOrg) {
      return NextResponse.json(
        { message: "User already has an organization" },
        { status: 400 }
      );
    }

    const formdata = await request.formData();
    const name = formdata.get("name");
    const ceoName = formdata.get("ceoName");
    const email = formdata.get("email");
    const orgLogoFile = formdata.get("organizationLogo");
    const ceoPicFile = formdata.get("ceoPic");
    const ceoCvFile = formdata.get("ceoCv");
    const industry = formdata.get("industry");
    const companySize = formdata.get("companySize");
    const city = formdata.get("city");
    const country = formdata.get("country");
    const yearFounded = Number(formdata.get("yearFounded"));
    const organizationType = formdata.get("organizationType");
    const numberOfOffices = Number(formdata.get("numberOfOffices"));
    const hrToolsUsed = formdata.get("hrToolsUsed");
    const hiringLevel = formdata.get("hiringLevel");
    const workModel = formdata.get("workModel");

    if (
      !name ||
      !ceoName ||
      !email ||
      !industry ||
      !companySize ||
      !city ||
      !country ||
      !yearFounded ||
      !organizationType ||
      numberOfOffices === undefined ||
      !hrToolsUsed ||
      !hiringLevel ||
      !workModel
    ) {
      return NextResponse.json(
        { message: "All required fields must be filled." },
        { status: 400 }
      );
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Please use a valid email address." },
        { status: 400 }
      );
    }

    let ceoPic = "";
    if (ceoPicFile && ceoPicFile.size > 0) {
      const uploadedCeoPic = await uploadFile(ceoPicFile);
      ceoPic = uploadedCeoPic.url;
    }

    let logoUrl = "";
    if (orgLogoFile && orgLogoFile.size > 0) {
      const uploadedLogo = await uploadFile(orgLogoFile);
      logoUrl = uploadedLogo.url;
    }

    // Handle CEO CV upload and parsing
    let cvUrl = "";
    let ceoSkills = [];
    let ceoTools = [];
    let ceoExperience = [];
    let ceoEducation = [];
    let ceoCertifications = [];

    if (ceoCvFile && ceoCvFile.size > 0) {
      // Validate CV file
      if (ceoCvFile.type !== "application/pdf") {
        return NextResponse.json(
          { message: "CEO CV must be a PDF file" },
          { status: 400 }
        );
      }

      if (ceoCvFile.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { message: "CEO CV file size must be less than 5MB" },
          { status: 400 }
        );
      }

      // Upload CV to Cloudinary
      const fileBuffer = Buffer.from(await ceoCvFile.arrayBuffer());
      const uploadedCv = await cloudinary.uploader.upload(
        `data:${ceoCvFile.type};base64,${fileBuffer.toString("base64")}`,
        {
          folder: "ceo_cvs",
          resource_type: "raw",
          public_id: `ceo_cv_${Date.now()}`,
        }
      );
      cvUrl = uploadedCv.secure_url;

      // Parse CV content
      try {
        const parsedData = await parseCv(fileBuffer);
        if (parsedData && typeof parsedData === "object") {
          ceoSkills = parsedData.skills || [];
          ceoTools = parsedData.tools || [];
          ceoExperience = parsedData.experience || [];
          ceoEducation = parsedData.education || [];
          ceoCertifications = parsedData.certifications || [];
        }
      } catch (parseError) {
        console.error("Error parsing CEO CV:", parseError);
        // Continue with organization creation even if CV parsing fails
      }
    }

    const organization = await Organization.create({
      name,
      logoUrl,
      ceoName,
      email,
      ceoPic,
      cvUrl,
      ceoSkills,
      ceoTools,
      ceoExperience,
      ceoEducation,
      ceoCertifications,
      industry,
      companySize,
      city,
      country,
      yearFounded,
      organizationType,
      numberOfOffices,
      hrToolsUsed,
      hiringLevel,
      workModel,
      user: userId,
    });

    return NextResponse.json(
      { organization, message: "Organization created successfully" },
      { status: 201 }
    );
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.user) {
      return NextResponse.json(
        { message: "User already has an organization" },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await connectDb();
    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SEC);
    const userId = decoded.id;

    const organization = await Organization.findOne({ user: userId });
    if (!organization)
      return NextResponse.json(
        { message: "Organization not found" },
        { status: 404 }
      );

    const formdata = await request.formData();
    const updates = {};

    for (const [key, value] of formdata.entries()) {
      if (key === "logoUrl") {
        if (value && value.size > 0) {
          const uploadedImage = await uploadFile(value);
          updates.logoUrl = uploadedImage.url;
        }
      } else {
        updates[key] = value;
      }
    }

    Object.assign(organization, updates);
    await organization.save();

    return NextResponse.json(
      { organization, message: "Organization updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await connectDb();
    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SEC);
    const userId = decoded.id;

    const deletedOrg = await Organization.findOneAndDelete({ user: userId });
    if (!deletedOrg) {
      return NextResponse.json(
        { message: "Organization not found" },
        { status: 404 }
      );
    }

    await Department.deleteMany({ organization: deletedOrg._id });
    await Employee.deleteMany({ organization: deletedOrg._id });

    return NextResponse.json(
      { message: "Organization and all related data deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
