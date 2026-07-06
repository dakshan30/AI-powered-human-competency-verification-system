/*
====================================
REPORT VALIDATION UTILITIES
====================================
*/

/*
VALIDATE REPORT DATA
*/

exports.validateReportData =
  (data) => {
    const errors = [];

    if (
      !data ||
      typeof data !==
        "object"
    ) {
      errors.push(
        "Report data must be an object"
      );
      return errors;
    }

    if (
      !data.candidate ||
      !data.candidate.name
    ) {
      errors.push(
        "Candidate name is required"
      );
    }

    if (
      !data.interviewId
    ) {
      errors.push(
        "Interview ID is required"
      );
    }

    if (
      data.scores &&
      typeof data.scores !==
        "object"
    ) {
      errors.push(
        "Scores must be an object"
      );
    }

    if (
      data.trustScore &&
      (isNaN(
        data.trustScore
      ) ||
        data.trustScore <
          0 ||
        data.trustScore >
          100)
    ) {
      errors.push(
        "Trust score must be between 0 and 100"
      );
    }

    return errors;
  };

/*
VALIDATE FILTERS
*/

exports.validateFilters =
  (filters) => {
    const errors = [];

    if (
      filters.page &&
      (isNaN(filters.page) ||
        filters.page < 1)
    ) {
      errors.push(
        "Page must be a positive number"
      );
    }

    if (
      filters.limit &&
      (isNaN(filters.limit) ||
        filters.limit < 1 ||
        filters.limit > 100)
    ) {
      errors.push(
        "Limit must be between 1 and 100"
      );
    }

    if (
      filters.format &&
      ![
        "csv",
        "xlsx",
      ].includes(
        filters.format
          .toLowerCase()
      )
    ) {
      errors.push(
        "Format must be 'csv' or 'xlsx'"
      );
    }

    return errors;
  };

/*
SANITIZE REPORT DATA
*/

exports.sanitizeReportData =
  (data) => {
    return {
      interviewId:
        data.interviewId
          ? String(
              data.interviewId
            ).trim()
          : null,
      candidate: {
        id:
          data.candidate
            ?.id,
        name:
          data.candidate
            ?.name
            ? String(
                data.candidate
                  .name
              )
                .trim()
                .substring(
                  0,
                  255
                )
            : "N/A",
        email:
          data.candidate
            ?.email
            ? String(
                data.candidate
                  .email
              )
                .toLowerCase()
                .trim()
            : "N/A",
      },
      scores:
        data.scores ||
        {},
      recommendation:
        data
          .recommendation,
      trustScore:
        Math.min(
          100,
          Math.max(
            0,
            Number(
              data.trustScore
            ) || 0
          )
        ),
      resume:
        data.resume ||
        {},
      integrity:
        data.integrity ||
        {},
      analytics:
        data.analytics ||
        {},
      answers:
        data.answers ||
        [],
    };
  };

/*
CHECK REPORT PERMISSIONS
*/

exports.checkReportPermission =
  (
    user,
    report,
    action = "read"
  ) => {
    if (
      !user ||
      !report
    ) {
      return false;
    }

    /*
    ADMIN CAN DO ANYTHING
    */

    if (
      user.role === "admin"
    ) {
      return true;
    }

    /*
    CANDIDATE CAN VIEW OWN REPORTS
    */

    if (
      user.role ===
        "candidate" &&
      action === "read"
    ) {
      return (
        String(
          report.candidate
        ) ===
        String(user._id)
      );
    }

    return false;
  };
