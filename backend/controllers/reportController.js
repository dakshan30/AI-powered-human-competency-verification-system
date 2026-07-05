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