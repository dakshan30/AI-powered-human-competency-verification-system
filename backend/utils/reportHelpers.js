/*
====================================
REPORT ERROR HANDLER
====================================
*/

const handleReportError =
  (error, context) => {
    const errorMap = {
      ValidationError:
        {
          status: 400,
          message:
            "Invalid report data",
        },
      NotFoundError: {
        status: 404,
        message:
          "Report not found",
      },
      UnauthorizedError:
        {
          status: 403,
          message:
            "Not authorized to access this report",
        },
      FileError: {
        status: 500,
        message:
          "Failed to process file",
      },
    };

    const errorType =
      error.name ||
      error.constructor.name;

    const errorInfo =
      errorMap[errorType] || {
        status: 500,
        message:
          "An error occurred processing the report",
      };

    console.error(
      `[${context}] ${errorType}:`,
      error.message
    );

    return {
      status:
        errorInfo.status,
      message:
        errorInfo.message,
      error:
        process.env.NODE_ENV ===
        "development"
          ? error.message
          : undefined,
    };
  };

/*
====================================
VALIDATE FILE UPLOAD
====================================
*/

const validateFileUpload =
  (file) => {
    const errors = [];

    if (!file) {
      errors.push(
        "File is required"
      );
      return errors;
    }

    const maxSize =
      50 * 1024 * 1024; // 50MB

    if (
      file.size > maxSize
    ) {
      errors.push(
        "File size exceeds 50MB limit"
      );
    }

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
    ];

    if (
      !allowedTypes.includes(
        file.mimetype
      )
    ) {
      errors.push(
        "Invalid file type"
      );
    }

    return errors;
  };

/*
====================================
RETRY MECHANISM
====================================
*/

const withRetry =
  async (
    fn,
    maxRetries = 3,
    delayMs = 1000
  ) => {
    for (
      let i = 0;
      i < maxRetries;
      i++
    ) {
      try {
        return await fn();
      } catch (error) {
        if (
          i === maxRetries - 1
        ) {
          throw error;
        }

        console.warn(
          `Retry ${i + 1}/${maxRetries} after ${delayMs}ms`
        );

        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              delayMs
            )
        );
      }
    }
  };

/*
====================================
SAFE JSON PARSE
====================================
*/

const safeJsonParse =
  (
    jsonString,
    fallback = {}
  ) => {
    try {
      return JSON.parse(
        jsonString
      );
    } catch (error) {
      console.error(
        "JSON parse error:",
        error
      );

      return fallback;
    }
  };

/*
====================================
FORMAT CURRENCY
====================================
*/

const formatCurrency =
  (value) => {
    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
      }
    ).format(value || 0);
  };

/*
====================================
GET SCORE GRADE
====================================
*/

const getScoreGrade =
  (score) => {
    score = Number(score) || 0;

    if (score >= 90)
      return "A+";
    if (score >= 80)
      return "A";
    if (score >= 70)
      return "B";
    if (score >= 60)
      return "C";
    if (score >= 50)
      return "D";

    return "F";
  };

/*
====================================
CALCULATE PERCENTILE
====================================
*/

const calculatePercentile =
  (value, allValues) => {
    if (
      !allValues ||
      allValues.length ===
        0
    ) {
      return 0;
    }

    const lowerCount =
      allValues.filter(
        (v) => v < value
      ).length;

    return Math.round(
      (lowerCount /
        allValues.length) *
      100
    );
  };

/*
====================================
FORMAT DURATION
====================================
*/

const formatDuration =
  (minutes) => {
    if (!minutes)
      return "N/A";

    const hours = Math.floor(
      minutes / 60
    );

    const mins =
      minutes % 60;

    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }

    return `${mins}m`;
  };

module.exports = {
  handleReportError,
  validateFileUpload,
  withRetry,
  safeJsonParse,
  formatCurrency,
  getScoreGrade,
  calculatePercentile,
  formatDuration,
};
