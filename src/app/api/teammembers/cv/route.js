  // src/app/api/teammembers/cv/route.js
  import { connectDb } from "@/connectDb";
  import { NextResponse } from "next/server";
  import { TeamMember } from "../../../../../models/TeamMember";
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
        { folder: "reeorg_tm_cvs", resource_type: "raw" },
        (error, result) => {
          if (error) return reject(new Error(error.message || "Cloudinary upload failed"));
          resolve(result);
        }
      );
      uploadStream.end(buffer);
    });
  };

  export async function PUT(request) {
    try {
      await connectDb();

      const authHeader = request.headers.get("authorization") || "";
      const token = authHeader.replace("Bearer ", "");
      jwt.verify(token, process.env.JWT_SEC);

      const url = new URL(request.url);
      const id = url.searchParams.get("id"); // Team Member ID
      if (!id) return NextResponse.json({ message: "Missing team member ID" }, { status: 400 });

      const teammember = await TeamMember.findById(id);
      if (!teammember) return NextResponse.json({ message: "Team member not found." }, { status: 404 });

      const oldCvUrl = teammember.cvUrl;

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
              const folderName = "reeorg_tm_cvs/";
              if (oldCvUrl.includes(folderName)) {
                  const publicIdWithFolder = oldCvUrl.substring(oldCvUrl.indexOf(folderName));
                  const publicIdWithoutExt = publicIdWithFolder.substring(0, publicIdWithFolder.lastIndexOf('.'));
                  if (publicIdWithoutExt) {
                      await cloudinary.uploader.destroy(publicIdWithoutExt, { resource_type: "raw" });
                  }
              }
          } catch (deleteError) {
              console.error("Failed to delete old team member CV:", deleteError.message);
          }
      }

      const parsedData = await parseCv(fileBuffer);
      if (!parsedData || typeof parsedData !== 'object') {
          throw new Error("Parsing returned invalid data.");
      }

      teammember.cvUrl = uploadedCv.secure_url;
      teammember.skills = parsedData.skills || [];
      teammember.tools = parsedData.tools || [];
      teammember.experience = parsedData.experience || [];
      teammember.education = parsedData.education || [];
      teammember.certifications = parsedData.certifications || [];

      await teammember.save();
      
      revalidatePath(`/member/${id}`);
      
      const updatedProfile = {
        ...teammember.toObject(),
      };

      return NextResponse.json(
        {
          teammember: updatedProfile,
          message: "Profile successfully updated with CV data.",
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("A general error occurred in the team member CV upload process:", error);
      const message = error.message || "An unexpected server error occurred.";
      return NextResponse.json({ message }, { status: 500 });
    }
  }
