import React from "react";

const IntegrityWarningModal =
  ({
    open,

    message,
  }) => {
    if (!open) {
      return null;
    }

    return (
      <div className="integrity-modal">
        <div className="integrity-card">
          <h2>
            Security Warning
          </h2>

          <p>{message}</p>
        </div>
      </div>
    );
  };

export default IntegrityWarningModal;