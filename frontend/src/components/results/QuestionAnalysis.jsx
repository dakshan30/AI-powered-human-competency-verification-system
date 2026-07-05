import React, { useState } from "react";

import {
  FaChevronDown,
  FaChevronUp,
  FaCheckCircle,
  FaTimesCircle,
  FaCommentDots,
  FaChartLine,
} from "react-icons/fa";

import "../../styles/results/questionAnalysis.css";

const QuestionAnalysis = ({
  answers = [],
}) => {

  const [expanded, setExpanded] =
    useState(0);

  const toggleCard = (index) => {

    if (expanded === index) {
      setExpanded(-1);
    } else {
      setExpanded(index);
    }

  };

  return (

    <section className="question-analysis">

      <div className="question-header">

        <div>

          <h2>

            Question Analysis

          </h2>

          <p>

            AI generated evaluation
            for every interview question.

          </p>

        </div>

      </div>

      {

        answers.length === 0 ?

        (

          <div className="empty-analysis">

            No interview responses
            available.

          </div>

        )

        :

        answers.map(

          (
            answer,
            index
          ) => {

            const evaluation =
              answer.evaluation || {};

            return (

              <div
                key={index}
                className="question-card"
              >

                {/* HEADER */}

                <div
                  className="question-top"
                  onClick={() =>
                    toggleCard(index)
                  }
                >

                  <div>

                    <span className="question-number">

                      Question {index + 1}

                    </span>

                    <h3>

                      {
                        answer.question
                      }

                    </h3>

                  </div>

                  <div className="question-score">

                    <div>

                      <span>

                        Score

                      </span>

                      <h2>

                        {

                          evaluation.overallScore ??
                          0

                        }

                        %

                      </h2>

                    </div>

                    {

                      expanded === index ?

                      <FaChevronUp />

                      :

                      <FaChevronDown />

                    }

                  </div>

                </div>

                {

                  expanded === index &&

                  <div className="question-body">

                    {/* Answer */}

                    <div className="analysis-block">

                      <div className="analysis-title">

                        <FaCommentDots />

                        Candidate Answer

                      </div>

                      <p>

                        {

                          answer.answer ||
                          "No response available."

                        }

                      </p>

                    </div>

                    {/* AI Feedback */}

                    <div className="analysis-block">

                      <div className="analysis-title">

                        <FaChartLine />

                        AI Feedback

                      </div>

                      <p>

                        {

                          evaluation.feedback ||
                          "No feedback available."

                        }

                      </p>

                    </div>

                    {/* Strengths */}

                    <div className="feedback-grid">

                      <div className="feedback-card strengths">

                        <h4>

                          Strengths

                        </h4>

                        {

                          evaluation.strengths?.length ?

                          evaluation.strengths.map(

                            (
                              item,
                              i
                            ) => (

                              <div
                                key={i}
                                className="feedback-item"
                              >

                                <FaCheckCircle />

                                {item}

                              </div>

                            )

                          )

                          :

                          <div className="feedback-empty">

                            No strengths identified.

                          </div>

                        }

                      </div>

                      <div className="feedback-card weaknesses">

                        <h4>

                          Improvement Areas

                        </h4>

                        {

                          evaluation.weaknesses?.length ?

                          evaluation.weaknesses.map(

                            (
                              item,
                              i
                            ) => (

                              <div
                                key={i}
                                className="feedback-item"
                              >

                                <FaTimesCircle />

                                {item}

                              </div>

                            )

                          )

                          :

                          <div className="feedback-empty">

                            No improvement areas.

                          </div>

                        }

                      </div>

                    </div>

                  </div>

                }

              </div>

            );

          }

        )

      }

    </section>

  );

};

export default QuestionAnalysis;