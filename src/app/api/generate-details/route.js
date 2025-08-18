import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { name, details } = await request.json();

    if (!name) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 }
      );
    }

    const systemPrompt = `
      You are an expert in corporate strategy and organizational development. 
      Based on the name and description of a corporate entity (like a department or sub-function), 
      your task is to generate a list of 5 relevant 'top skills' and 3 strategic 'goals'.
      - The skills should represent the core competencies needed for that entity to succeed.
      - The goals should be actionable, specific, and appropriate for a corporate setting.
      You must return the response as a valid JSON object with two keys: "topSkills" and "goals".
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Generate the skills and goals for an entity named "${name}" with the following description: "${
            details || "No additional details provided."
          }"`,
        },
      ],
    });

    const content = response.choices[0].message.content;
    const generatedData = JSON.parse(content);
    return NextResponse.json(generatedData, { status: 200 });
  } catch (error) {
    console.error("AI content generation failed:", error);
    const errorMessage = error.response
      ? error.response.data.message
      : error.message;
    return NextResponse.json(
      { message: "Failed to generate content", error: errorMessage },
      { status: 500 }
    );
  }
}
