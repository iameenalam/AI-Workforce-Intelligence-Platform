import { PdfReader } from "pdfreader";
import { OpenAI } from "openai";

function extractTextFromPdf(buffer) {
  return new Promise((resolve, reject) => {
    let combinedText = "";
    new PdfReader().parseBuffer(buffer, (err, item) => {
      if (err) {
        reject(err);
      } else if (!item) {
        resolve(combinedText);
      } else if (item.text) {
        combinedText += item.text + " ";
      }
    });
  });
}

export async function parseCv(fileBuffer) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not defined in your environment variables.");
  }
  const openai = new OpenAI({ apiKey });

  const cvText = await extractTextFromPdf(fileBuffer);

  if (!cvText || cvText.trim().length === 0) {
    throw new Error("Could not extract any text from the provided PDF.");
  }

  const systemPrompt = `You are an expert CV and resume parser. Analyze the provided text and convert it into a structured JSON object.
The object must have these keys: "skills", "experience", "education", "certifications", and "tools".
- "skills": An array of strings representing professional skills.
- "experience": An array of objects, each with "title", "company", "duration", and a "description" of key contributions.
- "education": An array of objects, each with "degree", "institution", and "year".
- "certifications": An array of objects, each with "title", "location", and "duration".
- "tools": An array of strings listing software, technologies, or tools mentioned.
Return only the raw JSON object.`;

  const userPrompt = `Please parse the following CV text: --- ${cvText} ---`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
    });

    if (response.choices && response.choices.length > 0) {
      const jsonString = response.choices[0].message.content;
      return JSON.parse(jsonString);
    } else {
      throw new Error("Invalid or empty response structure from OpenAI API.");
    }
  } catch (error) {
    console.error("Error during CV parsing with OpenAI:", error);
    const errorMessage = error.response ? error.response.data.error.message : error.message;
    throw new Error(`Failed to parse CV data using the AI service: ${errorMessage}`);
  }
}
