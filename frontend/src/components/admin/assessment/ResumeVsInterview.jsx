import React from "react";

const ResumeVsInterview = ({
  atsScore,
  interviewScore,
}) => {
  const difference =
    interviewScore -
    atsScore;

  return (
    <div className="resume-vs-card">
      <h2>
        Resume vs Interview
      </h2>

      <div>
        Resume ATS Score:
        {" "}
        {atsScore}%
      </div>

      <div>
        Interview Score:
        {" "}
        {interviewScore}%
      </div>

      <div>
        Difference:
        {" "}
        {difference > 0
          ? "+"
          : ""}
        {difference}%
      </div>
    </div>
  );
};

export default ResumeVsInterview;