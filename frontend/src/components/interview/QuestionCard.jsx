import React from "react";

const QuestionCard = ({
  question,

  index,

  total,
}) => {
  return (
    <div className="question-card">
      <div className="question-meta">
        <span>
          Question {index + 1} /{" "}
          {total}
        </span>

        <span>
          {
            question.difficulty
          }
        </span>
      </div>

      <h2>
        {question.question}
      </h2>

      <div className="question-tags">
        <span>
          {question.skill}
        </span>

        <span>
          {question.type}
        </span>
      </div>
    </div>
  );
};

export default QuestionCard;