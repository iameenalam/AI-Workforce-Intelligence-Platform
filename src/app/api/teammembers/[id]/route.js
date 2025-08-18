// src/app/api/teammembers/[id]/route.js
import { connectDb } from "@/connectDb";
import { NextResponse } from "next/server";
import { TeamMember } from "../../../../../models/TeamMember";
import jwt from "jsonwebtoken";

export async function GET(request, { params }) {
  try {
    await connectDb();

    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    jwt.verify(token, process.env.JWT_SEC);

    const { id } = params;
    if (!id) {
      return NextResponse.json({ message: "Missing team member ID" }, { status: 400 });
    }

    const teammember = await TeamMember.findById(id)
      .populate("organization", "name ceoName")
      .populate("department", "departmentName hodName")
      .lean();

    if (!teammember) {
      return NextResponse.json({ message: "Team member not found" }, { status: 404 });
    }

    return NextResponse.json(teammember, { status: 200 });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
        return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
    try {
        await connectDb();
        const authHeader = request.headers.get("authorization") || "";
        const token = authHeader.replace("Bearer ", "");
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const decoded = jwt.verify(token, process.env.JWT_SEC);
        const userId = decoded.id;
        
        const { id } = params;
        if (!id) return NextResponse.json({ message: "Team member ID is required" }, { status: 400 });

        const teammember = await TeamMember.findOne({ _id: id, user: userId });
        if (!teammember) return NextResponse.json({ message: "Team member not found or user not authorized" }, { status: 404 });
        
        const formdata = await request.formData();
        const updates = {};
        
        for (const [key, value] of formdata.entries()) {
            if (['experience', 'education', 'certifications'].includes(key)) {
                updates[key] = JSON.parse(value);
            } else if (['skills', 'tools'].includes(key)) {
                updates[key] = value.split(',').map(s => s.trim()).filter(Boolean);
            } else {
                updates[key] = value;
            }
        }

        Object.assign(teammember, updates);
        await teammember.save();

        return NextResponse.json({ teammember, message: "Team member updated successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        await connectDb();
        const authHeader = request.headers.get("authorization") || "";
        const token = authHeader.replace("Bearer ", "");
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const decoded = jwt.verify(token, process.env.JWT_SEC);
        const userId = decoded.id;
        
        const { id } = params;
        if (!id) return NextResponse.json({ message: "Team member ID is required" }, { status: 400 });

        const deletedTeammember = await TeamMember.findOneAndDelete({ _id: id, user: userId });

        if (!deletedTeammember) {
            return NextResponse.json({ message: "Team member not found or user not authorized" }, { status: 404 });
        }

        return NextResponse.json({ message: "Team member deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
