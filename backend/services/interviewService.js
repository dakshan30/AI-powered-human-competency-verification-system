const Question = require("../models/Question");
const InterviewSession = require("../models/InterviewSession");
const Resume = require("../models/Resume");
const aiEvaluationService = require("./aiEvaluationService");

/**
 * Escapes regex special characters.
 */
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Dynamically queries active questions matching candidate parsed resume skills and matchedRole context.
 * Provisions and starts a customized InterviewSession.
 * 
 * @param {string} candidateId - Ref: User model.
 * @param {number|string} [questionCount=5] - Target number of questions to pull.
 * @returns {Promise<Object>} The initialized InterviewSession.
 */
exports.initializeResumeDrivenSession = async (candidateId, questionCount = 5) => {
  try {
    const size = parseInt(questionCount, 10) || 5;

    // 1. Fetch candidate's active resume details
    const resume = await Resume.findOne({ candidateId });
    if (!resume) {
      throw new Error("No active resume profile discovered for candidate. Please upload your resume first.");
    }

    const skills = resume.parsedData?.skills || [];
    const matchedRole = resume.parsedData?.matchedRole || "";

    if (skills.length === 0 && !matchedRole) {
      throw new Error("Candidate resume profile has zero parsed skills or matching role title.");
    }

    // 2. Build high-performance aggregation match pipeline
    const skillRegexes = skills.map(skill => new RegExp(`\\b${escapeRegExp(skill)}\\b`, "i"));
    const roleRegex = matchedRole ? new RegExp(escapeRegExp(matchedRole), "i") : null;

    const orClauses = [];
    if (skillRegexes.length > 0) {
      orClauses.push({ category: { $in: skillRegexes } });
      orClauses.push({ text: { $in: skillRegexes } });
    }
    if (roleRegex) {
      orClauses.push({ category: roleRegex });
      orClauses.push({ text: roleRegex });
    }

    const matchQuery = {
      isActive: true,
      $or: orClauses.length > 0 ? orClauses : [{ isActive: true }]
    };

    // Aggregate randomized samples from the filtered candidate match pool
    let matchedQuestions = await Question.aggregate([
      { $match: matchQuery },
      { $sample: { size } }
    ]);

    // 3. Fallback query if matching question pool size is smaller than requested count
    if (matchedQuestions.length < size) {
      const fallbackCount = size - matchedQuestions.length;
      const excludedIds = matchedQuestions.map(q => q._id);

      const fallbackQuestions = await Question.aggregate([
        { $match: { isActive: true, _id: { $nin: excludedIds } } },
        { $sample: { size: fallbackCount } }
      ]);

      matchedQuestions = [...matchedQuestions, ...fallbackQuestions];
    }

    if (matchedQuestions.length === 0) {
      throw new Error("No active questions available in the platform database.");
    }

    // 4. Provision and start the Interview Session
    const sessionQuestions = matchedQuestions.map(q => ({
      questionId: q._id,
      text: q.text,
      candidateAnswer: "",
      aiScore: 0,
      aiFeedback: ""
    }));

    const session = new InterviewSession({
      candidateId,
      category: matchedRole || "General Technical Assessment",
      status: "in_progress",
      questions: sessionQuestions,
      currentQuestionIndex: 0,
      overallCompetencyScore: 0,
      recommendation: "HOLD",
      interviewDate: new Date()
    });

    await session.save();
    return session;

  } catch (error) {
    throw {
      success: false,
      message: error.message || "Failed to initialize resume-driven interview session.",
      code: "INIT_RESUME_SESSION_ERROR"
    };
  }
};

/**
 * Legacy initializeSession helper for backwards compatibility.
 */
exports.initializeSession = async (candidateId, category, questionCount = 5) => {
  return exports.initializeResumeDrivenSession(candidateId, questionCount);
};

/**
 * Saves candidate's response, invokes the AI evaluator, updates details, and advances session index.
 * If all questions are answered, automatically concludes and finalizes the session.
 */
exports.submitAnswerAndProgress = async (sessionId, answer) => {
  try {
    const session = await InterviewSession.findById(sessionId);
    if (!session) {
      throw new Error("Interview session not found.");
    }

    if (session.status !== "in_progress") {
      throw new Error(`Cannot submit answer. Session status is '${session.status}'.`);
    }

    const currentIndex = session.currentQuestionIndex;
    if (currentIndex >= session.questions.length) {
      throw new Error("All questions in this session have already been answered.");
    }

    const currentSessionQuestion = session.questions[currentIndex];

    // Fetch the target Question object to retrieve ideal answer benchmarking context
    const questionDoc = await Question.findById(currentSessionQuestion.questionId);
    const idealAnswer = questionDoc 
      ? questionDoc.idealAnswer 
      : "Benchmark accuracy guidelines based on standard technical norms.";

    // Trigger AI evaluation pipeline
    const evaluation = await aiEvaluationService.evaluateAnswer(
      currentSessionQuestion.text,
      idealAnswer,
      answer || ""
    );

    // Save answer and evaluation scores to the embedded array document
    currentSessionQuestion.candidateAnswer = answer || "";
    currentSessionQuestion.aiScore = evaluation.score;
    currentSessionQuestion.aiFeedback = evaluation.feedback;

    // Progress current index
    session.currentQuestionIndex += 1;

    // Check if we reached conclusion
    if (session.currentQuestionIndex >= session.questions.length) {
      session.status = "completed";
      await session.save();
      // Conclude and finalize score calculations
      return await exports.finalizeInterviewSession(session._id);
    } else {
      await session.save();
      return session;
    }
  } catch (error) {
    throw {
      success: false,
      message: `Failed to submit answer: ${error.message}`,
      code: "SUBMIT_ANSWER_ERROR"
    };
  }
};

/**
 * Computes average score values and assigns enum recommendation tiers (STRONG_HIRE, HIRE, HOLD, REJECT).
 */
exports.finalizeInterviewSession = async (sessionId) => {
  try {
    const session = await InterviewSession.findById(sessionId);
    if (!session) {
      throw new Error("Interview session not found.");
    }

    const totalQuestions = session.questions.length;
    let totalScoreSum = 0;

    session.questions.forEach(q => {
      totalScoreSum += q.aiScore;
    });

    const averageScore = totalQuestions > 0 ? Math.round(totalScoreSum / totalQuestions) : 0;
    session.overallCompetencyScore = averageScore;

    // Apply recruitment evaluation heuristics
    if (averageScore >= 85) {
      session.recommendation = "STRONG_HIRE";
    } else if (averageScore >= 70) {
      session.recommendation = "HIRE";
    } else if (averageScore >= 50) {
      session.recommendation = "HOLD";
    } else {
      session.recommendation = "REJECT";
    }

    session.status = "completed";
    await session.save();
    return session;
  } catch (error) {
    throw {
      success: false,
      message: `Failed to finalize session evaluation: ${error.message}`,
      code: "FINALIZE_SESSION_ERROR"
    };
  }
};
