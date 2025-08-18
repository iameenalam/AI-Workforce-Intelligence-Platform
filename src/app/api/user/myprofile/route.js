import { connectDb } from "@/connectDb";
import { NextResponse } from "next/server";
import { User } from "../../../../../models/User";
import CheckAuth from "../../../../../middlewares/isAuth";

export async function GET(req) {
  try {
    await connectDb();

    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    const user = await CheckAuth(token);

    if (!user) {
      return NextResponse.json({ message: "Please Login" }, { status: 401 });
    }

    const loggedInUser = await User.findById(user._id).select("-password");

    return NextResponse.json({ user: loggedInUser });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}