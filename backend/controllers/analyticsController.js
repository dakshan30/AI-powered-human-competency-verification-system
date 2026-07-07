const NodeCache = require("node-cache");
const Interview = require("../models/Interview");
const { getAggregatedAnalytics } = require("../services/analyticsService");

// Initialize node-cache with 15-minute standard TTL (900 seconds)
const analyticsCache = new NodeCache({
  stdTTL: 900,
  checkperiod: 300
});

/**
 * GET /api/analytics/dashboard
 * Retrieves aggregated dashboard analytics, score distributions, and trends.
 * Implements 15-minute response caching for database query optimization.
 */
exports.getDashboardAnalytics = async (req, res) => {
  try {
    const { startDate, endDate, groupBy = "monthly" } = req.query;

    // Validate parameters
    if (groupBy !== "weekly" && groupBy !== "monthly") {
      return res.status(400).json({
        success: false,
        message: "Invalid groupBy parameter. Must be 'weekly' or 'monthly'.",
        code: "INVALID_GROUP_BY_PARAMETER"
      });
    }

    // Build Cache Key representing filters
    const cacheKey = `analytics:${startDate || ""}:${endDate || ""}:${groupBy}`;

    // Read cache
    const cachedResult = analyticsCache.get(cacheKey);
    if (cachedResult) {
      return res.status(200).json(cachedResult);
    }

    // Fetch from aggregation pipeline
    const analyticsResult = await getAggregatedAnalytics({
      startDate,
      endDate,
      groupBy
    });

    // Write to cache
    analyticsCache.set(cacheKey, analyticsResult);

    return res.status(200).json(analyticsResult);
  } catch (error) {
    console.error("Dashboard Analytics controller error:", error);

    const statusCode = error.code === "ANALYTICS_AGGREGATION_ERROR" ? 400 : 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to load dashboard analytics metrics",
      code: error.code || "DASHBOARD_ANALYTICS_ERROR"
    });
  }
};

/**
 * GET /api/analytics
 * Legacy endpoint handler for basic pre-fetched interview metrics.
 */
exports.getAnalytics = async (req, res) => {
  try {
    const interviews = await Interview.find({ status: "completed" });
    
    // Calculate simple competency averages
    if (interviews.length === 0) {
      return res.status(200).json({
        success: true,
        analytics: {
          averageCompetency: 0,
          averageTechnical: 0,
          averageCommunication: 0,
          averageConfidence: 0,
          averageProblemSolving: 0,
          topSkills: []
        },
        candidateReports: []
      });
    }

    let competencySum = 0;
    let technicalSum = 0;
    let communicationSum = 0;
    let confidenceSum = 0;
    let problemSolvingSum = 0;

    const scores = interviews.map(interview => {
      const comp = interview.competency || interview.overallScores?.competency || 0;
      competencySum += comp;
      technicalSum += interview.technical || interview.overallScores?.technical || 0;
      communicationSum += interview.communication || interview.overallScores?.communication || 0;
      confidenceSum += interview.confidence || interview.overallScores?.confidence || 0;
      problemSolvingSum += interview.problemSolving || interview.overallScores?.problemSolving || 0;
      return comp;
    });

    const total = interviews.length;

    const candidateReports = interviews.map(interview => {
      const comp = interview.competency || interview.overallScores?.competency || 0;
      let benchmark = "Average";
      
      if (scores.length > 1) {
        const sorted = [...scores].sort((a, b) => a - b);
        const rankIndex = sorted.indexOf(comp);
        const percentile = (rankIndex / (sorted.length - 1)) * 100;
        if (percentile >= 75) benchmark = "Above Average";
        if (percentile <= 25) benchmark = "Below Average";
      }

      return {
        interviewId: interview._id,
        candidate: interview.candidate,
        scores: {
          competency: comp,
          technical: interview.technical || interview.overallScores?.technical || 0,
          communication: interview.communication || interview.overallScores?.communication || 0,
          confidence: interview.confidence || interview.overallScores?.confidence || 0,
          problemSolving: interview.problemSolving || interview.overallScores?.problemSolving || 0
        },
        recommendation: interview.recommendation || interview.report?.recommendation || "HOLD",
        benchmark
      };
    });

    return res.status(200).json({
      success: true,
      analytics: {
        averageCompetency: Math.round(competencySum / total),
        averageTechnical: Math.round(technicalSum / total),
        averageCommunication: Math.round(communicationSum / total),
        averageConfidence: Math.round(confidenceSum / total),
        averageProblemSolving: Math.round(problemSolvingSum / total),
        topSkills: []
      },
      candidateReports
    });
  } catch (error) {
    console.error("Legacy Analytics handler error:", error);
    return res.status(500).json({
      success: false,
      message: "Analytics fetch failed",
      code: "ANALYTICS_FETCH_FAILED"
    });
  }
};