import React from "react";

import {
  FaCheckCircle,
  FaUserTie,
  FaInfoCircle,
  FaStar,
} from "react-icons/fa";

import "../../styles/results/recommendation.css";

const RecommendationCard = ({
  recommendation = "HOLD",
  competency = 0,
}) => {

  const recommendationData = {

    STRONG_HIRE: {
      title: "Strong Hire",
      color: "strong-hire",
      description:
        "Outstanding interview performance with excellent competency across all evaluated areas. Candidate is highly recommended for immediate recruitment.",
    },

    HIRE: {
      title: "Hire",
      color: "hire",
      description:
        "Candidate demonstrated good technical ability and communication skills. Suitable for the current role.",
    },

    HOLD: {
      title: "Hold",
      color: "hold",
      description:
        "Candidate meets some expectations but requires further evaluation or additional technical assessment.",
    },

    REJECT: {
      title: "Reject",
      color: "reject",
      description:
        "Candidate did not meet the required competency threshold for this position.",
    },

  };

  const current =
    recommendationData[
      recommendation
    ] ||
    recommendationData.HOLD;

  return (

    <div
      className={`recommendation-card ${current.color}`}
    >

      <div className="recommendation-header">

        <div className="recommendation-icon">

          <FaUserTie />

        </div>

        <div>

          <h2>
            AI Recommendation
          </h2>

          <p>
            Final assessment generated
            using AI competency analysis.
          </p>

        </div>

      </div>

      <div className="recommendation-status">

        <FaCheckCircle />

        <span>

          {current.title}

        </span>

      </div>

      <div className="recommendation-score">

        <span>
          Competency Score
        </span>

        <h1>

          {competency}%

        </h1>

      </div>

      <div className="recommendation-description">

        <FaInfoCircle />

        <p>

          {current.description}

        </p>

      </div>

      <div className="recommendation-footer">

        <FaStar />

        <span>

          Enterprise AI Evaluation

        </span>

      </div>

    </div>

  );

};

export default RecommendationCard;