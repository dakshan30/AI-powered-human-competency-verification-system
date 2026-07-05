/*
====================================
CALCULATE SCORES
====================================
*/

exports.calculateCompetencyScores =
  (answers) => {
    const totals = {
      technical: 0,

      communication: 0,

      confidence: 0,

      problemSolving: 0,

      competency: 0,
    };

    answers.forEach(
      (answer) => {
        totals.technical +=
          answer.evaluation
            .technicalScore;

        totals.communication +=
          answer.evaluation
            .communicationScore;

        totals.confidence +=
          answer.evaluation
            .confidenceScore;

        totals.problemSolving +=
          answer.evaluation
            .problemSolvingScore;

        totals.competency +=
          answer.evaluation
            .overallScore;
      }
    );

    const total =
      answers.length || 1;

    return {
      technical:
        Math.round(
          totals.technical /
            total
        ),

      communication:
        Math.round(
          totals.communication /
            total
        ),

      confidence:
        Math.round(
          totals.confidence /
            total
        ),

      problemSolving:
        Math.round(
          totals.problemSolving /
            total
        ),

      competency:
        Math.round(
          totals.competency /
            total
        ),
    };
  };