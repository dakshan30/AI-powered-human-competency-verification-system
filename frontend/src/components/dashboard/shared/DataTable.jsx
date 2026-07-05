import React from "react";

import StatusBadge from "./StatusBadge";

const DataTable = ({
  columns,
  data,
}) => {
  return (
    <div className="table-wrapper">
      <table className="dashboard-table">
        <thead>
          <tr>
            {columns.map(
              (column) => (
                <th key={column.key}>
                  {column.label}
                </th>
              )
            )}
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr key={row._id}>
              {columns.map(
                (column) => (
                  <td
                    key={column.key}
                  >
                    {column.key ===
                    "status" ? (
                      <StatusBadge
                        status={
                          row[
                            column.key
                          ]
                        }
                      />
                    ) : (
                      row[column.key]
                    )}
                  </td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;