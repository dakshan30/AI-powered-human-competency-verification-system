/*
====================================
REPORT ARCHIVING SERVICE
====================================
*/

const fs =
  require("fs");

const path =
  require("path");

const crypto =
  require("crypto");

const Interview =
  require("../models/Interview");

/*
====================================
ARCHIVE REPORT
====================================
*/

exports.archiveReport =
  async (
    reportId,
    reportData = null
  ) => {
    try {
      const archiveDir =
        path.join(
          __dirname,
          "../archives"
        );

      if (
        !fs.existsSync(
          archiveDir
        )
      ) {
        fs.mkdirSync(
          archiveDir,
          {
            recursive:
              true,
          }
        );
      }

      // Get full report if not provided
      let fullReport =
        reportData;

      if (!fullReport) {
        const interview =
          await Interview.findById(
            reportId
          );

        if (interview) {
          fullReport = {
            _id: interview._id,
            candidateName:
              interview.candidateName,
            candidateEmail:
              interview.candidateEmail,
            interviewDate:
              interview.interviewDate,
            competency:
              interview.competency,
            atsScore:
              interview.atsScore,
            trustScore:
              interview.trustScore,
            recommendation:
              interview.recommendation,
            status:
              interview.status,
            report:
              interview.report,
          };
        }
      }

      const metadata = {
        originalReportId:
          reportId,
        archivedAt:
          new Date()
            .toISOString(),
        archivedBy: "system",
        status: "archived",
        reportData:
          fullReport,
        hash: crypto
          .createHash(
            "sha256"
          )
          .update(
            JSON.stringify(
              fullReport
            )
          )
          .digest(
            "hex"
          ),
      };

      const archiveFile =
        path.join(
          archiveDir,
          `${reportId}-archive.json`
        );

      fs.writeFileSync(
        archiveFile,
        JSON.stringify(
          metadata,
          null,
          2
        )
      );

      // Also update database
      await Interview.updateOne(
        { _id: reportId },
        {
          "report.archived":
            true,
          "report.archivedAt":
            new Date(),
        }
      );

      return true;
    } catch (
      error
    ) {
      console.error(
        "Archive error:",
        error
      );

      return false;
    }
  };

/*
====================================
CHECK IF ARCHIVED
====================================
*/

exports.isReportArchived =
  (reportId) => {
    try {
      const archiveDir =
        path.join(
          __dirname,
          "../archives"
        );

      const archiveFile =
        path.join(
          archiveDir,
          `${reportId}-archive.json`
        );

      return fs.existsSync(
        archiveFile
      );
    } catch (
      error
    ) {
      return false;
    }
  };

/*
====================================
RESTORE REPORT
====================================
*/

exports.restoreReport =
  async (reportId) => {
    try {
      const archiveDir =
        path.join(
          __dirname,
          "../archives"
        );

      const archiveFile =
        path.join(
          archiveDir,
          `${reportId}-archive.json`
        );

      if (
        fs.existsSync(
          archiveFile
        )
      ) {
        fs.unlinkSync(
          archiveFile
        );
      }

      return true;
    } catch (
      error
    ) {
      console.error(
        "Restore error:",
        error
      );

      return false;
    }
  };

/*
====================================
GET ARCHIVED REPORTS
====================================
*/

exports.getArchivedReports =
  async () => {
    try {
      const archiveDir =
        path.join(
          __dirname,
          "../archives"
        );

      if (
        !fs.existsSync(
          archiveDir
        )
      ) {
        return [];
      }

      const files =
        fs.readdirSync(
          archiveDir
        );

      const archived =
        files.map((file) => {
          const filePath =
            path.join(
              archiveDir,
              file
            );

          const content =
            fs.readFileSync(
              filePath,
              "utf8"
            );

          return JSON.parse(
            content
          );
        });

      return archived;
    } catch (
      error
    ) {
      console.error(
        "Get archived reports error:",
        error
      );

      return [];
    }
  };

/*
====================================
GET ARCHIVE STATS
====================================
*/

exports.getArchiveStats =
  async () => {
    try {
      const archiveDir =
        path.join(
          __dirname,
          "../archives"
        );

      if (
        !fs.existsSync(
          archiveDir
        )
      ) {
        return {
          totalArchived:
            0,
          archiveSize: 0,
          archivedReports: [],
        };
      }

      const archived =
        await exports
          .getArchivedReports();

      let totalSize = 0;

      const files =
        fs.readdirSync(
          archiveDir
        );

      files.forEach(
        (file) => {
          const filePath =
            path.join(
              archiveDir,
              file
            );

          const stats =
            fs.statSync(
              filePath
            );

          totalSize +=
            stats.size;
        }
      );

      return {
        totalArchived:
          files.length,
        archiveSize:
          totalSize,
        archivedReports:
          archived.map(
            (a) => ({
              _id: a.originalReportId,
              candidateName:
                a.reportData
                  ?.candidateName,
              candidateEmail:
                a.reportData
                  ?.candidateEmail,
              archivedAt:
                a.archivedAt,
              status:
                a.status,
            })
          ),
      };
    } catch (
      error
    ) {
      console.error(
        "Get archive stats error:",
        error
      );

      return {
        totalArchived:
          0,
        archiveSize: 0,
        archivedReports: [],
      };
    }
  };

/*
====================================
BULK ARCHIVE OLD REPORTS
====================================
*/

exports.bulkArchiveOldReports =
  async (
    reportIds,
    daysOld = 90
  ) => {
    try {
      let archivedCount =
        0;

      for (const id of reportIds) {
        await exports.archiveReport(
          id
        );

        archivedCount++;
      }

      return {
        success: true,
        archivedCount,
      };
    } catch (
      error
    ) {
      console.error(
        "Bulk archive error:",
        error
      );

      return {
        success: false,
        error:
          error.message,
      };
    }
  };
