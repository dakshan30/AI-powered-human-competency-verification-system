export const calculateTrustScore =
  ({
    warnings = 0,
    fullscreenViolations = 0,
    tabSwitches = 0,
  }) => {

    let score = 100;

    score -= warnings * 5;

    score -=
      fullscreenViolations * 10;

    score -=
      tabSwitches * 5;

    return Math.max(score, 0);
  };