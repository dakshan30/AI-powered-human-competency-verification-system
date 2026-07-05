/*
====================================
GENERATE REPORT ANALYTICS
====================================
*/

exports.generateReportAnalytics =
  (interview) => {
    const scores =
      interview.overallScores;

    /*
    STRENGTHS
    */

    const strengths = [];

    if (
      scores.technical >= 80
    ) {
      strengths.push(
        "Strong technical competency"
      );
    }

    if (
      scores.communication >=
      75
    ) {
      strengths.push(
        "Excellent communication"
      );
    }

    if (
      scores.problemSolving >=
      80
    ) {
      strengths.push(
        "Strong problem-solving skills"
      );
    }

    /*
    IMPROVEMENTS
    */

    const improvements = [];

    if (
      scores.confidence < 70
    ) {
      improvements.push(
        "Improve interview confidence"
      );
    }

    if (
      scores.communication <
      70
    ) {
      improvements.push(
        "Improve communication clarity"
      );
    }

    return {
      strengths,

      improvements,
    };
  };