const Resume =
  require("../models/Resume");

const {
  analyzeResumeIntelligence,
} = require("../services/resumeIntelligenceService");

const {
  generateInterviewQuestions,
} = require("../services/interviewQuestionService");

/*
====================================
GENERATE INTERVIEW
====================================
*/

exports.generateInterview =
  async (req, res) => {
    try {
      /*
      GET RESUME
      */

      const resume =
        await Resume.findById(
          req.params.resumeId
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
      ANALYZE RESUME
      */

      const intelligence =
        analyzeResumeIntelligence(
          resume.parsedData
        );

      /*
      GENERATE QUESTIONS
      */

      const questions =
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

      /*
      RESPONSE
      */

      res.status(200).json({
        success: true,

        intelligence,

        totalQuestions:
          questions.length,

        questions,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,

        message:
          "AI interview generation failed",
      });
    }
  };