import React from "react";

const SectionHeader = ({
  title,
  subtitle,
}) => {
  return (
    <div className="section-header">
      <div>
        <h2>{title}</h2>

        <p>{subtitle}</p>
      </div>
    </div>
  );
};

export default SectionHeader;