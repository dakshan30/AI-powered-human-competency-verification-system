const {
  generateAIResponse,
} = require("./ai/aiService");

const {
  buildInterviewPrompt,
} = require("./aiPromptBuilder");

const {
  parseAIResponse,
} = require("./aiResponseParser");

const {
  validateQuestions,
} = require("./questionValidator");

/*
====================================
FALLBACK QUESTIONS
====================================
*/

const fallbackQuestions = [
  {
    id: 1,
    question: "Explain JavaScript closures.",
    difficulty: "medium",
    skill: "JavaScript",
    type: "technical",
    expectedTopics: ["scope", "lexical environment"],
    evaluationCriteria: ["technical accuracy", "clarity"],
    estimatedTime: 180,
  },
  {
    id: 2,
    question: "What is React Virtual DOM?",
    difficulty: "medium",
    skill: "React",
    type: "technical",
    expectedTopics: ["rendering", "diffing", "performance"],
    evaluationCriteria: ["conceptual understanding"],
    estimatedTime: 180,
  },
  {
    id: 3,
    question: "Explain Node.js event loop.",
    difficulty: "medium",
    skill: "Node.js",
    type: "technical",
    expectedTopics: ["async", "event queue", "callbacks"],
    evaluationCriteria: ["backend knowledge"],
    estimatedTime: 180,
  },
  {
    id: 4,
    question: "What is the difference between SQL and NoSQL databases?",
    difficulty: "medium",
    skill: "Database",
    type: "technical",
    expectedTopics: ["relational", "document store", "scalability"],
    evaluationCriteria: ["conceptual understanding", "use case knowledge"],
    estimatedTime: 180,
  },
  {
    id: 5,
    question: "Explain REST API principles.",
    difficulty: "medium",
    skill: "API Design",
    type: "technical",
    expectedTopics: ["stateless", "HTTP methods", "endpoints"],
    evaluationCriteria: ["technical accuracy", "practical knowledge"],
    estimatedTime: 180,
  },
];

/*
====================================
MOCK QUESTIONS
====================================
*/

const getMockQuestions = (skills = []) => {
  const topSkill = skills[0] || "JavaScript";

  return [
    {
      id: 1,
      question: `Explain how you have used ${topSkill} in your projects.`,
      difficulty: "medium",
      skill: topSkill,
      type: "technical",
      expectedTopics: ["practical usage", "best practices"],
      evaluationCriteria: ["clarity", "technical depth"],
      estimatedTime: 180,
    },
    {
      id: 2,
      question: "Describe a challenging bug you faced and how you solved it.",
      difficulty: "medium",
      skill: "Problem Solving",
      type: "scenario-based",
      expectedTopics: ["debugging", "critical thinking"],
      evaluationCriteria: ["problem solving approach", "communication"],
      estimatedTime: 180,
    },
    {
      id: 3,
      question: "Explain the concept of RESTful APIs and how you have worked with them.",
      difficulty: "medium",
      skill: "API Design",
      type: "technical",
      expectedTopics: ["HTTP methods", "stateless", "endpoints"],
      evaluationCriteria: ["technical accuracy", "practical knowledge"],
      estimatedTime: 180,
    },
    {
      id: 4,
      question: "How do you handle asynchronous operations in JavaScript?",
      difficulty: "medium",
      skill: "JavaScript",
      type: "technical",
      expectedTopics: ["promises", "async/await", "callbacks"],
      evaluationCriteria: ["technical depth", "clarity"],
      estimatedTime: 180,
    },
    {
      id: 5,
      question: "Describe your experience with version control and Git workflows.",
      difficulty: "medium",
      skill: "Git",
      type: "practical implementation",
      expectedTopics: ["branching", "merging", "pull requests"],
      evaluationCriteria: ["practical knowledge", "team collaboration"],
      estimatedTime: 180,
    },
  ];
};

/*
====================================
GENERATE QUESTIONS
====================================
*/

exports.generateInterviewQuestions =
  async ({
    role = "Software Developer",
    skills = [],
    experience = 0,
    difficultyLevel = "medium",
    projects = [],
  }) => {
    try {
      /*
      ✅ MOCK MODE - bypasses all AI calls
      Set USE_MOCK=true in .env to enable
      */

      if (process.env.USE_MOCK === "true") {
        console.log(
          "[MOCK] Returning mock interview questions - AI calls skipped"
        );
        return getMockQuestions(skills);
      }

      /*
      BUILD PROMPT
      */

      const prompt =
        buildInterviewPrompt({
          role,
          skills,
          experience,
          difficultyLevel,
          projects,
        });

      /*
      AI RESPONSE
      */

      const aiContent =
        await generateAIResponse({
          systemPrompt:
            "You are a highly accurate enterprise AI interviewer. Return ONLY valid JSON.",

          userPrompt: prompt,
        });

      /*
      LOG RESPONSE
      */

      console.log(
        "\nAI QUESTION RESPONSE:\n",
        aiContent
      );

      /*
      SAFE PARSE
      */

      const parsed =
        parseAIResponse(aiContent);

      /*
      VALIDATION
      */

      if (!parsed || !parsed.questions) {
        console.log("Invalid AI response structure");
        return fallbackQuestions;
      }

      /*
      VALIDATE QUESTIONS
      */

      const validatedQuestions =
        validateQuestions(parsed.questions);

      /*
      EMPTY CHECK
      */

      if (
        !validatedQuestions ||
        validatedQuestions.length === 0
      ) {
        console.log("No valid questions generated");
        return fallbackQuestions;
      }

      /*
      NORMALIZE
      */

      return validatedQuestions.map(
        (question, index) => ({
          id: index + 1,
          question:
            question.question ||
            "Explain your technical experience.",
          difficulty:
            question.difficulty || "medium",
          skill: question.skill || "General",
          type: question.type || "technical",
          expectedTopics:
            question.expectedTopics || [],
          evaluationCriteria:
            question.evaluationCriteria || [],
          estimatedTime:
            question.estimatedTime || 180,
        })
      );

    } catch (error) {
      console.log(
        "Interview Question Generation Error:",
        error
      );

      return fallbackQuestions;
    }
  };