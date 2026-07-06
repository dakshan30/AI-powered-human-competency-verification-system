const path =
  require("path");

const Interview =
  require("../models/Interview");

const {
  buildCandidateReport,
} = require("../services/candidateReportService");

const {
  generatePDFReport,
} = require("../services/pdfReportService");

/*
====================================
LIST REPORTS
====================================
*/

exports.getReports =
  async (req, res) => {
    try {
      if (
        req.user?.role !==
        "admin"
      ) {
        return res
          .status(403)
          .json({
            success: false,
            message:
              "Admin access required",
          });
      }

      const search =
        (
          req.query.search || ""
        ).trim();

      const recommendation =
        (
          req.query.recommendation ||
          "all"
        ).trim();

      const status =
        (
          req.query.status || "all"
        ).trim();

      const page =
        Math.max(
          Number.parseInt(
            req.query.page,
            10
          ) || 1,
          1
        );

      const limit =
        Math.min(
          Math.max(
            Number.parseInt(
              req.query.limit,
              10
            ) || 10,
            1
          ),
          100
        );

      const skip =
        (page - 1) * limit;

      const pipeline = [
        {
          $match: {
            status:
              "completed",
          },
        },
        {
          $lookup: {
            from: "users",
            localField:
              "candidate",
            foreignField:
              "_id",
            as: "candidate",
          },
        },
        {
          $unwind: {
            path:
              "$candidate",
            preserveNullAndEmptyArrays:
              true,
          },
        },
        {
          $lookup: {
            from: "resumes",
            localField:
              "resume",
            foreignField:
              "_id",
            as: "resume",
          },
        },
        {
          $unwind: {
            path: "$resume",
            preserveNullAndEmptyArrays:
              true,
          },
        },
        {
          $addFields: {
            candidateName: {
              $ifNull: [
                "$candidate.name",
                "Unknown Candidate",
              ],
            },
            candidateEmail: {
              $ifNull: [
                "$candidate.email",
                "",
              ],
            },
            competency: {
              $ifNull: [
                "$overallScores.competency",
                0,
              ],
            },
            atsScore: {
              $ifNull: [
                "$resume.atsScore",
                0,
              ],
            },
            recommendation: {
              $ifNull: [
                "$report.recommendation",
                "HOLD",
              ],
            },
            trustScore: {
              $ifNull: [
                "$report.trustScore",
                100,
              ],
            },
            reportStatus: {
              $ifNull: [
                "$decision.status",
                "$status",
              ],
            },
          },
        },
      ];

      if (search) {
        pipeline.push({
          $match: {
            $or: [
              {
                candidateName: {
                  $regex:
                    search,
                  $options:
                    "i",
                },
              },
              {
                candidateEmail: {
                  $regex:
                    search,
                  $options:
                    "i",
                },
              },
            ],
          },
        });
      }

      if (
        recommendation &&
        recommendation.toLowerCase() !==
          "all"
      ) {
        pipeline.push({
          $match: {
            recommendation:
              recommendation.toUpperCase(),
          },
        });
      }

      if (
        status &&
        status.toLowerCase() !==
          "all"
      ) {
        pipeline.push({
          $match: {
            reportStatus:
              status.toLowerCase(),
          },
        });
      }

      pipeline.push({
        $facet: {
          reports: [
            {
              $sort: {
                completedAt:
                  -1,
                createdAt: -1,
              },
            },
            {
              $skip: skip,
            },
            {
              $limit: limit,
            },
            {
              $project: {
                _id: 1,
                candidateName:
                  1,
                candidateEmail:
                  1,
                interviewDate:
                  "$completedAt",
                competency:
                  {
                    $round: [
                      "$competency",
                      1,
                    ],
                  },
                atsScore: {
                  $round: [
                    "$atsScore",
                    1,
                  ],
                },
                recommendation:
                  1,
                trustScore: {
                  $round: [
                    "$trustScore",
                    1,
                  ],
                },
                status:
                  "$reportStatus",
              },
            },
          ],
          totalCount: [
            {
              $count:
                "count",
            },
          ],
        },
      });

      const [
        reportResult,
      ] = await Interview.aggregate(
        pipeline
      );

      const reports =
        reportResult?.reports ||
        [];

      const totalRecords =
        reportResult?.totalCount?.[0]
          ?.count || 0;

      const totalPages =
        totalRecords === 0
          ? 0
          : Math.ceil(
              totalRecords /
                limit
            );

      return res
        .status(200)
        .json({
          success: true,
          message:
            "Reports fetched successfully",
          data: {
            reports,
            pagination: {
              page,
              limit,
              totalRecords,
              totalPages,
              hasNextPage:
                page <
                totalPages,
              hasPreviousPage:
                page > 1,
            },
            filters: {
              search,
              recommendation:
                recommendation.toLowerCase(),
              status:
                status.toLowerCase(),
            },
          },
        });
    } catch (error) {
      console.log(
        "Get Reports Error:",
        error
      );

      return res
        .status(500)
        .json({
          success: false,
          message:
            "Failed to fetch reports",
        });
    }
  };

/*
====================================
GENERATE REPORT
====================================
*/

exports.generateReport =
  async (req, res) => {
    try {
      /*
      INTERVIEW
      */

      const interview =
        await Interview.findById(
          req.params.id
        );

      if (!interview) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              "Interview not found",
          });
      }

      /*
      REPORT DATA
      */

      const report =
        buildCandidateReport(
          interview
        );

      /*
      PDF
      */

      const filePath =
        await generatePDFReport(
          report,

          `report-${interview._id}`
        );

      /*
      DOWNLOAD
      */

      return res.download(
        path.resolve(
          filePath
        )
      );
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,

        message:
          "Report generation failed",
      });
    }
  };
