import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import OpenAI from "openai";
import mongoose from "mongoose";

// --- Mongoose models for embeddings ---
const OrgEmbeddingSchema = new mongoose.Schema({
  chunkId: { type: String, unique: true },
  text: String,
  embedding: [Number],
});
const EmpEmbeddingSchema = new mongoose.Schema({
  chunkId: { type: String, unique: true },
  text: String,
  embedding: [Number],
});
const OrgEmbedding =
  mongoose.models.OrgEmbedding ||
  mongoose.model("OrgEmbedding", OrgEmbeddingSchema);
const EmpEmbedding =
  mongoose.models.EmpEmbedding ||
  mongoose.model("EmpEmbedding", EmpEmbeddingSchema);

const NEXT_PUBLIC_MONGO_URL = process.env.NEXT_PUBLIC_MONGO_URL || process.env.NEXT_PUBLIC_MONGO_URL;

async function connectDb() {
  if (!NEXT_PUBLIC_MONGO_URL || typeof NEXT_PUBLIC_MONGO_URL !== "string") {
    throw new Error("MongoDB connection string is not set. Please set NEXT_PUBLIC_MONGO_URL or NEXT_PUBLIC_MONGO_URL in your environment.");
  }
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(NEXT_PUBLIC_MONGO_URL);
  }
}

const BASE_DIR = "/tmp/memorychatbot/data";
const conversationPath = path.join(BASE_DIR, "conversation_history.json");
const memoryPath = path.join(BASE_DIR, "memories.json");
const orgPath = path.join(BASE_DIR, "detailedBusinessProfile.json");
const empPath = path.join(BASE_DIR, "Employee_Profiles_Full.json");

const READONLY_ORG_SRC = path.join(process.cwd(), "data", "detailedBusinessProfile.json");
const READONLY_EMP_SRC = path.join(process.cwd(), "data", "Employee_Profiles_Full.json");

function ensureDataDir() {
  if (!fs.existsSync(BASE_DIR)) {
    fs.mkdirSync(BASE_DIR, { recursive: true });
  }
}

function ensureOrgAndEmpFiles() {
  ensureDataDir();
  if (!fs.existsSync(orgPath)) {
    if (fs.existsSync(READONLY_ORG_SRC)) {
      fs.copyFileSync(READONLY_ORG_SRC, orgPath);
    }
  }
  if (!fs.existsSync(empPath)) {
    if (fs.existsSync(READONLY_EMP_SRC)) {
      fs.copyFileSync(READONLY_EMP_SRC, empPath);
    }
  }
}

function loadHistory() {
  try {
    if (fs.existsSync(conversationPath)) {
      return JSON.parse(fs.readFileSync(conversationPath, "utf-8"));
    }
  } catch (e) {}
  return [];
}

function saveHistory(history) {
  ensureDataDir();
  fs.writeFileSync(conversationPath, JSON.stringify(history, null, 2));
}

function loadMemories() {
  try {
    if (fs.existsSync(memoryPath)) {
      return JSON.parse(fs.readFileSync(memoryPath, "utf-8"));
    }
  } catch (e) {}
  return [];
}

function saveMemories(memories) {
  ensureDataDir();
  fs.writeFileSync(memoryPath, JSON.stringify(memories, null, 2));
}

function loadOrganization() {
  ensureOrgAndEmpFiles();
  try {
    if (fs.existsSync(orgPath)) {
      return JSON.parse(fs.readFileSync(orgPath, "utf-8"));
    }
  } catch (e) {}
  return null;
}

function loadEmployees() {
  ensureOrgAndEmpFiles();
  try {
    if (fs.existsSync(empPath)) {
      return JSON.parse(fs.readFileSync(empPath, "utf-8"));
    }
  } catch (e) {}
  return null;
}

function getOrgChunks(org) {
  if (!org) return [];
  const chunks = [];
  for (const [key, value] of Object.entries(org)) {
    if (typeof value === "object" && value !== null) {
      chunks.push({ id: key, text: `${key}: ${JSON.stringify(value)}` });
    } else {
      chunks.push({ id: key, text: `${key}: ${value}` });
    }
  }
  return chunks;
}

function getEmpChunks(emps) {
  if (!emps) return [];
  return emps.map((emp, idx) => ({ id: idx, text: JSON.stringify(emp) }));
}

