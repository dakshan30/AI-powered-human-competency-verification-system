import React from "react";

import {
  downloadReport,
} from "../../services/reportService";

const ReportDownloadButton =
  ({
    interviewId,
  }) => {
    const handleDownload =
      async () => {
        try {
          await downloadReport(
            interviewId
          );
        } catch (error) {
          console.log(error);
        }
      };

    return (
      <button
        className="upload-btn"
        onClick={
          handleDownload
        }
      >
        Download Report
      </button>
    );
  };

export default ReportDownloadButton;