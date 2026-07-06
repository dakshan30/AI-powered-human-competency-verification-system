import React from "react";

const TablePagination = ({
  page = 1,
  totalPages = 0,
  totalRecords = 0,
  pageSize = 10,
  onPageChange,
}) => {
  if (!totalRecords) {
    return null;
  }

  const startRecord =
    (page - 1) * pageSize +
    1;

  const endRecord =
    Math.min(
      page * pageSize,
      totalRecords
    );

  return (
    <div className="table-pagination">
      <div className="table-pagination__summary">
        {`Showing ${startRecord}-${endRecord} of ${totalRecords} reports`}
      </div>

      <div className="table-pagination__actions">
        <button
          type="button"
          className="table-pagination__button"
          onClick={() =>
            onPageChange(
              page - 1
            )
          }
          disabled={page <= 1}
        >
          Previous
        </button>

        <span className="table-pagination__page">
          {`Page ${page} of ${Math.max(totalPages, 1)}`}
        </span>

        <button
          type="button"
          className="table-pagination__button"
          onClick={() =>
            onPageChange(
              page + 1
            )
          }
          disabled={
            totalPages <= 1 ||
            page >= totalPages
          }
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TablePagination;
