import React, {
  useState,
} from "react";

const DecisionPanel = ({
  onSubmit,
}) => {
  const [status, setStatus] =
    useState("hold");

  const [
    comments,
    setComments,
  ] = useState("");

  return (
    <div className="decision-panel">
      <h2>
        Hiring Decision
      </h2>

      <select
        value={status}
        onChange={(e) =>
          setStatus(
            e.target.value
          )
        }
      >
        <option value="hire">
          Hire
        </option>

        <option value="hold">
          Hold
        </option>

        <option value="reject">
          Reject
        </option>
      </select>

      <textarea
        placeholder="Recruiter Notes..."
        value={comments}
        onChange={(e) =>
          setComments(
            e.target.value
          )
        }
      />

      <button
        onClick={() =>
          onSubmit({
            status,
            comments,
          })
        }
      >
        Save Decision
      </button>
    </div>
  );
};

export default DecisionPanel;