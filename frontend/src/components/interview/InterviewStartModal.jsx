import React from "react";

import "./InterviewStartModal.css";

const InterviewStartModal = ({
  onStart,
}) => {
  return (
    <div className="interview-modal-overlay">
      <div className="interview-modal-card">
        <div className="modal-badge">
          Enterprise AI Assessment
        </div>

        <h1>
          Ready To Begin Your Interview?
        </h1>

        <p>
          This interview session uses
          AI-powered monitoring,
          fullscreen protection,
          tab-switch tracking,
          and integrity detection.
        </p>

        <div className="rules-container">
          <div className="rule-item">
            ✅ Camera access must
            remain enabled
          </div>

          <div className="rule-item">
            ✅ Fullscreen mode is
            mandatory
          </div>

          <div className="rule-item">
            ⚠ Exiting fullscreen
            will trigger fraud
            detection
          </div>

          <div className="rule-item">
            ⚠ Tab switching is
            monitored
          </div>

          <div className="rule-item">
            ⚠ Multiple violations
            may terminate the
            interview
          </div>
        </div>

        <button
          className="start-interview-btn"
          onClick={onStart}
        >
          Continue & Start Test
        </button>
      </div>
    </div>
  );
};

export default InterviewStartModal;