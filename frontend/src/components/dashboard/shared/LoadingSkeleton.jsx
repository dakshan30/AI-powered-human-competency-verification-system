import React from "react";

const LoadingSkeleton = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-line large" />

      <div className="skeleton-line medium" />

      <div className="skeleton-line small" />
    </div>
  );
};

export default LoadingSkeleton;