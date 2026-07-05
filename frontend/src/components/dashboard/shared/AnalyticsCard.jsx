import React from "react";

import GlassCard from "./GlassCard";

const AnalyticsCard = ({
  title,
  children,
}) => {
  return (
    <GlassCard className="analytics-card">
      <div className="analytics-header">
        <h3>{title}</h3>
      </div>

      <div className="analytics-body">
        {children}
      </div>
    </GlassCard>
  );
};

export default AnalyticsCard;