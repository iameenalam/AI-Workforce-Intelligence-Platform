// src/app/api/organization/ceo/[id]/route.js
import { connectDb } from "@/connectDb";
import { NextResponse } from "next/server";
import { Organization } from "../../../../../../models/Organization";
import jwt from "jsonwebtoken";
import uploadFile from "../../../../../../middlewares/upload";

export async function PUT(request, { params }) {
    try {
        await connectDb();
        const authHeader = request.headers.get("authorization") || "";
        const token = authHeader.replace("Bearer ", "");
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const decoded = jwt.verify(token, process.env.JWT_SEC);
        const userId = decoded.id;
        
        const { id } = params;
        if (!id) return NextResponse.json({ message: "Organization ID is required" }, { status: 400 });

        const organization = await Organization.findOne({ _id: id, user: userId });
        if (!organization) return NextResponse.json({ message: "Organization not found or user not authorized" }, { status: 404 });
        
        const formdata = await request.formData();
        const updates = {};
        
        for (const [key, value] of formdata.entries()) {
            if (key === 'ceoPic') {
                if (value && value.size > 0) {
                    const uploadedImage = await uploadFile(value);
                    updates.ceoPic = uploadedImage.url;
                }
            } else if (['ceoExperience', 'ceoEducation', 'ceoCertifications'].includes(key)) {
                updates[key] = JSON.parse(value);
            } else if (['ceoSkills', 'ceoTools'].includes(key)) {
                updates[key] = value.split(',').map(s => s.trim()).filter(Boolean);
            } else {
                updates[key] = value;
            }
        }

        Object.assign(organization, updates);
        await organization.save();

        return NextResponse.json({ organization, message: "CEO profile updated successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
