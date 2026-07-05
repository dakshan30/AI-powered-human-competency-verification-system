const {
  generateAIResponse,
} = require("./ai/aiService");

/*
====================================
EVALUATE ANSWER
====================================
*/

exports.evaluateAnswer =
  async ({
    question,

    answer,

    skill,

    difficulty,
  }) => {
    try {
      /*
      PROMPT
      */

      const prompt = `
You are an enterprise AI interviewer.

Evaluate the candidate answer.

QUESTION:
${question}

ANSWER:
${answer}

SKILL:
${skill}

DIFFICULTY:
${difficulty}

Return ONLY valid JSON:

{
  "technicalScore": 0-100,
  "communicationScore": 0-100,
  "confidenceScore": 0-100,
  "problemSolvingScore": 0-100,
  "overallScore": 0-100,
  "strengths": [],
  "weaknesses": [],
  "feedback": ""
}
`;

      /*
      AI RESPONSE
      */

      const response =
        await generateAIResponse({
          systemPrompt:
            "You are an AI competency evaluator.",

          userPrompt:
            prompt,
        });

      /*
      PARSE JSON
      */

      const cleaned =
        response
          .replace(
            /```json/g,
            ""
          )
          .replace(
            /```/g,
            ""
          )
          .trim();

      const parsed =
        JSON.parse(cleaned);

      return parsed;
    } catch (error) {
      console.log(
        "Answer Evaluation Error:",
        error
      );

      /*
      FALLBACK
      */

      return {
        technicalScore: 70,

        communicationScore: 70,

        confidenceScore: 70,

        problemSolvingScore: 70,

        overallScore: 70,

        strengths: [
          "Basic understanding",
        ],

        weaknesses: [
          "Needs improvement",
        ],

        feedback:
          "Average performance.",
      };
    }
  };