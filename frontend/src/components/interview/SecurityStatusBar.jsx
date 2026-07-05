import React from "react";

const SecurityStatusBar =
  ({
    violations,
  }) => {
    return (
      <div className="security-bar">
        <span>
          Integrity Monitoring
          Active
        </span>

        <span>
          Violations:
          {
            violations.length
          }
        </span>
      </div>
    );
  };

export default SecurityStatusBar;