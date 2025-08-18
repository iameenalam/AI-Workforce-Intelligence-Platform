import { connectDb } from "@/connectDb";
import { NextResponse } from "next/server";
import { Organization } from "../../../../../models/Organization";
import jwt from "jsonwebtoken";

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await connectDb();

    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    jwt.verify(token, process.env.JWT_SEC);

    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) return NextResponse.json({ message: "Missing organization ID" }, { status: 400 });

    const org = await Organization.findById(id).lean();
    if (!org) return NextResponse.json({ message: "Organization not found" }, { status: 404 });

    const ceo = {
      ...org,
    };

    return NextResponse.json(ceo, { status: 200 });

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
        return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
