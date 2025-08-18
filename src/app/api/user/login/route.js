import { connectDb } from "@/connectDb";
import { NextResponse } from "next/server";
import { User } from "../../../../../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client({
  clientId: process.env.GOOGLE_ID,
  clientSecret: process.env.GOOGLE_SECRET,
});

export async function POST(req) {
  try {
    await connectDb();
    const body = await req.json();

    if (body.tokenId) {
      const ticket = await client.verifyIdToken({
        idToken: body.tokenId,
        audience: process.env.GOOGLE_ID,
      });
      const payload = ticket.getPayload();
      const { sub, email, name } = payload;

      let user = await User.findOne({ googleId: sub });

      if (!user) {
        user = await User.findOne({ email });
        if (user) {
          user.googleId = sub;
          await user.save();
        } else {
          user = await User.create({
            name,
            email,
            googleId: sub,
            password: null,
          });
        }
      }

      const token = jwt.sign({ id: user._id }, `${process.env.JWT_SEC}`, {
        expiresIn: "5d",
      });

      return NextResponse.json({
        message: `Welcome back ${user.name}`,
        user,
        token,
      });
    }

    const { email, password } = body;

    const user = await User.findOne({ email });

    if (!user)
      return NextResponse.json(
        { message: "No user with this email" },
        { status: 400 }
      );

    if (!user.password) {
      return NextResponse.json(
        { message: "Please login using Google OAuth" },
        { status: 400 }
      );
    }

    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword)
      return NextResponse.json({ message: "Wrong Password" }, { status: 400 });

    const token = jwt.sign({ id: user._id }, `${process.env.JWT_SEC}`, {
      expiresIn: "5d",
    });

    return NextResponse.json({
      message: `Welcome back ${user.name}`,
      user,
      token,
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
