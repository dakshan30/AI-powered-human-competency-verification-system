import React from "react";

const HiringRecommendationCard =
  ({
    recommendation,
  }) => {
    return (
      <div className="glass-card recommendation-card">
        <h3>
          Hiring Recommendation
        </h3>

        <div
          className={`recommendation-badge ${recommendation.color}`}
        >
          {
            recommendation.recommendation
          }
        </div>

        <p>
          {
            recommendation.reason
          }
        </p>
      </div>
    );
  };

export default HiringRecommendationCard;