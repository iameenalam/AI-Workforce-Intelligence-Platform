import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import OpenAI from "openai";
import { connectDb } from "@/connectDb";
import { Organization } from "../../../../models/Organization";
import { Department } from "../../../../models/Departments";
import { TeamMember } from "../../../../models/TeamMember";
import { Employee } from "../../../../models/Employee";
import CheckAuth from "../../../../middlewares/isAuth";

const conversationPath = path.join(process.cwd(), ".chatbot-cache", "conversation_history.json");

function loadHistory() {
  try {
    const dir = path.dirname(conversationPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (fs.existsSync(conversationPath)) {
      return JSON.parse(fs.readFileSync(conversationPath, "utf-8"));
    }
  } catch (e) {
  }
  return [];
}

function saveHistory(history) {
  try {
    const dir = path.dirname(conversationPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(conversationPath, JSON.stringify(history, null, 2));
  } catch (e) {
  }
}

const cleanDoc = (doc, fieldsToDelete = []) => {
  const obj = { ...doc };
  delete obj._id;
  delete obj.user;
  delete obj.__v;
  fieldsToDelete.forEach(field => delete obj[field]);
  return obj;
};

export async function POST(req) {
  try {
    const { message, userId, token } = await req.json();

    if (!message || !userId || !token) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    await connectDb();
    const user = await CheckAuth(token);
    if (!user) {
      return NextResponse.json({ reply: "Authentication failed. Please log in again." }, { status: 401 });
    }

    const [organization, departments, teammembers, employees] = await Promise.all([
      Organization.findOne({ user: user._id }).lean(),
      Department.find({ user: user._id }).lean(),
      TeamMember.find({ user: user._id }).lean(),
      Employee.find({ user: user._id }).populate('department', 'departmentName').lean(),
    ]);

    if (!organization) {
      return NextResponse.json({ reply: "No organization data found for your account." }, { status: 404 });
    }

    const fullOrgData = JSON.stringify(cleanDoc(organization), null, 2);
    
    const fullDeptDataWithReporting = departments.map(d => {
        const deptCleaned = cleanDoc(d, ['organization']);
        deptCleaned.reportsTo = organization.ceoName; 
        return deptCleaned;
    });
    const fullDeptData = JSON.stringify(fullDeptDataWithReporting, null, 2);

    const fullTeamData = JSON.stringify(teammembers.map(tm => cleanDoc(tm, ['organization', 'department'])), null, 2);

    // Process employees data with enhanced information
    const fullEmployeeData = JSON.stringify(employees.map(emp => {
      const cleanedEmp = cleanDoc(emp, ['organization', 'user']);
      // Add department name for better context
      if (emp.department && emp.department.departmentName) {
        cleanedEmp.departmentName = emp.department.departmentName;
      }
      return cleanedEmp;
    }), null, 2);

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const history = loadHistory();
    const userHistory = history.filter((h) => h.userId === userId);

    const systemPrompt = `You are an expert business assistant for ${organization.name}'s leadership, HR, and business users. You have access to comprehensive ORGANIZATION and EMPLOYEE data, including CEO profiles, department structures, HOD information, and detailed employee records with skills, experience, education, certifications, current role assignments, payroll information, and performance tracking data.

**Core Task:**
1.  **Analyze the User's Query:** Understand the user's specific question by looking at the last message in our conversation.
2.  **Synthesize Data:** Scan all provided data—including CEO, departments, HODs, employees, team members, payroll, and performance metrics—to find relevant facts.
3.  **Formulate a Strategic Response:** Construct a comprehensive and direct answer based on the current organizational structure, employee information, compensation data, and performance tracking.

---
### CEO PROFILE & QUALIFICATIONS:
- **CEO Name:** ${organization.ceoName}
- **Skills:** ${organization.ceoSkills && organization.ceoSkills.length > 0 ? organization.ceoSkills.join(', ') : 'Not available.'}
- **Tools:** ${organization.ceoTools && organization.ceoTools.length > 0 ? organization.ceoTools.join(', ') : 'Not available.'}
- **Experience:** ${organization.ceoExperience && organization.ceoExperience.length > 0 ? organization.ceoExperience.map(exp => `  - ${exp.title} at ${exp.company} (${exp.duration})`).join('\n') : 'Not available.'}
- **Education:** ${organization.ceoEducation && organization.ceoEducation.length > 0 ? organization.ceoEducation.map(edu => `  - ${edu.degree} from ${edu.institution} (${edu.year})`).join('\n') : 'Not available.'}
- **Certifications:** ${organization.ceoCertifications && organization.ceoCertifications.length > 0 ? organization.ceoCertifications.map(cert => `  - ${cert.title} (${cert.duration})`).join('\n') : 'Not available.'}

---
### FULL ORGANIZATION DATA (GENERAL):
\`\`\`json
${fullOrgData}
\`\`\`

### FULL DEPARTMENT & HOD DATA:
This section contains details for each department, including the professional background of the Head of Department (HOD).
\`\`\`json
${fullDeptData}
\`\`\`

### FULL TEAM MEMBER DATA (Legacy System):
This section contains details for team members from the legacy system.
\`\`\`json
${fullTeamData}
\`\`\`

### FULL EMPLOYEE DATA (Current System):
This section contains comprehensive details for all current employees, including their roles, professional backgrounds, skills, experience, education, certifications, current assignments, payroll information (salary, bonuses, stock options), and performance tracking data (goals, completion rates, review schedules).

**PAYROLL DATA INCLUDES:**
- Base salary information
- Bonus amounts
- Stock option allocations
- Last raise dates

**PERFORMANCE DATA INCLUDES:**
- Overall completion percentages
- Individual goal tracking with completion rates
- Goal statuses (not_started, in_progress, completed, overdue)
- Review cadence and scheduling
- Performance review dates

\`\`\`json
${fullEmployeeData}
\`\`\`
---

**Response Guidelines:**
* **Natural Language:** Integrate data seamlessly into your answers. Do not start responses with phrases like "Based on the provided data." Instead, state the facts directly.
* **Brevity:** Be concise and to the point. Avoid long paragraphs and unnecessary filler. Provide direct answers.
* **Data First, Then Insight:** Base your initial findings on the provided data. After presenting the facts, you may add a section for "Strategic Insights" or "Potential Risks".
* **Signal External Knowledge:** You **must** clearly indicate when you are using external knowledge. Example: "While the data shows [fact X], general industry best practices suggest [insight Y]."
* **Context is Key:** Apply external knowledge directly to the context of "${organization.name}".
* **Payroll Analysis:** When discussing compensation, analyze salary ranges, bonus distributions, stock option allocations, and raise patterns across departments and roles.
* **Performance Insights:** When discussing performance, analyze goal completion rates, review schedules, overdue goals, and performance trends across teams.
* **HR Analytics:** Provide insights on compensation equity, performance distribution, goal achievement rates, and identify potential areas for improvement.
* **Handling Off-Topic Queries:** If a query is not about the organization, respond with: "My purpose is to provide insights about ${organization.name}. I cannot answer questions on that topic."
* **Clarity and Formatting:** Use Markdown extensively for readability.
* **Handling Missing Data:** If you cannot find an answer in the data, state that clearly.
`;

    const messagesForApi = [
        { role: "system", content: systemPrompt }
    ];

    const recentHistory = userHistory.slice(-6);
    recentHistory.forEach(turn => {
        messagesForApi.push({ role: turn.role, content: turn.content });
    });

    messagesForApi.push({ role: "user", content: message });


    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messagesForApi,
      temperature: 0.3,
    });
    const assistantReply = completion.choices[0].message.content;

    history.push({ userId, role: "user", content: message, timestamp: new Date().toISOString() });
    history.push({ userId, role: "assistant", content: assistantReply, timestamp: new Date().toISOString() });
    saveHistory(history);

    return NextResponse.json({ reply: assistantReply, usage: completion.usage });
  } catch (error) {
    console.error("Chatbot API error:", error);
    if (error.code === "context_length_exceeded") {
      return NextResponse.json({ reply: "Error: The company data is too large to process. The request failed." }, { status: 413 });
    }
    return NextResponse.json({ reply: `An unexpected error occurred: ${error.message}` }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "Chatbot endpoint is active." });
}
