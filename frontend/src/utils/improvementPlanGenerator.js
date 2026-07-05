export const generateImprovementPlan =
  (scores) => {

    const plan = [];

    if (
      scores.technical < 70
    ) {
      plan.push(
        "Practice advanced coding challenges and system design problems."
      );
    }

    if (
      scores.communication <
      70
    ) {
      plan.push(
        "Improve communication through mock interviews and presentations."
      );
    }

    if (
      scores.confidence < 70
    ) {
      plan.push(
        "Participate in technical discussions and mock interview sessions."
      );
    }

    if (
      scores.problemSolving <
      70
    ) {
      plan.push(
        "Solve LeetCode and HackerRank problems daily."
      );
    }

    return plan;
  };