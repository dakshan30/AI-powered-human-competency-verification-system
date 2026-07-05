/*
====================================
CALCULATE RISK SCORE
====================================
*/

exports.calculateRiskScore =
  (violations) => {
    let score = 0;

    violations.forEach(
      (violation) => {
        score +=
          violation.severity;
      }
    );

    /*
    STATUS
    */

    let status = "safe";

    if (score >= 15) {
      status =
        "suspicious";
    } else if (
      score >= 7
    ) {
      status =
        "warning";
    }

    return {
      score,
      status,
    };
  };