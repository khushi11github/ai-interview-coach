const OpenAI = require("openai");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

const getClient = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured on the server.");
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
};

const parseJsonResponse = (response) => {
  const content = response.choices?.[0]?.message?.content;
  if (!content) throw new Error("The AI provider returned an empty response.");
  return JSON.parse(content);
};

const extractResumeText = async (file) => {
  if (file.mimetype === "text/plain" || file.originalname.toLowerCase().endsWith(".txt")) {
    return file.buffer.toString("utf8");
  }

  if (file.mimetype === "application/pdf" || file.originalname.toLowerCase().endsWith(".pdf")) {
    const result = await pdfParse(file.buffer);
    return result.text;
  }

  if (file.mimetype.includes("word") || file.originalname.toLowerCase().endsWith(".docx")) {
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    return result.value;
  }

  throw new Error("Unsupported resume format.");
};

exports.analyzeResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "A resume file is required." });

    const resumeText = (await extractResumeText(req.file)).trim();
    if (!resumeText) return res.status(422).json({ message: "No readable text was found in the resume." });

    const role = req.body.role || "Fullstack Engineer";
    const jobDescription = req.body.jobDescription || "";
    const client = getClient();
    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "You are an expert technical recruiter and ATS evaluator. Return only valid JSON. Do not invent experience that is absent from the resume. Score evidence quality, keyword alignment, seniority, and clarity.",
        },
        {
          role: "user",
          content: JSON.stringify({
            task: "Analyze this resume for the target role and create an interview plan.",
            targetRole: role,
            jobDescription,
            resume: resumeText.slice(0, 30000),
            outputSchema: {
              score: "integer 0-100",
              role: "string",
              summary: "string",
              foundKeywords: ["string"],
              missingKeywords: ["string"],
              improvements: [{ type: "critical|warning|tip", text: "string" }],
              questions: ["string"],
            },
          }),
        },
      ],
    });

    return res.json({ ...parseJsonResponse(response), filename: req.file.originalname });
  } catch (error) {
    console.error("Resume analysis error", error);
    return res.status(error.message.includes("OPENAI_API_KEY") ? 503 : 500).json({ message: error.message || "Resume analysis failed." });
  }
};

exports.evaluateInterview = async (req, res) => {
  try {
    const { role, difficulty, qaList } = req.body;
    if (!role || !Array.isArray(qaList) || qaList.length === 0) {
      return res.status(400).json({ message: "Role and interview answers are required." });
    }

    const client = getClient();
    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "You are a rigorous technical interviewer. Evaluate only the evidence in each answer. Return only valid JSON and give actionable, specific feedback. Scores must be integers from 0 to 100.",
        },
        {
          role: "user",
          content: JSON.stringify({
            task: "Evaluate this mock interview.",
            role,
            difficulty,
            answers: qaList,
            outputSchema: {
              overallScore: "integer 0-100",
              technicalScore: "integer 0-100",
              communicationScore: "integer 0-100",
              structureScore: "integer 0-100",
              confidenceScore: "integer 0-100",
              evaluations: [{ score: "integer 0-100", strengths: ["string"], weaknesses: ["string"], idealAnswer: "string" }],
            },
          }),
        },
      ],
    });

    return res.json(parseJsonResponse(response));
  } catch (error) {
    console.error("Interview evaluation error", error);
    return res.status(error.message.includes("OPENAI_API_KEY") ? 503 : 500).json({ message: error.message || "Interview evaluation failed." });
  }
};