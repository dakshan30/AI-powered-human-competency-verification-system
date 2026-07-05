import React from "react";
import {
  FaCheckCircle,
  FaCalendarAlt,
  FaUserGraduate,
  FaAward,
} from "react-icons/fa";

import "../../styles/results/reportHeader.css";

const ReportHeader = ({
  report,
  competency = 0,
  recommendation,
}) => {

  const candidateName =
    report?.candidate?.name ||
    report?.candidate?.fullName ||
    "Candidate";

  const completedDate =
    report?.completedAt
      ? new Date(report.completedAt).toLocaleString()
      : "Interview Completed";

  /*
  =====================================
  HANDLE STRING OR OBJECT RECOMMENDATION
  =====================================
  */

  let recommendationText = "PENDING";
  let recommendationClass = "pending";

  if (typeof recommendation === "string") {

    recommendationText = recommendation;
    recommendationClass = recommendation.toLowerCase().replace(/\s+/g, "-");

  } else if (
    recommendation &&
    typeof recommendation === "object"
  ) {

    recommendationText =
      recommendation.title ||
      recommendation.status ||
      recommendation.label ||
      "PENDING";

    recommendationClass = recommendationText
      .toLowerCase()
      .replace(/\s+/g, "-");

  }

  return (

    <section className="report-header">

      <div className="report-overlay"></div>

      <div className="report-left">

        <div className="report-icon">

          <FaAward />

        </div>

        <div>

          <h1>

            AI Assessment Report

          </h1>

          <p>

            Generated using the Enterprise AI Competency Verification Engine

          </p>

        </div>

      </div>

      <div className="report-right">

        <div className="candidate-card">

          <FaUserGraduate />

          <div>

            <span>

              Candidate

            </span>

            <h3>

              {candidateName}

            </h3>

          </div>

        </div>

        <div className="candidate-card">

          <FaCalendarAlt />

          <div>

            <span>

              Completed

            </span>

            <h3>

              {completedDate}

            </h3>

          </div>

        </div>

      </div>

      <div className="hero-bottom">

        <div className="competency-box">

          <span>

            Overall Competency

          </span>

          <h2>

            {competency}%

          </h2>

        </div>

        <div
          className={`recommendation-badge ${recommendationClass}`}
        >

          <FaCheckCircle />

          <span>

            {recommendationText}

          </span>

        </div>

      </div>

    </section>

  );

};

export default ReportHeader; 