/*
====================================
GENERATE REPORT ANALYTICS (PRODUCTION)
====================================
*/

exports.generateReportAnalytics =
  (interview) => {
    const scores =
      interview.overallScores ||
      {};

    /*
    STRENGTHS - DETAILED
    */

    const strengths = [];

    if (
      scores.technical >= 85
    ) {
      strengths.push(
        "Exceptional technical expertise demonstrated"
      );
    } else if (
      scores.technical >= 75
    ) {
      strengths.push(
        "Strong technical competency"
      );
    }

    if (
      scores.communication >=
      85
    ) {
      strengths.push(
        "Outstanding communication and articulation"
      );
    } else if (
      scores.communication >=
      75
    ) {
      strengths.push(
        "Excellent communication skills"
      );
    }

    if (
      scores.problemSolving >=
      85
    ) {
      strengths.push(
        "Exceptional problem-solving and analytical skills"
      );
    } else if (
      scores.problemSolving >=
      75
    ) {
      strengths.push(
        "Strong problem-solving ability"
      );
    }

    if (
      scores.confidence >=
      80
    ) {
      strengths.push(
        "Confident and composed throughout interview"
      );
    }

    if (
      scores.competency >= 80
    ) {
      strengths.push(
        "Overall high competency level"
      );
    }

    /*
    IMPROVEMENTS - DETAILED
    */

    const improvements = [];

    if (
      scores.technical < 70
    ) {
      improvements.push(
        "Enhance technical depth in core domain knowledge"
      );
    }

    if (
      scores.communication <
      70
    ) {
      improvements.push(
        "Work on clarity and conciseness of explanations"
      );
    }

    if (
      scores.problemSolving <
      70
    ) {
      improvements.push(
        "Develop more structured approach to problem-solving"
      );
    }

    if (
      scores.confidence < 70
    ) {
      improvements.push(
        "Build confidence in technical discussions"
      );
    }

    if (
      scores.competency < 60
    ) {
      improvements.push(
        "Invest in continuous learning and skill development"
      );
    }

    /*
    RISK ASSESSMENT
    */

    let riskLevel =
      "Low";

    if (
      scores.competency < 55
    ) {
      riskLevel = "Critical";
    } else if (
      scores.competency < 65
    ) {
      riskLevel = "High";
    } else if (
      scores.competency < 75
    ) {
      riskLevel = "Medium";
    }

    /*
    PERFORMANCE TREND
    */

    const avgScore =
      (scores.technical +
        scores.communication +
        scores.problemSolving +
        scores.confidence +
        scores.competency) /
      5 || 0;

    let trend =
      "Stable";

    if (avgScore >= 80) {
      trend = "Excellent";
    } else if (
      avgScore >= 70
    ) {
      trend = "Good";
    } else if (
      avgScore < 50
    ) {
      trend = "Concerning";
    }

    /*
    KEY INSIGHTS
    */

    const insights = [];

    const topScore =
      Math.max(
        scores.technical || 0,
        scores.communication ||
          0,
        scores.problemSolving ||
          0,
        scores.confidence || 0
      );

    const bottomScore =
      Math.min(
        scores.technical || 0,
        scores.communication ||
          0,
        scores.problemSolving ||
          0,
        scores.confidence || 0
      );

    const scoreSpread =
      topScore - bottomScore;

    if (scoreSpread > 30) {
      insights.push(
        "Candidate shows uneven performance across competencies - focus on weaker areas"
      );
    }

    if (
      scores.communication >
      scores.technical + 10
    ) {
      insights.push(
        "Strong communication skills could help overcome technical gaps"
      );
    }

    if (
      scores.problemSolving >
      scores.communication + 10
    ) {
      insights.push(
        "Technical capability is stronger than communication - recommend communication training"
      );
    }

    return {
      strengths:
        strengths.length >
        0
          ? strengths
          : [
              "Meets baseline competency requirements",
            ],

      improvements:
        improvements.length >
        0
          ? improvements
          : [
              "Continue professional development",
            ],

      riskLevel,

      trend,

      insights,

      avgScore:
        Math.round(
          avgScore
        ),

      scoreSpread,
    };
  };