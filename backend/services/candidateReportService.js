const {
  generateHiringRecommendation,
} = require(
  "./recommendationService"
);

const {
  generateReportAnalytics,
} = require(
  "./reportAnalyticsService"
);

/*
====================================
BUILD CANDIDATE REPORT
====================================
*/

exports.buildCandidateReport =
  (interview) => {
    const recommendation =
      generateHiringRecommendation(
        interview.overallScores
      );

    const analytics =
      generateReportAnalytics(
        interview
      );

    return {
      candidate:
        interview.candidate,

      scores:
        interview.overallScores,

      recommendation,

      analytics,

      answers:
        interview.answers,
    };
  };