import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import OpenAI from "openai";
import mongoose from "mongoose";

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
    throw new Error("MongoDB connection string is not set.");
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
  if (!fs.existsSync(orgPath) && fs.existsSync(READONLY_ORG_SRC)) {
    fs.copyFileSync(READONLY_ORG_SRC, orgPath);
  }
  if (!fs.existsSync(empPath) && fs.existsSync(READONLY_EMP_SRC)) {
    fs.copyFileSync(READONLY_EMP_SRC, empPath);
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
    const text = typeof value === "object" && value !== null ? `${key}: ${JSON.stringify(value)}` : `${key}: ${value}`;
    chunks.push({ id: key, text });
  }
  return chunks;
}

function getEmpChunks(emps) {
  if (!emps) return [];
  return emps.map((emp, idx) => ({ id: idx.toString(), text: JSON.stringify(emp) }));
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

function getDeterministicTimestamp() {
  if (typeof window === 'undefined') {
    return '2025-01-01T00:00:00.000Z';
  } else {
    return new Date().toISOString();
  }
}

async function getOrCreateEmbedding(openai, model, chunkId, chunkText, dbModel, cache) {
  if (!cache[chunkId] || !cache[chunkId].embedding) {
    const resp = await openai.embeddings.create({ model, input: [chunkText] });
    await dbModel.updateOne(
      { chunkId },
      { text: chunkText, embedding: resp.data[0].embedding },
      { upsert: true }
    );
    cache[chunkId] = { text: chunkText, embedding: resp.data[0].embedding };
    console.log(`[Embedding] Created/updated embedding for chunkId: ${chunkId}`);
  }
}

async function removeStaleEmbeddings(dbModel, cache, currentChunks) {
  const currentIds = new Set(currentChunks.map(c => c.id));
  for (const id of Object.keys(cache)) {
    if (!currentIds.has(id)) {
      await dbModel.deleteOne({ chunkId: id });
      delete cache[id];
    }
  }
}

export async function POST(req) {
  try {
    await connectDb();
    const { message, userId } = await req.json();
    if (!message || !userId)
      return NextResponse.json(
        { error: "Missing message or userId" },
        { status: 400 }
      );
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const EMBEDDING_MODEL = "text-embedding-3-small";

    const organization = loadOrganization();
    const employees = loadEmployees();

    const orgChunks = getOrgChunks(organization);
    const empChunks = getEmpChunks(employees);
    let orgEmbeddingCache = {};
    let empEmbeddingCache = {};

    (await OrgEmbedding.find({})).forEach((e) => {
      orgEmbeddingCache[e.chunkId] = { text: e.text, embedding: e.embedding };
    });
    (await EmpEmbedding.find({})).forEach((e) => {
      empEmbeddingCache[e.chunkId] = { text: e.text, embedding: e.embedding };
    });

    for (const chunk of orgChunks) {
      await getOrCreateEmbedding(openai, EMBEDDING_MODEL, chunk.id, chunk.text, OrgEmbedding, orgEmbeddingCache);
    }
    await removeStaleEmbeddings(OrgEmbedding, orgEmbeddingCache, orgChunks);
    
    for (const chunk of empChunks) {
      await getOrCreateEmbedding(openai, EMBEDDING_MODEL, chunk.id, chunk.text, EmpEmbedding, empEmbeddingCache);
    }
    await removeStaleEmbeddings(EmpEmbedding, empEmbeddingCache, empChunks);


    let history = loadHistory();
    if (!Array.isArray(history)) history = [];
    const userHistory = history.filter((h) => h.userId === userId);

    const embedResp = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: [message],
    });
    const userEmbedding = embedResp.data[0].embedding;

    let memories = loadMemories();
    if (!Array.isArray(memories)) memories = [];

    const getSuggestions = (cache, filterFn) => {
      let suggestions = [];
      for (const [id, obj] of Object.entries(cache)) {
        if (!filterFn || filterFn(obj)) {
          const sim = cosineSimilarity(userEmbedding, obj.embedding);
          suggestions.push({ id, text: obj.text, relevance: sim, embedding: obj.embedding });
        }
      }
      suggestions.sort((a, b) => b.relevance - a.relevance);
      return suggestions.slice(0, 3);
    };

    const topMemories = getSuggestions(memories, (mem) => mem.embedding);
    const topOrg = getSuggestions(orgEmbeddingCache);
    const topEmp = getSuggestions(empEmbeddingCache);

    let relevantOrg = topOrg.map((s, i) => `${i + 1}. ${s.text}`).join("\n");
    let relevantEmp = topEmp
      .map((s, i) => {
        try {
          const empObj = JSON.parse(s.text);
          return empObj["Red Flag"] ? `${i + 1}. ${s.text}\n⚠️ Red Flag: ${empObj["Red Flag"]}` : `${i + 1}. ${s.text}`;
        } catch {
          return `${i + 1}. ${s.text}`;
        }
      })
      .join("\n");
    let relevantMemories = topMemories.map((s, i) => `${i + 1}. ${s.text}`).join("\n");

    const messages = [];
    messages.push({ role: "system", content: `You are an expert business assistant for company leadership, HR, and business users. You have access to detailed ORGANIZATION and EMPLOYEE data as context, including advanced fields such as performance reviews, KPIs, Red Flags, training history, peer feedback, risk scores, and more.

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
- **STRICTLY adhere to the context provided in the ORGANIZATION DATA, EMPLOYEE DATA, and MEMORIES sections.**
- For all questions related to the company, employees, performance, or business strategy, **you MUST ONLY use information present in the provided context.**
- **If the answer or necessary information to formulate an insight is NOT present in the provided context, you MUST politely state that you do not have enough specific data to answer the query, and then suggest what data might be needed (e.g., "I don't have enough specific employee data to answer that. Could you provide a name or department?").** Do not use your general knowledge to answer business-specific questions if the context is missing.
- Pay special attention to 'Red Flag', 'PerformanceRating', 'LastPerformanceReview', 'AbsenteeismOrTurnoverRiskScore', and 'EngagementSurveyResults' to highlight risks or underperformance.
- Never hallucinate facts about the organization or employees that are not present in the data.
- When possible, propose actionable recommendations to help the company reach its business goals, strictly based on the context.
- Be concise, clear, and business-focused in your responses.
- Use a professional, supportive, and insightful tone.` });

    messages.push({ role: "user", content: message });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
    });
    const assistantReply = completion.choices[0].message.content;
    const chatUsage = completion.usage;

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

    const memEmbedResp = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: [`Human: ${message}\nAssistant: ${assistantReply}`],
    });
    const memEmbedding = memEmbedResp.data[0].embedding;
    memories.push({
      id: memories.length.toString(),
      text: `Human: ${message}\nAssistant: ${assistantReply}`,
      embedding: memEmbedding,
      timestamp: getDeterministicTimestamp(),
      type: "interaction",
      userId,
    });
    saveMemories(memories);

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
    const resp = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: ["Hello world!"],
    });
    const usage = resp.usage;
    return NextResponse.json({ success: true, usage });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}