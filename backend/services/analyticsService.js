const mongoose = require("mongoose");
const Interview = require("../models/Interview");

/**
 * Perform database-level aggregation to retrieve comprehensive candidate metrics,
 * competency/recommendation score distributions, and time-series trends.
 * * @param {Object} options
 * @param {Date|string} [options.startDate] - Filter interviews completed on or after this date.
 * @param {Date|string} [options.endDate] - Filter interviews completed on or before this date.
 * @param {string} [options.groupBy="monthly"] - Time-series trend grouping ("weekly" or "monthly").
 * @returns {Promise<Object>} Aggregated analytics metrics.
 */
exports.getAggregatedAnalytics = async (options = {}) => {
  try {
    const { startDate, endDate, groupBy = "monthly" } = options;

    // 1. Build initial match stage leveraging Phase 1 schema status & index properties
    const matchStage = {
      status: "completed"
    };

    // Use interviewDate as the primary timestamp indicator as per guidelines
    if (startDate || endDate) {
      matchStage.interviewDate = {};
      if (startDate) {
        matchStage.interviewDate.$gte = new Date(startDate);
      }
      if (endDate) {
        matchStage.interviewDate.$lte = new Date(endDate);
      }
    }

    // 2. Build the optimized aggregation pipeline
    const pipeline = [
      { $match: matchStage },
      {
        $facet: {
          // A. Overview metrics mapping strictly to root-level document structures
          overview: [
            {
              $group: {
                _id: null,
                totalInterviews: { $sum: 1 },
                uniqueCandidates: { $addToSet: "$candidateEmail" }, // Fallback tracking for unique candidates via email
                avgCompetency: { $avg: "$competency" },
                avgATS: { $avg: "$atsScore" },
                avgTrustScore: { $avg: "$trustScore" },
                totalHired: {
                  $sum: {
                    $cond: [
                      { $in: ["$recommendation", ["STRONG_HIRE", "HIRE"]] },
                      1,
                      0
                    ]
                  }
                }
              }
            },
            {
              $project: {
                _id: 0,
                totalInterviews: 1,
                totalCandidates: { $size: "$uniqueCandidates" },
                avgCompetency: { $round: [{ $ifNull: ["$avgCompetency", 0] }, 1] },
                avgATS: { $round: [{ $ifNull: ["$avgATS", 0] }, 1] },
                avgTrustScore: { $round: [{ $ifNull: ["$avgTrustScore", 0] }, 1] },
                hiringConversionRate: {
                  $cond: [
                    { $gt: ["$totalInterviews", 0] },
                    { $round: [{ $multiply: [{ $divide: ["$totalHired", "$totalInterviews"] }, 100] }, 1] },
                    0
                  ]
                }
              }
            }
          ],
          // B. Competency score bucket distributions (0-50, 51-70, 71-85, 86-100)
          competencyDistribution: [
            {
              $bucket: {
                groupBy: { $ifNull: ["$competency", 0] },
                boundaries: [0, 51, 71, 86, 101],
                default: "other",
                output: {
                  count: { $sum: 1 }
                }
              }
            }
          ],
          // C. Breakdown of hiring recommendations mapping to root-level configuration
          recommendationDistribution: [
            {
              $group: {
                _id: { $ifNull: ["$recommendation", "HOLD"] },
                count: { $sum: 1 }
              }
            }
          ],
          // D. Time-series trend grouping using interviewDate
          timeSeries: [
            {
              $group: {
                _id: {
                  year: { $year: "$interviewDate" },
                  period: groupBy === "monthly"
                    ? { $month: "$interviewDate" }
                    : { $week: "$interviewDate" }
                },
                avgCompetency: { $avg: "$competency" },
                avgATS: { $avg: "$atsScore" },
                avgTrustScore: { $avg: "$trustScore" },
                count: { $sum: 1 },
                totalHired: {
                  $sum: {
                    $cond: [
                      { $in: ["$recommendation", ["STRONG_HIRE", "HIRE"]] },
                      1,
                      0
                    ]
                  }
                }
              }
            },
            {
              $sort: {
                "_id.year": 1,
                "_id.period": 1
              }
            }
          ]
        }
      }
    ];

    // Execute aggregation
    const aggregationResult = await Interview.aggregate(pipeline);
    const result = aggregationResult[0] || {};

    // 3. Process Overview Metrics
    const overview = (result.overview && result.overview[0]) || {
      totalInterviews: 0,
      totalCandidates: 0,
      avgCompetency: 0,
      avgATS: 0,
      avgTrustScore: 0,
      hiringConversionRate: 0
    };

    // 4. Process Competency Distribution Tiers
    const competencyDistribution = {
      "0-50": 0,
      "51-70": 0,
      "71-85": 0,
      "86-100": 0
    };

    if (result.competencyDistribution) {
      result.competencyDistribution.forEach(bucket => {
        if (bucket._id === 0) competencyDistribution["0-50"] = bucket.count;
        else if (bucket._id === 51) competencyDistribution["51-70"] = bucket.count;
        else if (bucket._id === 71) competencyDistribution["71-85"] = bucket.count;
        else if (bucket._id === 86) competencyDistribution["86-100"] = bucket.count;
      });
    }

    // 5. Process Recommendation Breakdown
    const recommendations = {
      STRONG_HIRE: 0,
      HIRE: 0,
      HOLD: 0,
      REJECT: 0
    };

    if (result.recommendationDistribution) {
      result.recommendationDistribution.forEach(rec => {
        const key = (rec._id || "HOLD").toUpperCase().replace(/[\s\-]/g, "_");
        if (recommendations.hasOwnProperty(key)) {
          recommendations[key] = rec.count;
        }
      });
    }

    // 6. Process Time-Series Trend Mapping
    const timeSeries = (result.timeSeries || []).map(item => {
      let label = "";
      if (groupBy === "monthly") {
        const monthNames = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        const monthStr = monthNames[item._id.period - 1] || `Month ${item._id.period}`;
        label = `${monthStr} ${item._id.year}`;
      } else {
        label = `Week ${item._id.period}, ${item._id.year}`;
      }

      const conversionRate = item.count > 0
        ? Number(((item.totalHired / item.count) * 100).toFixed(1))
        : 0;

      return {
        period: label,
        year: item._id.year,
        rawPeriod: item._id.period,
        averageCompetency: Number((item.avgCompetency || 0).toFixed(1)),
        averageATS: Number((item.avgATS || 0).toFixed(1)),
        averageTrustScore: Number((item.avgTrustScore || 0).toFixed(1)),
        totalInterviews: item.count,
        hiringConversionRate: conversionRate
      };
    });

    // Chronological Sort
    timeSeries.sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.rawPeriod - b.rawPeriod;
    });

    return {
      success: true,
      data: {
        overview: {
          totalInterviews: overview.totalInterviews,
          totalCandidates: overview.totalCandidates,
          averageCompetency: overview.avgCompetency,
          averageATS: overview.avgATS,
          averageTrustScore: overview.avgTrustScore,
          hiringConversionRate: overview.hiringConversionRate
        },
        distributions: {
          competencyTiers: competencyDistribution,
          recommendations
        },
        trends: timeSeries
      }
    };
  } catch (error) {
    console.error("Aggregation error in analyticsService:", error);
    throw {
      success: false,
      message: `Analytics aggregation failed: ${error.message}`,
      code: "ANALYTICS_AGGREGATION_ERROR"
    };
  }
};