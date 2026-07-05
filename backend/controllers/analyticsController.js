const Interview =
  require("../models/Interview");

const {
  generateAnalytics,
} = require("../services/analyticsService");

const {
  generateHiringRecommendation,
} = require("../services/recommendationService");

const {
  generateBenchmark,
} = require("../services/benchmarkService");

/*
====================================
GET ANALYTICS
====================================
*/

exports.getAnalytics =
  async (req, res) => {
    try {
      /*
      INTERVIEWS
      */

      const interviews =
        await Interview.find({
          status:
            "completed",
        });

      /*
      ANALYTICS
      */

      const analytics =
        generateAnalytics(
          interviews
        );

      /*
      SCORES
      */

      const scores =
        interviews.map(
          (interview) =>
            interview
              .overallScores
              .competency || 0
        );

      /*
      REPORTS
      */

      const candidateReports =
        interviews.map(
          (interview) => {
            const recommendation =
              generateHiringRecommendation(
                interview.overallScores
              );

            const benchmark =
              generateBenchmark(
                interview
                  .overallScores
                  .competency || 0,

                scores
              );

            return {
              interviewId:
                interview._id,

              candidate:
                interview
                  .candidate,

              scores:
                interview
                  .overallScores,

              recommendation,

              benchmark,
            };
          }
        );

      /*
      RESPONSE
      */

      res.status(200).json({
        success: true,

        analytics,

        candidateReports,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,

        message:
          "Analytics fetch failed",
      });
    }
  };