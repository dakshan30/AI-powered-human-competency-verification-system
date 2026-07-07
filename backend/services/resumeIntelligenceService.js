const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Google Generative AI
const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

/**
 * Parses raw resume text to extract structured profile entities using Gemini-1.5-Flash.
 * 
 * @param {string} rawText - Raw text content extracted from the resume document.
 * @param {string} targetedRole - Target industry role title (context).
 * @returns {Promise<Object>} Object containing structured candidate profile fields.
 */
exports.parseResumeText = async (rawText, targetedRole) => {
  if (!genAI) {
    console.warn("Resume Intelligence: GEMINI_API_KEY is not defined. Using mock fallback parser.");
    return {
      name: "Mock Candidate",
      email: "mock.candidate@example.com",
      phone: "+1-555-0199",
      skills: ["JavaScript", "React", "Node.js"],
      experienceYears: 3,
      matchedRole: targetedRole || "Software Developer",
      projects: ["Enterprise Portal Integration Layout"]
    };
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
      You are an expert AI resume parsing engine. Analyze the provided resume raw text content.
      Extract candidate identity metadata and professional profile entities.
      
      Targeted Role context: "${targetedRole}"
      Resume Raw Content:
      "${rawText}"

      You MUST respond strictly in the following JSON format without enclosing markdown codeblocks:
      {
        "name": "<candidate name or full name>",
        "email": "<clean lowercased email address>",
        "phone": "<contact phone number>",
        "skills": ["<skill 1>", "<skill 2>", ...],
        "experienceYears": <integer representing calculated years of experience>,
        "matchedRole": "<closest industry title matching targeted role context '${targetedRole}'>",
        "projects": ["<case study or software project name 1>", "<project 2>", ...]
      }
    `;

    const result = await model.generateContent(prompt);
    const textResponse = result.response.text().trim();

    let parsedResult;
    try {
      parsedResult = JSON.parse(textResponse);
    } catch (parseError) {
      // Clean potential JSON markdown blocks and retry
      const cleanedText = textResponse
        .replace(/```json/i, "")
        .replace(/```/g, "")
        .trim();
      parsedResult = JSON.parse(cleanedText);
    }

    return {
      name: parsedResult.name || "N/A",
      email: (parsedResult.email || "").toLowerCase().trim() || "n/a@example.com",
      phone: parsedResult.phone || "N/A",
      skills: Array.isArray(parsedResult.skills) ? parsedResult.skills : [],
      experienceYears: parseInt(parsedResult.experienceYears, 10) || 0,
      matchedRole: parsedResult.matchedRole || targetedRole || "Software Engineer",
      projects: Array.isArray(parsedResult.projects) ? parsedResult.projects : []
    };

  } catch (error) {
    console.error("Resume Intelligence Parser Exception:", error);
    throw new Error(`Failed to parse resume text utilizing AI: ${error.message}`);
  }
};