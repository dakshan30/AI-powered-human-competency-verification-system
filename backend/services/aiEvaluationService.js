const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Google Generative AI with the API Key
const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

/**
 * Evaluates candidate technical response correctness against the benchmark ideal answer.
 * Uses gemini-1.5-flash with JSON mode output constraints.
 * 
 * @param {string} questionText - The question text asked.
 * @param {string} idealAnswer - The model benchmark ideal answer.
 * @param {string} candidateAnswer - The candidate's technical response.
 * @returns {Promise<Object>} An object containing `{ score: Number (0-100), feedback: String }`.
 */
exports.evaluateAnswer = async (questionText, idealAnswer, candidateAnswer) => {
  // If API key is missing, fallback gracefully to a generic score to prevent server crash
  if (!genAI) {
    console.warn("AI Evaluation Service: GEMINI_API_KEY is not defined. Using mock fallback logic.");
    return {
      score: 50,
      feedback: "API credentials missing. Baseline mock score assigned."
    };
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
      You are an expert AI technical interviewer. Evaluate the candidate's answer compared to the provided ideal benchmark answer for the technical question.

      Question: "${questionText}"
      Ideal Benchmark Answer: "${idealAnswer}"
      Candidate's Response: "${candidateAnswer}"

      Critically review the candidate's response. Assess technical correctness, identify missing critical concepts, and highlight strengths.
      
      You MUST respond strictly in the following JSON format without any enclosing markdown codes (like \`\`\`json):
      {
        "score": <integer value between 0 and 100 representing correctness>,
        "feedback": "<a detailed textual review assessing accuracy, concepts missed, and strengths>"
      }
    `;

    const result = await model.generateContent(prompt);
    const textResponse = result.response.text().trim();

    let parsedResult;
    try {
      parsedResult = JSON.parse(textResponse);
    } catch (parseError) {
      // Clean potential markdown wrap and retry parse
      const cleanedText = textResponse
        .replace(/```json/i, "")
        .replace(/```/g, "")
        .trim();
      parsedResult = JSON.parse(cleanedText);
    }

    let score = parseInt(parsedResult.score, 10);
    if (isNaN(score) || score < 0 || score > 100) {
      score = 0;
    }

    return {
      score,
      feedback: parsedResult.feedback || "No assessment comments returned by the evaluator."
    };

  } catch (error) {
    console.error("AI Evaluation Service Exception:", error);
    // Robust fallback to prevent workflow failure
    return {
      score: 0,
      feedback: `AI evaluation process failed due to: ${error.message}. Score defaulted to 0.`
    };
  }
};
