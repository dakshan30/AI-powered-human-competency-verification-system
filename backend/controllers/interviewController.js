const Interview =
  require("../models/Interview");

const Resume =
  require("../models/Resume");

const {
  generateInterviewQuestions,
} = require(
  "../services/interviewQuestionService"
);

const {
  analyzeResumeIntelligence,
} = require(
  "../services/resumeIntelligenceService"
);

const {
  evaluateAnswer,
} = require(
  "../services/answerEvaluationService"
);

const {
  calculateCompetencyScores,
} = require(
  "../services/competencyScoringService"
);

const {
  generateInterviewReport,
} = require(
  "../services/reportGenerationService"
);

/*
====================================
START INTERVIEW
====================================
*/

exports.startInterview =
  async (req, res) => {
    try {
      /*
      RESUME
      */

      const resume =
        await Resume.findById(
          req.body.resumeId
        );

      if (!resume) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              "Resume not found",
          });
      }

      /*
      INTELLIGENCE
      */

      const intelligence =
        analyzeResumeIntelligence(
          resume.parsedData
        );

      /*
      QUESTIONS
      */

      let questions = [];

      try {
        questions =
          await generateInterviewQuestions(
            {
              role:
                intelligence.role,

              skills:
                resume.parsedData
                  .skills,

              experience:
                intelligence.years,

              difficultyLevel:
                intelligence.difficultyLevel,

              projects:
                resume.parsedData
                  .projects,
            }
          );
      } catch (error) {
        console.log(
          "Question generation failed:",
          error.message
        );
      }

      /*
      FALLBACK
      */

      if (
        !questions ||
        questions.length === 0
      ) {
        questions = [
          {
            id: 1,

            question:
              "Explain JavaScript closures.",

            skill:
              "JavaScript",

            difficulty:
              "medium",
          },
        ];
      }

      /*
      CREATE INTERVIEW
      */

      const interview =
        await Interview.create({
          candidate:
            req.user.id,

          resume:
            resume._id,

          questions,

          currentQuestion: 0,

          answers: [],

          status:
            "in_progress",

          overallScores: {
            technical: 0,

            communication: 0,

            confidence: 0,

            problemSolving: 0,

            competency: 0,
          },
        });

      /*
      RESPONSE
      */

      return res
        .status(201)
        .json({
          success: true,

          message:
            "Interview created successfully",

          data: interview,
        });
    } catch (error) {
      console.log(
        "Start Interview Error:",
        error
      );

      return res
        .status(500)
        .json({
          success: false,

          message:
            "Interview start failed",

          error:
            error.message,
        });
    }
  };

/*
====================================
SUBMIT ANSWER
====================================
*/

exports.submitAnswer =
  async (req, res) => {
    try {
      const { interviewId } =
        req.params;

      const {
        questionId,
        answer,
      } = req.body;

      /*
      VALIDATION
      */

      if (!answer) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Answer is required",
          });
      }

      /*
      FIND INTERVIEW
      */

      const interview =
        await Interview.findById(
          interviewId
        );

      if (!interview) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              "Interview not found",
          });
      }

      /*
      SECURITY CHECK
      */

      if (
        interview.candidate.toString() !==
        req.user.id
      ) {
        return res
          .status(403)
          .json({
            success: false,

            message:
              "Unauthorized interview access",
          });
      }

      /*
      QUESTION
      */

      const question =
        interview.questions.find(
          (q) =>
            q.id ===
            questionId
        );

      if (!question) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              "Question not found",
          });
      }

      /*
      DUPLICATE CHECK
      */

      const alreadyAnswered =
        interview.answers.find(
          (a) =>
            a.questionId ===
            questionId
        );

      if (alreadyAnswered) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Question already answered",
          });
      }

      /*
      SAVE ANSWER
      */

      interview.answers.push({
        questionId,

        question:
          question.question,

        answer,

        skill:
          question.skill,

        difficulty:
          question.difficulty,

        evaluation: {
          technicalScore: 0,

          communicationScore: 0,

          confidenceScore: 0,

          problemSolvingScore: 0,

          overallScore: 0,

          strengths: [],

          weaknesses: [],

          feedback:
            "AI evaluation in progress...",
        },
      });

      /*
      UPDATE QUESTION INDEX
      */

      interview.currentQuestion += 1;

      /*
      COMPLETE
      */

      const isCompleted =
        interview.currentQuestion >=
        interview.questions
          .length;

      if (isCompleted) {
        interview.status =
          "completed";

        interview.completedAt =
          new Date();
      }

      const report =
      await generateInterviewReport(
        interview
      );

    interview.report =
      report;
      /*
      SAVE
      */

      await interview.save();

      /*
      RESPONSE
      */

      res.status(200).json({
        success: true,

        message:
          "Answer submitted successfully",

        data: interview,
      });

      /*
      BACKGROUND AI EVALUATION
      */

      evaluateInBackground(
        interview._id,

        questionId,

        {
          question:
            question.question,

          answer,

          skill:
            question.skill,

          difficulty:
            question.difficulty,

          isCompleted,
        }
      );
    } catch (error) {
      console.log(
        "Submit Answer Error:",
        error
      );

      return res
        .status(500)
        .json({
          success: false,

          message:
            "Answer submission failed",

          error:
            error.message,
        });
    }
  };

