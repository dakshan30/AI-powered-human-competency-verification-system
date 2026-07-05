import React from "react";

import {
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

import "../../styles/results/strengthWeaknessPanel.css";

const StrengthWeaknessPanel = ({
  answers = [],
}) => {

  const strengths = [];

  const weaknesses = [];

  answers.forEach((answer) => {

    answer?.evaluation?.strengths?.forEach(
      (item) => {

        if (
          item &&
          !strengths.includes(item)
        ) {
          strengths.push(item);
        }

      }
    );

    answer?.evaluation?.weaknesses?.forEach(
      (item) => {

        if (
          item &&
          !weaknesses.includes(item)
        ) {
          weaknesses.push(item);
        }

      }
    );

  });

  return (

    <section className="sw-section">

      {/* Strengths */}

      <div className="sw-card strengths">

        <div className="sw-header">

          <div className="sw-icon">

            <FaCheckCircle />

          </div>

          <div>

            <h2>
              Key Strengths
            </h2>

            <p>
              Areas where the candidate
              demonstrated strong
              competency.
            </p>

          </div>

        </div>

        <div className="sw-list">

          {
            strengths.length > 0 ?

            strengths.map(
              (
                strength,
                index
              ) => (

                <div
                  key={index}
                  className="sw-item"
                >

                  <FaCheckCircle />

                  <span>

                    {strength}

                  </span>

                </div>

              )
            )

            :

            <div className="empty-message">

              No strengths available.

            </div>

          }

        </div>

      </div>

      {/* Weaknesses */}

      <div className="sw-card weaknesses">

        <div className="sw-header">

          <div className="sw-icon">

            <FaExclamationTriangle />

          </div>

          <div>

            <h2>
              Improvement Areas
            </h2>

            <p>
              Areas that require
              additional practice.
            </p>

          </div>

        </div>

        <div className="sw-list">

          {
            weaknesses.length > 0 ?

            weaknesses.map(
              (
                weakness,
                index
              ) => (

                <div
                  key={index}
                  className="sw-item"
                >

                  <FaExclamationTriangle />

                  <span>

                    {weakness}

                  </span>

                </div>

              )
            )

            :

            <div className="empty-message">

              No weaknesses detected.

            </div>

          }

        </div>

      </div>

    </section>

  );

};

export default StrengthWeaknessPanel;