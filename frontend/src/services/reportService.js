import API from "./api";

/*
====================================
GET REPORTS
====================================
*/

export const getReports =
  async (params = {}) => {
    const response =
      await API.get(
        "/reports",
        {
          params,
        }
      );

    return response.data;
  };

/*
====================================
DOWNLOAD REPORT
====================================
*/

export const downloadReport =
  async (
    interviewId
  ) => {
    const response =
      await API.get(
        `/reports/${interviewId}`,

        {
          responseType:
            "blob",
        }
      );

    /*
    DOWNLOAD
    */

    const url =
      window.URL.createObjectURL(
        new Blob([
          response.data,
        ])
      );

    const link =
      document.createElement(
        "a"
      );

    link.href = url;

    link.setAttribute(
      "download",

      `candidate-report-${interviewId}.pdf`
    );

    document.body.appendChild(
      link
    );

    link.click();

    link.remove();
  };

/*
====================================
ARCHIVE REPORT
====================================
*/

export const archiveReport =
  async (
    interviewId
  ) => {
    const response =
      await API.put(
        `/reports/${interviewId}/archive`
      );

    return response.data;
  };

/*
====================================
DELETE REPORT
====================================
*/

export const deleteReport =
  async (
    interviewId
  ) => {
    const response =
      await API.delete(
        `/reports/${interviewId}`
      );

    return response.data;
  };

/*
====================================
EXPORT REPORTS
====================================
*/

export const exportReports =
  async (
    format = "csv"
  ) => {
    const response =
      await API.get(
        "/reports/export",
        {
          params: {
            format,
          },
          responseType:
            "blob",
        }
      );

    /*
    DOWNLOAD
    */

    const url =
      window.URL.createObjectURL(
        new Blob([
          response.data,
        ])
      );

    const link =
      document.createElement(
        "a"
      );

    link.href = url;

    const fileName =
      format ===
      "xlsx"
        ? "reports.xlsx"
        : "reports.csv";

    link.setAttribute(
      "download",
      fileName
    );

    document.body.appendChild(
      link
    );

    link.click();

    link.remove();
  };

/*
====================================
GET ARCHIVE STATS
====================================
*/

export const getArchiveStats =
  async () => {
    const response =
      await API.get(
        "/reports/archive/stats"
      );

    return response.data;
  };
