import React from "react";

import DataTable from "../shared/DataTable";

const CandidateTable = ({
  candidates = [],
  loading = false,
}) => {

  const columns = [

    {
      key: "name",
      label: "Candidate",
    },

    {
      key: "email",
      label: "Email",
    },

    {
      key: "role",
      label: "Role",
    },

    {
      key: "atsScore",
      label: "ATS",
      render: (row) =>
        `${row.atsScore ?? 0}%`,
    },

    {
      key: "competency",
      label: "Competency",
      render: (row) =>
        `${row.competency ?? 0}%`,
    },

    {
      key: "recommendation",
      label: "Recommendation",
      render: (row) => {

        const value =
          row.recommendation ||
          "Pending";

        return (
          <span
            className={`recommendation-badge ${value
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
          >
            {value}
          </span>
        );

      },
    },

    {
      key: "trustScore",
      label: "Trust",
      render: (row) =>
        `${row.trustScore ?? 100}%`,
    },

    {
      key: "decision",
      label: "Decision",
      render: (row) => {

        const value =
          row.decision ||
          "Pending";

        return (
          <span
            className={`decision-badge ${value
              .toLowerCase()}`}
          >
            {value}
          </span>
        );

      },
    },

    {
      key: "status",
      label: "Interview",
    },

  ];

  return (

    <DataTable
      columns={columns}
      data={candidates}
      loading={loading}
      emptyMessage="No candidates available."
    />

  );

};

export default CandidateTable;