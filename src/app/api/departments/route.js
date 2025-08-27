// src/app/api/departments/route.js
import { connectDb } from "@/connectDb";
import { NextResponse } from "next/server";
import { Department } from "../../../../models/Departments";
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

    const url = new URL(request.url);
    const orgId = url.searchParams.get("organizationId");
    let filter = { user: userId };
    if (orgId) filter.organization = orgId;

    const departments = await Department.find(filter)
      .populate("organization")
      .lean();

    return NextResponse.json(departments, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

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

    const formdata = await request.formData();

    const departmentName = formdata.get("departmentName");
    const departmentDetails = formdata.get("departmentDetails");
    const subfunctionsRaw = formdata.get("subfunctions"); 

    if (!departmentName) {
      return NextResponse.json(
        { message: "Department name is required." },
        { status: 400 }
      );
    }

    let subfunctions = [];
    if (subfunctionsRaw) {
      try {
        subfunctions = JSON.parse(subfunctionsRaw);
        const names = subfunctions.map((sf) => sf.name.trim());
        const uniqueNames = new Set(names);
        if (names.length !== uniqueNames.size) {
          return NextResponse.json(
            { message: "Subfunction names must be unique within the department." },
            { status: 400 }
          );
        }
      } catch {
        return NextResponse.json(
          { message: "Invalid subfunctions format." },
          { status: 400 }
        );
      }
    }

    const organization = await Organization.findOne({ user: userId });

    if (!organization) {
      return NextResponse.json(
        { message: "Organization not found for the user." },
        { status: 404 }
      );
    }

    const department = await Department.create({
      departmentName,
      departmentDetails,
      subfunctions,
      organization: organization._id,
      user: userId,
    });

    return NextResponse.json(
      {
        department,
        message: "Department(s) created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    if (error.code === 11000) {
        return NextResponse.json({ message: "A department with this name already exists." }, { status: 400 });
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
        
        const url = new URL(request.url);
        const id = url.searchParams.get("id");
        if (!id) return NextResponse.json({ message: "Department ID is required" }, { status: 400 });

        const department = await Department.findOne({ _id: id, user: userId });
        if (!department) return NextResponse.json({ message: "Department not found or user not authorized" }, { status: 404 });
        
        const formdata = await request.formData();
        const updates = {};
        
        for (const [key, value] of formdata.entries()) {
            if (key === 'hodPic') {
                if (value && value.size > 0) {
                    const uploadedImage = await uploadFile(value);
                    updates.hodPic = uploadedImage.url;
                }
            } else if (key === 'subfunctions' || key === 'hodExperience' || key === 'hodEducation' || key === 'hodCertifications') {
                updates[key] = JSON.parse(value);
            } else if (key === 'hodSkills' || key === 'hodTools') {
                updates[key] = value.split(',').map(s => s.trim()).filter(Boolean);
            } else {
                updates[key] = value;
            }
        }

        Object.assign(department, updates);
        await department.save();

        return NextResponse.json({ department, message: "Department updated successfully" }, { status: 200 });
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
        
        const url = new URL(request.url);
        const id = url.searchParams.get("id");
        if (!id) return NextResponse.json({ message: "Department ID is required" }, { status: 400 });

        const department = await Department.findOneAndDelete({ _id: id, user: userId });

        if (!department) {
            return NextResponse.json({ message: "Department not found or user not authorized" }, { status: 404 });
        }

        // Also delete associated team members
        // await TeamMember.deleteMany({ department: id, user: userId });

        return NextResponse.json({ message: "Department deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
