// src/app/api/organization/route.js
import { connectDb } from "@/connectDb";
import { NextResponse } from "next/server";
import { Organization } from "../../../../models/Organization";
import jwt from "jsonwebtoken";
import uploadFile from "../../../../middlewares/upload";

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

    const organization = await Organization.findOne({ user: userId });

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
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

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
      !name || !ceoName || !email || !industry || !companySize || !city ||
      !country || !yearFounded || !organizationType || numberOfOffices === undefined ||
      !hrToolsUsed || !hiringLevel || !workModel
    ) {
      return NextResponse.json({ message: "All required fields must be filled." }, { status: 400 });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "Please use a valid email address." }, { status: 400 });
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

    const organization = await Organization.create({
      name,
      logoUrl,
      ceoName,
      email,
      ceoPic,
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
      return NextResponse.json({ message: "User already has an organization" }, { status: 400 });
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
    try {
        await connectDb();
        const authHeader = request.headers.get("authorization") || "";
        const token = authHeader.replace("Bearer ", "");
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const decoded = jwt.verify(token, process.env.JWT_SEC);
        const userId = decoded.id;

        const organization = await Organization.findOne({ user: userId });
        if (!organization) return NextResponse.json({ message: "Organization not found" }, { status: 404 });
        
        const formdata = await request.formData();
        const updates = {};
        
        for (const [key, value] of formdata.entries()) {
            if (key === 'logoUrl') {
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

        return NextResponse.json({ organization, message: "Organization updated successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        await connectDb();
        const authHeader = request.headers.get("authorization") || "";
        const token = authHeader.replace("Bearer ", "");
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const decoded = jwt.verify(token, process.env.JWT_SEC);
        const userId = decoded.id;

        const deletedOrg = await Organization.findOneAndDelete({ user: userId });
        if (!deletedOrg) {
            return NextResponse.json({ message: "Organization not found" }, { status: 404 });
        }

        // Optionally: Delete related departments and team members
        // await Department.deleteMany({ organization: deletedOrg._id });
        // await TeamMember.deleteMany({ organization: deletedOrg._id });

        return NextResponse.json({ message: "Organization deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
