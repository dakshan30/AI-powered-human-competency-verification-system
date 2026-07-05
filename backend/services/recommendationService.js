/*
====================================
AI HIRING RECOMMENDATION
====================================
*/

exports.generateHiringRecommendation =
  (scores) => {
    const competency =
      scores.competency;

    /*
    STRONG
    */

    if (competency >= 85) {
      return {
        recommendation:
          "Strong Hire",

        color: "green",

        reason:
          "Excellent technical and communication competency.",
      };
    }

    /*
    MODERATE
    */

    if (competency >= 70) {
      return {
        recommendation:
          "Consider Hire",

        color: "orange",

        reason:
          "Good competency with minor improvement areas.",
      };
    }

    /*
    WEAK
    */

    return {
      recommendation:
        "Needs Improvement",

      color: "red",

      reason:
        "Significant competency gaps detected.",
    };
  };