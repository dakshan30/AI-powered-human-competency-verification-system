const fs =
  require("fs");

const pdfParse =
  require("pdf-parse");

const mammoth =
  require("mammoth");

const {
  generateAIResponse,
} = require("./ai/aiService");

const {
  buildResumePrompt,
} = require("./resumePromptBuilder");

const {
  parseAIResponse,
} = require("./aiResponseParser");

const {
  normalizeResumeData,
} = require("./resumeNormalizationService");

const {
  calculateATSScore,
} = require("./atsScoringService");

/*
====================================
MOCK DATA
====================================
*/

const getMockData = (rawText) => ({
  rawText: rawText || "mock resume text",
  parsedData: {
    name: "Test Candidate",
    email: "test@example.com",
    phone: "9999999999",
    skills: [
      "JavaScript",
      "React",
      "Node.js",
      "MongoDB",
      "Express",
    ],
    experience: [
      {
        company: "Tech Corp",
        role: "Software Developer",
        years: "2",
      },
    ],
    education: [
      {
        degree: "B.Tech Computer Science",
        institution: "Test University",
      },
    ],
    projects: [
      "E-commerce App",
      "Chat Application",
    ],
    certifications: [
      "AWS Cloud Practitioner",
    ],
    technologies: [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
    ],
    detectedRole: "Full Stack Developer",
    experienceLevel: "mid",
    strengths: [
      "Strong JavaScript skills",
      "Good problem solving",
    ],
    weaknesses: [
      "Limited cloud experience",
    ],
  },
  atsScore: 78,
});

/*
====================================
PARSE RESUME
====================================
*/

exports.parseResume =
  async (filePath) => {
    try {
      /*
      FILE BUFFER
      */

      const buffer =
        fs.readFileSync(filePath);

      let extractedText = "";

      /*
      PDF
      */

      if (filePath.endsWith(".pdf")) {
        const pdfData =
          await pdfParse(buffer);

        extractedText = pdfData.text;
      }

      /*
      DOCX
      */

      else if (filePath.endsWith(".docx")) {
        const docData =
          await mammoth.extractRawText({
            buffer,
          });

        extractedText = docData.value;
      }

      /*
      ✅ MOCK MODE - bypasses all AI calls
      Set USE_MOCK=true in .env to enable
      */

      if (process.env.USE_MOCK === "true") {
        console.log(
          "[MOCK] Returning mock resume data - AI calls skipped"
        );
        return getMockData(extractedText);
      }

      /*
      BUILD AI PROMPT
      */

      const prompt =
        buildResumePrompt(extractedText);

      /*
      AI ANALYSIS
      */

      const aiResponse =
        await generateAIResponse({
          systemPrompt:
            "You are an expert AI resume parser.",

          userPrompt: prompt,
        });

      /*
      PARSE AI JSON
      */

      const parsedData =
        parseAIResponse(aiResponse);

      /*
      NORMALIZE
      */

      const normalizedData =
        normalizeResumeData(parsedData);

      /*
      ATS SCORE
      */

      const atsScore =
        calculateATSScore(normalizedData);

      /*
      FINAL RESPONSE
      */

      return {
        rawText: extractedText,
        parsedData: normalizedData,
        atsScore,
      };

    } catch (error) {
      console.log(error);

      throw new Error("Resume parsing failed");
    }
  };