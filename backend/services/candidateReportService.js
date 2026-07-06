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
    const candidate =
      interview.candidate || {};

    const resume =
      interview.resume || {};

    const report =
      interview.report || {};

    const recommendationKey =
      report.recommendation ||
      "HOLD";

    const recommendationDetails =
      generateHiringRecommendation(
        interview.overallScores || {
          competency: 0,
        }
      );

    const analytics =
      generateReportAnalytics(
        interview
      );

    return {
      interviewId:
        interview._id,

      candidate: {
        id:
          candidate._id ||
          interview.candidate,
        name:
          candidate.name ||
          resume?.parsedData
            ?.name ||
          "Candidate",
        email:
          candidate.email ||
          resume?.parsedData
            ?.email ||
          "N/A",
      },

      resume: {
        atsScore:
          resume.atsScore || 0,
        detectedRole:
          resume?.parsedData
            ?.detectedRole ||
          "N/A",
        experienceLevel:
          resume?.parsedData
            ?.experienceLevel ||
          "N/A",
        skills:
          resume?.parsedData
            ?.skills || [],
      },

      scores:
        interview.overallScores ||
        {},

      recommendation: {
        key:
          recommendationKey,
        label:
          recommendationKey
            .split("_")
            .join(" "),
        reason:
          recommendationDetails.reason,
        color:
          recommendationDetails.color,
      },

      trustScore:
        report.trustScore || 0,

      candidateRank:
        report.candidateRank ||
        "N/A",

      interviewMeta: {
        status:
          interview.status,
        startedAt:
          interview.startedAt,
        completedAt:
          interview.completedAt,
        duration:
          interview.interviewDuration ||
          0,
      },

      integrity: {
        warnings:
          interview.warnings || 0,
        tabSwitches:
          interview.tabSwitches || 0,
        fullscreenViolations:
          interview.fullscreenViolations ||
          0,
        suspiciousActivityScore:
          interview.suspiciousActivityScore ||
          0,
        flags:
          interview.integrityFlags ||
          [],
      },

      analytics,

      strengthsSummary:
        report.strengthsSummary ||
        analytics.strengths ||
        [],

      weaknessesSummary:
        report.weaknessesSummary ||
        analytics.improvements ||
        [],

      improvementPlan:
        report.improvementPlan ||
        [],

      answers:
        (interview.answers ||
          []).map((answer) => ({
          questionId:
            answer.questionId,
          question:
            answer.question,
          answer:
            answer.answer,
          skill:
            answer.skill ||
            "General",
          difficulty:
            answer.difficulty ||
            "medium",
          evaluation:
            answer.evaluation || {},
        })),
    };
  };
