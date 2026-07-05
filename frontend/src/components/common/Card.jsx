import React from "react";
import "../../styles/components.css";

const Card = ({ children, className = "" }) => {
  return <div className={`glass-card ${className}`}>{children}</div>;
};

export default Card;