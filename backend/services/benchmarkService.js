/*
====================================
BENCHMARK CANDIDATE
====================================
*/

exports.generateBenchmark =
  (
    candidateScores,
    allScores
  ) => {
    /*
    AVG
    */

    const average =
      allScores.reduce(
        (acc, score) =>
          acc + score,
        0
      ) / allScores.length;

    /*
    PERCENTILE
    */

    const percentile =
      (
        allScores.filter(
          (score) =>
            score <
            candidateScores
        ).length /
        allScores.length
      ) * 100;

    return {
      average:
        Math.round(average),

      percentile:
        Math.round(
          percentile
        ),
    };
  };