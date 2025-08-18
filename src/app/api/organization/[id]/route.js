import { connectDb } from "@/connectDb";
import { NextResponse } from "next/server";
import { Organization } from "../../../../../models/Organization";
import jwt from "jsonwebtoken";

export async function GET(request, { params }) {
  try {
    await connectDb();

    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    jwt.verify(token, process.env.JWT_SEC);

    const { id } = params;
    if (!id) return NextResponse.json({ message: "Missing organization ID" }, { status: 400 });

    const organization = await Organization.findById(id).lean();
    if (!organization) return NextResponse.json({ message: "Organization not found" }, { status: 404 });

    return NextResponse.json(organization, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
