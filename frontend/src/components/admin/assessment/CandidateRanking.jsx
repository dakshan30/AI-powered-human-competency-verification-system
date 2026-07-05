import React from "react";

const CandidateRanking = ({
  competency,
  trustScore,
}) => {
  const rankingScore =
    competency * 0.8 +
    trustScore * 0.2;

  return (
    <div className="ranking-card">
      <h2>
        Candidate Ranking
      </h2>

      <h1>
        {rankingScore.toFixed(
          1
        )}
      </h1>

      <p>
        Enterprise Ranking Score
      </p>
    </div>
  );
};

export default CandidateRanking;