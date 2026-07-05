const path =
  require("path");

const Resume =
  require("../models/Resume");

const Interview =
  require("../models/Interview");

const {
  parseResume,
} = require(
  "../services/resumeParserService"
);

const {
  generateInterviewQuestions,
} = require(
  "../services/interviewQuestionService"
);

/*
====================================
UPLOAD RESUME
====================================
*/

exports.uploadResume =
  async (req, res) => {
    try {
      /*
      FILE VALIDATION
      */

      if (!req.file) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "No file uploaded",
          });
      }

      /*
      FILE PATH
      */

      const filePath =
        path.join(
          req.file.path
        );

      /*
      PARSE RESUME
      */

      const result =
        await parseResume(
          filePath
        );

      /*
      SAVE RESUME
      */

      const resume =
        await Resume.create({
          candidate:
            req.user.id,

          fileName:
            req.file.filename,

          filePath,

          rawText:
            result.rawText,

          atsScore:
            result.atsScore,

          parsedData:
            result.parsedData,
        });

      /*
      SKILLS
      */

      const skills =
        result?.parsedData
          ?.skills || [];

      /*
      EXPERIENCE
      */

      const experience =
        result?.parsedData
          ?.experience || 0;

      /*
      GENERATE QUESTIONS
      */

      let questions = [];

      try {
        questions =
          await generateInterviewQuestions(
            {
              skills,

              experience,
            }
          );
      } catch (error) {
        console.log(
          "Question generation failed:",
          error
        );
      }

      /*
      FALLBACK QUESTIONS
      */

      if (
        !questions ||
        !Array.isArray(
          questions
        ) ||
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

          {
            id: 2,

            question:
              "What is React Virtual DOM?",

            skill:
              "React",

            difficulty:
              "medium",
          },

          {
            id: 3,

            question:
              "Explain Node.js event loop.",

            skill:
              "Node.js",

            difficulty:
              "medium",
          },
        ];
      }

      /*
      CREATE INTERVIEW
      */

     let interview;

try {
  interview =
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

  console.log(
    "Interview created:",
    interview._id
  );
} catch (error) {
  console.log(
    "Interview Creation Error:",
    error
  );

  return res
    .status(500)
    .json({
      success: false,

      message:
        "Interview creation failed",

      error:
        error.message,
    });
}
      /*
      RESPONSE
      */

      return res
        .status(201)
        .json({
          success: true,

          message:
            "Resume uploaded successfully",

          interviewId:
            interview._id,

          resumeId:
            resume._id,

          data: {
            resume,
            interview,
          },
        });
    } catch (error) {
      console.log(
        "Resume Upload Error:",
        error
      );

      return res
        .status(500)
        .json({
          success: false,

          message:
            "Resume upload failed",

          error:
            error.message,
        });
    }
  };