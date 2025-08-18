// src/app/api/departments/hod/[id]/route.js
import { connectDb } from "@/connectDb";
import { NextResponse } from "next/server";
import { Department } from "../../../../../../models/Departments";
import jwt from "jsonwebtoken";
import uploadFile from "../../../../../../middlewares/upload";

// This function handles fetching a single department's details.
export async function GET(request, context) {
  try {
    await connectDb();

    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    jwt.verify(token, process.env.JWT_SEC);

    // FIX: Accessing dynamic route parameters via `context.params`.
    const { id } = context.params;
    if (!id) return NextResponse.json({ message: "Missing department ID" }, { status: 400 });

    const department = await Department.findById(id)
      .populate("organization", "name ceoName")
      .lean();

    if (!department) return NextResponse.json({ message: "Department not found" }, { status: 404 });
    
    return NextResponse.json(department, { status: 200 });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
        return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// This function handles updating the Head of Department's profile.
export async function PUT(request, context) {
    try {
        await connectDb();
        const authHeader = request.headers.get("authorization") || "";
        const token = authHeader.replace("Bearer ", "");
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const decoded = jwt.verify(token, process.env.JWT_SEC);
        const userId = decoded.id;
        
        const { id } = context.params;
        if (!id) return NextResponse.json({ message: "Department ID is required" }, { status: 400 });

        const department = await Department.findOne({ _id: id, user: userId });
        if (!department) return NextResponse.json({ message: "Department not found or user not authorized" }, { status: 404 });
        
        const formdata = await request.formData();
        const updates = {};
        const removeHodPic = formdata.get('removeHodPic') === 'true';
        
        for (const [key, value] of formdata.entries()) {
            if (key === 'hodPic') {
                if (value && value.size > 0) {
                    // TODO: Delete old picture from Cloudinary if it exists
                    const uploadedImage = await uploadFile(value);
                    updates.hodPic = uploadedImage.url;
                }
            } else if (['hodExperience', 'hodEducation', 'hodCertifications'].includes(key)) {
                updates[key] = JSON.parse(value);
            } else if (['hodSkills', 'hodTools'].includes(key)) {
                updates[key] = value.split(',').map(s => s.trim()).filter(Boolean);
            } else if (key !== 'removeHodPic') { // Exclude the removal flag from direct updates
                updates[key] = value;
            }
        }

        // Handle picture removal
        if (removeHodPic) {
            // TODO: Delete old picture from Cloudinary if it exists
            updates.hodPic = ""; 
        }

        Object.assign(department, updates);
        await department.save();

        return NextResponse.json({ department, message: "HOD profile updated successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// This function "removes" an HOD by clearing their details from the department.
export async function DELETE(request, context) {
    try {
        await connectDb();
        const authHeader = request.headers.get("authorization") || "";
        const token = authHeader.replace("Bearer ", "");
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const decoded = jwt.verify(token, process.env.JWT_SEC);
        const userId = decoded.id;
        
        const { id } = context.params;
        if (!id) return NextResponse.json({ message: "Department ID is required" }, { status: 400 });

        const department = await Department.findOne({ _id: id, user: userId });
        if (!department) return NextResponse.json({ message: "Department not found or user not authorized" }, { status: 404 });
        
        // Clear HOD fields instead of deleting the department
        department.hodName = null;
        department.hodEmail = null;
        department.role = null;
        department.hodPic = null;
        department.hodCvUrl = null;
        department.hodSkills = [];
        department.hodTools = [];
        department.hodExperience = [];
        department.hodEducation = [];
        department.hodCertifications = [];

        await department.save();

        return NextResponse.json({ department, message: "HOD has been removed from the department" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
