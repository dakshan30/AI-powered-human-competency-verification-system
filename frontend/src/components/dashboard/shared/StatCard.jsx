import React from "react";

import GlassCard from "./GlassCard";

const StatCard = ({
  title,
  value,
  icon,
  growth,
}) => {
  return (
    <GlassCard className="stat-card">
      <div className="stat-top">
        <div className="stat-icon">
          {icon}
        </div>

        <span className="stat-growth">
          {growth}
        </span>
      </div>

      <div className="stat-bottom">
        <h3>{value}</h3>

        <p>{title}</p>
      </div>
    </GlassCard>
  );
};

export default StatCard;