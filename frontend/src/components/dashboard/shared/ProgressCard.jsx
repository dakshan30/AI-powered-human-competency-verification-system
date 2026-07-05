import React from "react";

import GlassCard from "./GlassCard";

const ProgressCard = ({
  title,
  progress,
  subtitle,
}) => {
  return (
    <GlassCard className="progress-card">
      <div className="progress-top">
        <h3>{title}</h3>

        <span>{progress}%</span>
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      <p>{subtitle}</p>
    </GlassCard>
  );
};

export default ProgressCard;