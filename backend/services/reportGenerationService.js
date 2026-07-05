/*
====================================
RECOMMENDATION
====================================
*/

const generateRecommendation =
  (competency) => {

    if (competency >= 85) {
      return "STRONG_HIRE";
    }

    if (competency >= 70) {
      return "HIRE";
    }

    if (competency >= 55) {
      return "HOLD";
    }

    return "REJECT";
  };

/*
====================================
TRUST SCORE
====================================
*/

const calculateTrustScore =
  (interview) => {

    let score = 100;

    score -=
      (interview.warnings || 0) *
      5;

    score -=
      (
        interview.fullscreenViolations ||
        0
      ) * 10;

    score -=
      (
        interview.tabSwitches ||
        0
      ) * 5;

    score -=
      (
        interview.suspiciousActivityScore ||
        0
      ) * 2;

    return Math.max(
      0,
      Math.round(score)
    );
  };

/*
====================================
STRENGTH SUMMARY
====================================
*/

const extractStrengths =
  (answers) => {

    const strengths =
      answers.flatMap(
        (answer) =>
          answer?.evaluation
            ?.strengths || []
      );

    return [
      ...new Set(strengths),
    ];
  };

/*
====================================
WEAKNESS SUMMARY
====================================
*/

const extractWeaknesses =
  (answers) => {

    const weaknesses =
      answers.flatMap(
        (answer) =>
          answer?.evaluation
            ?.weaknesses || []
      );

    return [
      ...new Set(
        weaknesses
      ),
    ];
  };

/*
====================================
IMPROVEMENT PLAN
====================================
*/

const buildImprovementPlan =
  (scores) => {

    const plan = [];

    if (
      scores.technical < 70
    ) {
      plan.push(
        "Practice advanced coding problems and system design."
      );
    }

    if (
      scores.communication <
      70
    ) {
      plan.push(
        "Improve communication through mock interviews."
      );
    }

    if (
      scores.confidence < 70
    ) {
      plan.push(
        "Participate in technical discussions regularly."
      );
    }

    if (
      scores.problemSolving <
      70
    ) {
      plan.push(
        "Solve algorithmic challenges consistently."
      );
    }

    return plan;
  };

/*
====================================
RANKING
====================================
*/

const calculateRank =
  (
    competency,
    trustScore
  ) => {

    const score =
      competency * 0.8 +
      trustScore * 0.2;

    if (score >= 90)
      return "Top 1%";

    if (score >= 80)
      return "Top 5%";

    if (score >= 70)
      return "Top 10%";

    if (score >= 60)
      return "Top 25%";

    return "Average";
  };

/*
====================================
GENERATE REPORT
====================================
*/

exports.generateInterviewReport =
  async (
    interview
  ) => {

    const competency =
      interview
        .overallScores
        ?.competency || 0;

    const trustScore =
      calculateTrustScore(
        interview
      );

    return {

      recommendation:
        generateRecommendation(
          competency
        ),

      trustScore,

      candidateRank:
        calculateRank(
          competency,
          trustScore
        ),

      strengthsSummary:
        extractStrengths(
          interview.answers
        ),

      weaknessesSummary:
        extractWeaknesses(
          interview.answers
        ),

      improvementPlan:
        buildImprovementPlan(
          interview
            .overallScores
        ),
    };
  };