function cosineSimilarity(a, b) {
  let dot = 0.0,
    normA = 0.0,
    normB = 0.0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Utility to get a deterministic timestamp for SSR/CSR hydration
function getDeterministicTimestamp() {
  // Use a fixed value for SSR, or Date.now() for client
  if (typeof window === 'undefined') {
    // On server, use a fixed value (e.g., build time or env)
    return '2025-01-01T00:00:00.000Z';
  } else {
    // On client, use current time
    return new Date().toISOString();
  }
}

export async function POST(req) {
  try {
    await connectDb();
    const { message, userId, userIdentity } = await req.json();
    if (!message || !userId)
      return NextResponse.json(
        { error: "Missing message or userId" },
        { status: 400 }
      );
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // Load static data
    const organization = loadOrganization();
    const employees = loadEmployees();

    // --- Embedding cache logic (now MongoDB only) ---
    const orgChunks = getOrgChunks(organization);
    const empChunks = getEmpChunks(employees);
    let orgEmbeddingCache = {};
    let empEmbeddingCache = {};
    // Load org embeddings from DB
    const orgEmbeds = await OrgEmbedding.find({});
    orgEmbeds.forEach((e) => {
      orgEmbeddingCache[e.chunkId] = { text: e.text, embedding: e.embedding };
    });
    // Load emp embeddings from DB
    const empEmbeds = await EmpEmbedding.find({});
    empEmbeds.forEach((e) => {
      empEmbeddingCache[e.chunkId] = { text: e.text, embedding: e.embedding };
    });
    // Embed org chunks if missing
    for (const chunk of orgChunks) {
      if (!orgEmbeddingCache[chunk.id] || !orgEmbeddingCache[chunk.id].embedding) {
        const resp = await openai.embeddings.create({
          model: "text-embedding-3-small",
          input: [chunk.text],
        });
        await OrgEmbedding.updateOne(
          { chunkId: chunk.id },
          { text: chunk.text, embedding: resp.data[0].embedding },
          { upsert: true }
        );
        orgEmbeddingCache[chunk.id] = {
          text: chunk.text,
          embedding: resp.data[0].embedding,
        };
        console.log(`[OrgEmbedding] Created/updated embedding for chunkId: ${chunk.id}`);
      }
    }
    // Remove stale org embeddings
    for (const id of Object.keys(orgEmbeddingCache)) {
      if (!orgChunks.find((c) => c.id == id)) {
        await OrgEmbedding.deleteOne({ chunkId: id });
        delete orgEmbeddingCache[id];
      }
    }
    // Embed emp chunks if missing
    for (const chunk of empChunks) {
      if (!empEmbeddingCache[chunk.id] || !empEmbeddingCache[chunk.id].embedding) {
        const resp = await openai.embeddings.create({
          model: "text-embedding-3-small",
          input: [chunk.text],
        });
        await EmpEmbedding.updateOne(
          { chunkId: chunk.id },
          { text: chunk.text, embedding: resp.data[0].embedding },
          { upsert: true }
        );
        empEmbeddingCache[chunk.id] = {
          text: chunk.text,
          embedding: resp.data[0].embedding,
        };
        console.log(`[EmpEmbedding] Created/updated embedding for chunkId: ${chunk.id}`);
      }
    }
    // Remove stale emp embeddings
    for (const id of Object.keys(empEmbeddingCache)) {
      if (!empChunks.find((c) => c.id == id)) {
        await EmpEmbedding.deleteOne({ chunkId: id });
        delete empEmbeddingCache[id];
      }
    }

    // Load conversation history
    let history = loadHistory();
    if (!Array.isArray(history)) history = [];
    const userHistory = history.filter((h) => h.userId === userId);
    const messages = [];
    if (userIdentity) {
      messages.push({ role: "system", content: userIdentity });
    }
    userHistory.forEach((h) =>
      messages.push({ role: h.role, content: h.content })
    );
    messages.push({ role: "user", content: message });

    // Load memories
    let memories = loadMemories();
    if (!Array.isArray(memories)) memories = [];

    // Embed user message
    const embedResp = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: [message],
    });
    const userEmbedding = embedResp.data[0].embedding;

    // Compute similarity to all memories
    let memSuggestions = [];
    for (let mem of memories) {
      if (!mem.embedding) continue;
      const sim = cosineSimilarity(userEmbedding, mem.embedding);
      memSuggestions.push({ ...mem, relevance: sim });
    }
    memSuggestions.sort((a, b) => b.relevance - a.relevance);
    const topMemories = memSuggestions.slice(0, 3);

    // Compute similarity to org chunks
    let orgSuggestions = [];
    for (const [id, obj] of Object.entries(orgEmbeddingCache)) {
      const sim = cosineSimilarity(userEmbedding, obj.embedding);
      orgSuggestions.push({ id, text: obj.text, relevance: sim });
    }
    orgSuggestions.sort((a, b) => b.relevance - a.relevance);
    const topOrg = orgSuggestions.slice(0, 3);

    // Compute similarity to emp chunks
    let empSuggestions = [];
    for (const [id, obj] of Object.entries(empEmbeddingCache)) {
      const sim = cosineSimilarity(userEmbedding, obj.embedding);
      empSuggestions.push({ id, text: obj.text, relevance: sim });
    }
    empSuggestions.sort((a, b) => b.relevance - a.relevance);
    const topEmp = empSuggestions.slice(0, 3);

    // Build prompt with relevant org/emp/memories
    let relevantOrg = topOrg.map((s, i) => `${i + 1}. ${s.text}`).join("\n");
    let relevantEmp = topEmp
      .map((s, i) => {
        try {
          const empObj = JSON.parse(s.text);
          if (
            empObj["Red Flag"] &&
            empObj["Red Flag"] !== null &&
            empObj["Red Flag"] !== ""
          ) {
            return `${i + 1}. ${s.text}\n⚠️ Red Flag: ${empObj["Red Flag"]}`;
          }
        } catch {}
        return `${i + 1}. ${s.text}`;
      })
      .join("\n");
    let relevantMemories = topMemories
      .map((s, i) => `${i + 1}. ${s.text}`)
      .join("\n");

    // Enhanced system prompt for a flexible, business-focused chatbot
    let systemPrompt = `You are an expert business assistant for company leadership, HR, and business users. You have access to detailed ORGANIZATION and EMPLOYEE data as context, including advanced fields such as performance reviews, KPIs, Red Flags, training history, peer feedback, risk scores, and more.

Your core goal is to help users:
- Understand their company and workforce
- Identify gaps, risks, and opportunities that might prevent them from reaching business goals
- Propose actionable, data-driven insights and recommendations
- Answer advanced questions about performance, skills, org structure, and business strategy

**Formatting Guidelines:**
- Always format your responses using Markdown for clarity and readability.
- Use **bold** for key facts, _italics_ for emphasis, bullet points, numbered lists, headings, and tables where appropriate.
- Use line breaks and spacing to make answers easy to scan.

---
ORGANIZATION DATA (context, use if relevant):
${relevantOrg}

EMPLOYEE DATA (context, use if relevant):
${relevantEmp}

MEMORIES (context, use if relevant):
${relevantMemories}

CONVERSATION HISTORY:
${userHistory
  .map((h) => `${h.role === "user" ? "Human" : "Assistant"}: ${h.content}`)
  .join("\n")}

CURRENT QUERY:
Human: ${message}

Guidelines:
- For questions about the organization, employees, performance, skills, risks, business goals, or workforce analytics, use the provided ORGANIZATION and EMPLOYEE data as much as possible.
- Pay special attention to the 'Red Flag', 'PerformanceRating', 'LastPerformanceReview', 'AbsenteeismOrTurnoverRiskScore', 'EngagementSurveyResults', and similar fields to highlight risks, gaps, or underperformance.
- If the answer is not present in the data, you may use your own knowledge to answer, but always align your suggestions with the context if relevant.
- For general or conversational questions (e.g., greetings, small talk), behave like a normal chatbot and answer helpfully and naturally.
- If you do not have enough information, say so, but try to provide a useful next step or suggestion.
- Never hallucinate facts about the organization or employees that are not present in the data.
- When possible, propose actionable recommendations to help the company reach its business goals, based on the context.
- Be concise, clear, and business-focused in your responses.
- If the user asks for advanced analysis (e.g., underperformance, outdated JDs, skill gaps, risk assessment, succession planning), analyze the context and highlight any issues, risks, or improvement opportunities you can infer from the data.
- If a Red Flag or risk is present for an employee, mention it and suggest mitigation or improvement steps.
- Use a professional, supportive, and insightful tone.
---`;

    // Use GPT-4o for best RAG performance
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
    });
    const assistantReply = completion.choices[0].message.content;
    const chatUsage = completion.usage;

    // Save to history
    history.push({
      userId,
      role: "user",
      content: message,
      timestamp: getDeterministicTimestamp(),
    });
    history.push({
      userId,
      role: "assistant",
      content: assistantReply,
      timestamp: getDeterministicTimestamp(),
    });
    saveHistory(history);

    // Save new memory (user+assistant exchange)
    const memEmbedResp = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: [`Human: ${message}\nAssistant: ${assistantReply}`],
    });
    const memEmbedding = memEmbedResp.data[0].embedding;
    memories.push({
      id: memories.length,
      text: `Human: ${message}\nAssistant: ${assistantReply}`,
      embedding: memEmbedding,
      timestamp: getDeterministicTimestamp(),
      type: "interaction",
      userId,
    });
    saveMemories(memories);

    // Return reply and suggestions
    return NextResponse.json({ reply: assistantReply, usage: chatUsage });
  } catch (error) {
    console.error("Chatbot API error:", error);
    return NextResponse.json(
      { reply: `Error: ${error.message}`, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    // Minimal embedding call to test API key
    const resp = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: ["Hello world!"],
    });
    const usage = resp.data.usage;
    return NextResponse.json({ success: true, usage });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
