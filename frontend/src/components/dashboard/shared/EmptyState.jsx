import React from "react";

import {
  FaFolderOpen,
} from "react-icons/fa";

const EmptyState = ({
  title,
  subtitle,
}) => {
  return (
    <div className="empty-state">
      <FaFolderOpen />

      <h3>{title}</h3>

      <p>{subtitle}</p>
    </div>
  );
};

export default EmptyState;