/*
====================================
BACKGROUND EVALUATOR
====================================
*/

const evaluateInBackground =
  async (
    interviewId,
    questionId,
    {
      question,
      answer,
      skill,
      difficulty,
      isCompleted,
    }
  ) => {
    try {
      console.log(
        `[AI] Evaluating question ${questionId}`
      );

      /*
      AI EVALUATION
      */

      const evaluation =
        await evaluateAnswer({
          question,

          answer,

          skill,

          difficulty,
        });

      /*
      INTERVIEW
      */

      const interview =
        await Interview.findById(
          interviewId
        );

      if (!interview)
        return;

      /*
      ANSWER INDEX
      */

      const answerIndex =
        interview.answers.findIndex(
          (a) =>
            a.questionId ===
            questionId
        );

      if (
        answerIndex === -1
      )
        return;

      /*
      UPDATE EVALUATION
      */

      interview.answers[
        answerIndex
      ].evaluation =
        evaluation;

      /*
      OVERALL SCORES
      */

      interview.overallScores =
        calculateCompetencyScores(
          interview.answers
        );

      /*
      SAVE
      */

      await interview.save();

      console.log(
        `[AI] Evaluation complete for question ${questionId}`
      );
    } catch (error) {
      console.log(
        `[AI] Evaluation failed:`,
        error.message
      );
    }
  };

/*
====================================
GET INTERVIEW
====================================
*/

exports.getInterview =
  async (req, res) => {
    try {
      const interview =
        await Interview.findById(
          req.params.id
        );

      if (!interview) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              "Interview not found",
          });
      }

      /*
      SECURITY
      */

      if (
        interview.candidate.toString() !==
        req.user.id
      ) {
        return res
          .status(403)
          .json({
            success: false,

            message:
              "Unauthorized access",
          });
      }

      /*
      RESPONSE
      */

      return res
  .status(200)
  .json({
    success: true,
    data: interview,
  });
    } catch (error) {
      console.log(
        "Get Interview Error:",
        error
      );

      return res
        .status(500)
        .json({
          success: false,

          message:
            "Interview fetch failed",

          error:
            error.message,
        });
    }
  };

  exports.getInterviewReport =
  async (
    req,
    res
  ) => {
    try {

      const interview =
        await Interview
          .findById(
            req.params.id
          )
          .populate(
            "candidate"
          );

      if (
        !interview
      ) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Interview not found",
          });
      }

      res.json({
        success: true,
        data:
          interview,
      });

    } catch (
      error
    ) {

      res
        .status(500)
        .json({
          success: false,
          message:
            error.message,
        });
    }
  };

  /*
====================================
UPDATE HIRING DECISION
====================================
*/

exports.updateHiringDecision =
  async (req, res) => {
    try {

      const {
        status,
        comments,
      } = req.body;

      const interview =
        await Interview.findById(
          req.params.id
        );

      if (
        !interview
      ) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Interview not found",
          });
      }

      interview.decision = {
        status,
        comments,

        decidedBy:
          req.user.id,

        decidedAt:
          new Date(),
      };

      await interview.save();

      return res.json({
        success: true,

        message:
          "Hiring decision saved successfully",

        data:
          interview.decision,
      });

    } catch (error) {

      console.log(error);

      return res
        .status(500)
        .json({
          success: false,

          message:
            error.message,
        });
    }
  };