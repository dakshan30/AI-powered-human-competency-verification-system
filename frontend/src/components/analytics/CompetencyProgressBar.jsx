import React from "react";

const CompetencyProgressBar =
  ({
    label,
    value,
  }) => {
    return (
      <div className="progress-wrapper">
        <div className="progress-header">
          <span>{label}</span>

          <span>{value}%</span>
        </div>

        <div className="progress-track">
          <div
            className="progress-fill"
            style={{
              width: `${value}%`,
            }}
          />
        </div>
      </div>
    );
  };

export default CompetencyProgressBar;