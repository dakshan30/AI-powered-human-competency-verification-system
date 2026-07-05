import React from "react";

import {
  FaLaptopCode,
  FaComments,
  FaUserCheck,
  FaBrain,
  FaArrowUp,
} from "react-icons/fa";

import "../../styles/results/scoreCard.css";

const ScoreCard = ({
  title,
  score = 0,
}) => {
  const getIcon = () => {
    switch (title) {
      case "Technical":
        return <FaLaptopCode />;

      case "Communication":
        return <FaComments />;

      case "Confidence":
        return <FaUserCheck />;

      case "Problem Solving":
        return <FaBrain />;

      default:
        return <FaLaptopCode />;
    }
  };

  const getStatus = () => {
    if (score >= 85)
      return "Excellent";

    if (score >= 70)
      return "Good";

    if (score >= 55)
      return "Average";

    return "Needs Improvement";
  };

  const getColorClass = () => {
    if (score >= 85)
      return "excellent";

    if (score >= 70)
      return "good";

    if (score >= 55)
      return "average";

    return "poor";
  };

  return (
    <div
      className={`score-card ${getColorClass()}`}
    >
      {/* Header */}

      <div className="score-card-header">

        <div className="score-icon">

          {getIcon()}

        </div>

        <div className="score-title-group">

          <span className="score-title">

            {title}

          </span>

          <span className="score-status">

            {getStatus()}

          </span>

        </div>

      </div>

      {/* Score */}

      <div className="score-body">

        <h2 className="score-value">

          {score}

          <span>%</span>

        </h2>

      </div>

      {/* Progress */}

      <div className="progress-wrapper">

        <div className="progress-track">

          <div
            className="progress-fill"
            style={{
              width: `${score}%`,
            }}
          />

        </div>

      </div>

      {/* Footer */}

      <div className="score-footer">

        <div className="score-trend">

          <FaArrowUp />

          AI Evaluated

        </div>

        <div className="score-label">

          Competency

        </div>

      </div>

    </div>
  );
};

export default ScoreCard;