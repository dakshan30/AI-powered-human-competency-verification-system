import React from "react";

import {
  FaShieldAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaExpand,
  FaExchangeAlt,
  FaCamera,
  FaMicrophone,
  FaUserShield,
} from "react-icons/fa";

import "../../styles/results/integrity.css";

const IntegrityReport = ({
  trustScore = 100,
  warnings = 0,
  tabSwitches = 0,
  fullscreenViolations = 0,
  cameraStatus = true,
  microphoneStatus = true,
}) => {

  const getIntegrityStatus = () => {

    if (trustScore >= 90) {
      return {
        label: "Trusted",
        className: "excellent",
      };
    }

    if (trustScore >= 75) {
      return {
        label: "Low Risk",
        className: "good",
      };
    }

    if (trustScore >= 55) {
      return {
        label: "Review Required",
        className: "warning",
      };
    }

    return {
      label: "High Risk",
      className: "danger",
    };

  };

  const integrity = getIntegrityStatus();

  const metrics = [

    {
      title: "Warnings",
      value: warnings,
      icon: <FaExclamationTriangle />,
      type: warnings === 0 ? "good" : "warning",
    },

    {
      title: "Tab Switches",
      value: tabSwitches,
      icon: <FaExchangeAlt />,
      type: tabSwitches === 0 ? "good" : "warning",
    },

    {
      title: "Fullscreen Exit",
      value: fullscreenViolations,
      icon: <FaExpand />,
      type: fullscreenViolations === 0 ? "good" : "danger",
    },

    {
      title: "Camera",
      value: cameraStatus ? "Active" : "Inactive",
      icon: <FaCamera />,
      type: cameraStatus ? "good" : "danger",
    },

    {
      title: "Microphone",
      value: microphoneStatus ? "Active" : "Inactive",
      icon: <FaMicrophone />,
      type: microphoneStatus ? "good" : "danger",
    },

  ];

  return (

    <section className="integrity-report">

      <div className="integrity-header">

        <div className="integrity-title">

          <FaShieldAlt />

          <div>

            <h2>

              Assessment Integrity Report

            </h2>

            <p>

              AI monitored interview security
              and proctoring summary.

            </p>

          </div>

        </div>

        <div className={`trust-score ${integrity.className}`}>

          <div className="trust-circle">

            <h1>

              {trustScore}

            </h1>

            <span>%</span>

          </div>

          <div className="trust-status">

            <FaUserShield />

            <span>

              {integrity.label}

            </span>

          </div>

        </div>

      </div>

      <div className="integrity-grid">

        {

          metrics.map(
            (
              item,
              index
            ) => (

              <div
                key={index}
                className={`integrity-card ${item.type}`}
              >

                <div className="metric-icon">

                  {item.icon}

                </div>

                <h4>

                  {item.title}

                </h4>

                <h2>

                  {item.value}

                </h2>

              </div>

            )
          )

        }

      </div>

      <div className="integrity-summary">

        <div className="summary-header">

          <FaCheckCircle />

          Overall Assessment

        </div>

        <p>

          {

            trustScore >= 90
              ? "The assessment maintained excellent integrity throughout the interview. No suspicious activity requiring recruiter attention was detected."

              : trustScore >= 75
              ? "Minor integrity events were detected. Overall interview reliability remains acceptable."

              : trustScore >= 55
              ? "Several integrity events were detected. Recruiters should manually review the interview before making a hiring decision."

              : "Significant integrity violations were detected. Recruiter verification is strongly recommended before proceeding."

          }

        </p>

      </div>

    </section>

  );

};

export default IntegrityReport;