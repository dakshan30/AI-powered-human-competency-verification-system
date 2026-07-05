import API from "./api";

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
        `/reports/candidate/${interviewId}`,

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