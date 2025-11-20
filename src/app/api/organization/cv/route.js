// src/app/api/organization/cv/route.js
import { connectDb } from "@/connectDb";
import { NextResponse } from "next/server";
import { Organization } from "../../../../../models/Organization";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import { parseCv } from "@/lib/cvParser";
import { revalidatePath } from "next/cache";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUD_NAME,
  api_key: process.env.CLOUD_API,
  api_secret: process.env.CLOUD_SECRET,
});

const uploadBufferToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "reeorg_cvs", resource_type: "raw" },
      (error, result) => {
        if (error) return reject(new Error(error.message || "Cloudinary upload failed"));
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

export async function PUT(request) {
  const requiredEnvVars = ['CLOUD_API', 'CLOUD_SECRET', 'OPENAI_API_KEY', 'JWT_SEC'];
  for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
      console.error(`Server Configuration Error: Missing environment variable ${varName}`);
      return NextResponse.json({ message: `Server configuration error.` }, { status: 500 });
    }
  }

  try {
    await connectDb();

    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    jwt.verify(token, process.env.JWT_SEC);

    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) return NextResponse.json({ message: "Missing organization ID" }, { status: 400 });

    const organization = await Organization.findById(id);
    if (!organization) return NextResponse.json({ message: "Organization not found." }, { status: 404 });

    const oldCvUrl = organization.cvUrl;

    const formdata = await request.formData();
    const cvFile = formdata.get("cv");
    if (!cvFile) return NextResponse.json({ message: "CV file is required." }, { status: 400 });

    const fileBuffer = Buffer.from(await cvFile.arrayBuffer());
    const uploadedCv = await uploadBufferToCloudinary(fileBuffer);

    if (!uploadedCv || !uploadedCv.secure_url) {
      throw new Error("Cloudinary returned an invalid result after upload.");
    }
    
    if (oldCvUrl) {
        try {
            const folderName = "reeorg_cvs/";
            if (oldCvUrl.includes(folderName)) {
                const publicIdWithFolder = oldCvUrl.substring(oldCvUrl.indexOf(folderName));
                // For raw files, the public_id includes the folder but not the extension.
                const publicIdWithoutExt = publicIdWithFolder.substring(0, publicIdWithFolder.lastIndexOf('.'));
                if (publicIdWithoutExt) {
                    await cloudinary.uploader.destroy(publicIdWithoutExt, { resource_type: "raw" });
                }
            }
        } catch (deleteError) {
            console.error("Failed to delete old CV from Cloudinary:", deleteError.message);
        }
    }

    const parsedData = await parseCv(fileBuffer);
    if (!parsedData || typeof parsedData !== 'object') {
        throw new Error("Parsing returned invalid data.");
    }

    organization.cvUrl = uploadedCv.secure_url;
    organization.ceoSkills = parsedData.skills || [];
    organization.ceoTools = parsedData.tools || [];
    organization.ceoExperience = parsedData.experience || [];
    organization.ceoEducation = parsedData.education || [];
    organization.ceoCertifications = parsedData.certifications || [];

    await organization.save();
    
    revalidatePath(`/ceo/${id}`);
    
    const updatedCeoProfile = {
      ...organization.toObject(),
    };

    return NextResponse.json(
      {
        organization: updatedCeoProfile, 
        message: "CEO profile updated with CV data",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("A general error occurred in the CV upload process:", error);
    const message = error.message || "An unexpected server error occurred.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
