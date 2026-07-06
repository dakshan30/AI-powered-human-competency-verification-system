import React, {
  useEffect,
  useState,
} from "react";

import {
  FaDownload,
  FaExclamationTriangle,
  FaEye,
  FaFileAlt,
  FaArchive,
  FaTrash,
  FaFileExcel,
  FaFileImport,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

import {
  Link,
} from "react-router-dom";

import DashboardLayout from "../../components/dashboard/shared/DashboardLayout";
import EmptyState from "../../components/dashboard/shared/EmptyState";
import FilterDropdown from "../../components/dashboard/shared/FilterDropdown";
import LoadingSkeleton from "../../components/dashboard/shared/LoadingSkeleton";
import SearchBar from "../../components/dashboard/shared/SearchBar";
import SectionHeader from "../../components/dashboard/shared/SectionHeader";
import TablePagination from "../../components/dashboard/shared/TablePagination";
import {
  downloadReport,
  getReports,
  archiveReport,
  deleteReport,
  exportReports,
  getArchiveStats,
} from "../../services/reportService";
import "../../styles/reports.css";

const REPORT_PAGE_SIZE =
  10;

const recommendationOptions = [
  "All",
  "STRONG_HIRE",
  "HIRE",
  "HOLD",
  "REJECT",
];

const statusOptions = [
  "All",
  "completed",
  "hire",
  "hold",
  "reject",
];

const normalizeLabel =
  (value) => {
    if (!value) {
      return "N/A";
    }

    return value
      .split("_")
      .join(" ")
      .replace(
        /\b\w/g,
        (char) =>
          char.toUpperCase()
      );
  };

const formatDate =
  (value) => {
    if (!value) {
      return "N/A";
    }

    return new Date(
      value
    ).toLocaleString();
  };

const Reports = () => {
  const [loading, setLoading] =
    useState(true);

  const [downloadingId, setDownloadingId] =
    useState("");

  const [error, setError] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const [reports, setReports] =
    useState([]);

  const [pagination, setPagination] =
    useState({
      page: 1,
      limit:
        REPORT_PAGE_SIZE,
      totalPages: 0,
      totalRecords: 0,
    });

  const [search, setSearch] =
    useState("");

  const [debouncedSearch, setDebouncedSearch] =
    useState("");

  const [recommendation, setRecommendation] =
    useState("All");

  const [status, setStatus] =
    useState("All");

  // Modal states
  const [confirmModal, setConfirmModal] =
    useState({
      isOpen: false,
      type: "", // 'archive', 'delete'
      reportId: "",
      candidateName: "",
    });

  const [exportModal, setExportModal] =
    useState({
      isOpen: false,
      isExporting: false,
    });

  const [archiveStats, setArchiveStats] =
    useState(null);

  const [actionInProgress, setActionInProgress] =
    useState("");

  // Tabs
  const [activeTab, setActiveTab] =
    useState("active"); // 'active' or 'archived'

  useEffect(() => {
    const timer =
      window.setTimeout(
        () => {
          setDebouncedSearch(
            search.trim()
          );
        },
        350
      );

    return () =>
      window.clearTimeout(
        timer
      );
  }, [search]);

  useEffect(() => {
    handleLoadArchiveStats();
  }, []);

  useEffect(() => {
    setPagination((current) => ({
      ...current,
      page: 1,
    }));
  }, [
    debouncedSearch,
    recommendation,
    status,
  ]);

  useEffect(() => {
    let isMounted = true;

    const loadReports =
      async () => {
        setLoading(true);
        setError("");

        try {
          const response =
            await getReports({
              page:
                pagination.page,
              limit:
                pagination.limit,
              search:
                debouncedSearch,
              recommendation,
              status,
            });

          if (!isMounted) {
            return;
          }

          const reportData =
            response?.data
              ?.reports || [];

          const paginationData =
            response?.data
              ?.pagination || {};

          setReports(
            reportData
          );

          setPagination(
            (current) => ({
              ...current,
              page:
                paginationData.page ||
                current.page,
              limit:
                paginationData.limit ||
                current.limit,
              totalPages:
                paginationData.totalPages ||
                0,
              totalRecords:
                paginationData.totalRecords ||
                0,
            })
          );
        } catch (requestError) {
          if (!isMounted) {
            return;
          }

          setReports([]);

          setPagination(
            (current) => ({
              ...current,
              totalPages: 0,
              totalRecords: 0,
            })
          );

          setError(
            requestError
              ?.response?.data
              ?.message ||
              "Unable to load reports right now."
          );
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      };

    loadReports();

    return () => {
      isMounted = false;
    };
  }, [
    debouncedSearch,
    pagination.page,
    pagination.limit,
    recommendation,
    status,
  ]);

  const handleDownload =
    async (
      interviewId
    ) => {
      try {
        setDownloadingId(
          interviewId
        );

        await downloadReport(
          interviewId
        );

        setSuccessMessage(
          "Report downloaded successfully!"
        );

        setTimeout(
          () =>
            setSuccessMessage(
              ""
            ),
          3000
        );
      } catch (downloadError) {
        setError(
          downloadError
            ?.response?.data
            ?.message ||
            "Failed to download report."
        );
      } finally {
        setDownloadingId(
          ""
        );
      }
    };

  const handleArchiveClick =
    (
      reportId,
      candidateName
    ) => {
      setConfirmModal({
        isOpen: true,
        type: "archive",
        reportId,
        candidateName,
      });
    };

  const handleDeleteClick =
    (
      reportId,
      candidateName
    ) => {
      setConfirmModal({
        isOpen: true,
        type: "delete",
        reportId,
        candidateName,
      });
    };

  const handleConfirmAction =
    async () => {
      const {
        type,
        reportId,
      } = confirmModal;

      try {
        setActionInProgress(
          reportId
        );

        if (
          type === "archive"
        ) {
          await archiveReport(
            reportId
          );

          setSuccessMessage(
            "Report archived successfully!"
          );
        } else if (
          type === "delete"
        ) {
          await deleteReport(
            reportId
          );

          setSuccessMessage(
            "Report deleted successfully!"
          );
        }

        setReports(
          (prevReports) =>
            prevReports.filter(
              (r) =>
                r._id !==
                reportId
            )
        );

        setTimeout(
          () =>
            setSuccessMessage(
              ""
            ),
          3000
        );

        setConfirmModal({
          isOpen: false,
          type: "",
          reportId: "",
          candidateName: "",
        });
      } catch (err) {
        setError(
          err?.response?.data
            ?.message ||
            `Failed to ${type} report.`
        );
      } finally {
        setActionInProgress(
          ""
        );
      }
    };

  const handleExport =
    async (format) => {
      try {
        setExportModal({
          isOpen: false,
          isExporting: true,
        });

        await exportReports(
          format
        );

        setSuccessMessage(
          `Reports exported to ${format.toUpperCase()} successfully!`
        );

        setTimeout(
          () =>
            setSuccessMessage(
              ""
            ),
          3000
        );
      } catch (err) {
        setError(
          err?.response?.data
            ?.message ||
            `Failed to export reports as ${format}.`
        );
      } finally {
        setExportModal({
          isOpen: false,
          isExporting: false,
        });
      }
    };

  const handleLoadArchiveStats =
    async () => {
      try {
        const stats =
          await getArchiveStats();

        setArchiveStats(
          stats.data || stats
        );
      } catch (err) {
        console.error(
          "Failed to load archive stats:",
          err
        );
      }
    };

  const handlePageChange =
    (nextPage) => {
      if (
        nextPage < 1 ||
        (
          pagination.totalPages >
            0 &&
          nextPage >
            pagination.totalPages
        )
      ) {
        return;
      }

      setPagination(
        (current) => ({
          ...current,
          page: nextPage,
        })
      );
    };

  return (
    <DashboardLayout>
      <SectionHeader
        title="Reports"
        subtitle="Review completed interview reports, download PDFs, and track recruiter outcomes from live MongoDB data."
      />

      {/* Tab Navigation */}
      <div className="reports-tabs">
        <button
          type="button"
          className={`reports-tab ${
            activeTab === "active"
              ? "reports-tab--active"
              : ""
          }`}
          onClick={() => {
            setActiveTab(
              "active"
            );
            setPagination(
              (c) => ({
                ...c,
                page: 1,
              })
            );
          }}
        >
          Active Reports
        </button>
        <button
          type="button"
          className={`reports-tab ${
            activeTab === "archived"
              ? "reports-tab--active"
              : ""
          }`}
          onClick={() => {
            setActiveTab(
              "archived"
            );
          }}
        >
          Archived Reports{" "}
          {archiveStats?.totalArchived
            ? `(${archiveStats.totalArchived})`
            : ""}
        </button>
      </div>

      {/* Active Reports Section */}
      {activeTab === "active" && (
        <>
          <div className="table-controls reports-controls">
            <SearchBar
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search by candidate name or email"
            />

            <div className="reports-controls__filters">
              <FilterDropdown
                value={
                  recommendation
                }
                onChange={(event) =>
                  setRecommendation(
                    event.target.value
                  )
                }
                options={
                  recommendationOptions
                }
              />

              <FilterDropdown
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value
                  )
                }
                options={
                  statusOptions
                }
              />

              <button
                type="button"
                className="btn btn-primary"
                onClick={() =>
                  setExportModal({
                    isOpen: true,
                    isExporting: false,
                  })
                }
              >
                <FaFileExcel /> Export
              </button>
            </div>
          </div>

          {error ? (
            <div className="reports-alert reports-alert--error">
              <FaExclamationTriangle />
              <span>{error}</span>
            </div>
          ) : null}

          {successMessage ? (
            <div className="reports-alert reports-alert--success">
              <FaCheckCircle />
              <span>{successMessage}</span>
            </div>
          ) : null}

          {loading ? (
            <div className="reports-loading">
              <LoadingSkeleton />
              <LoadingSkeleton />
            </div>
          ) : reports.length === 0 ? (
            <div className="table-wrapper">
              <EmptyState
                title="No reports found"
                subtitle="Completed interviews that match your current search and filters will appear here."
              />
            </div>
          ) : (
            <>
              <div className="table-wrapper">
                <table className="dashboard-table reports-table">
                  <thead>
                    <tr>
                      <th>
                        Candidate
                      </th>
                      <th>Email</th>
                      <th>
                        Interview Date
                      </th>
                      <th>
                        Competency
                      </th>
                      <th>
                        ATS Score
                      </th>
                      <th>
                        Recommendation
                      </th>
                      <th>
                        Trust Score
                      </th>
                      <th>Status</th>
                      <th>
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {reports.map(
                      (
                        report
                      ) => (
                        <tr
                          key={
                            report._id
                          }
                        >
                          <td>
                            <div className="reports-candidate">
                              <span className="reports-candidate__icon">
                                <FaFileAlt />
                              </span>
                              <div>
                                <strong>
                                  {
                                    report.candidateName
                                  }
                                </strong>
                                <span>
                                  ID:{" "}
                                  {
                                    report._id
                                  }
                                </span>
                              </div>
                            </div>
                          </td>
                          <td>
                            {
                              report.candidateEmail
                            }
                          </td>
                          <td>
                            {formatDate(
                              report.interviewDate
                            )}
                          </td>
                          <td>
                            {`${report.competency || 0}%`}
                          </td>
                          <td>
                            {`${report.atsScore || 0}%`}
                          </td>
                          <td>
                            <span className="reports-pill reports-pill--recommendation">
                              {normalizeLabel(
                                report.recommendation
                              )}
                            </span>
                          </td>
                          <td>
                            {`${report.trustScore || 0}%`}
                          </td>
                          <td>
                            <span
                              className={`status-badge ${String(
                                report.status ||
                                  "completed"
                              ).toLowerCase()}`}
                            >
                              {normalizeLabel(
                                report.status
                              )}
                            </span>
                          </td>
                          <td>
                            <div className="reports-actions">
                              <Link
                                to={`/admin/interview/${report._id}/report`}
                                className="reports-action reports-action--view"
                                title="View full report"
                              >
                                <FaEye />
                                <span>
                                  View
                                </span>
                              </Link>

                              <button
                                type="button"
                                className="reports-action reports-action--download"
                                onClick={() =>
                                  handleDownload(
                                    report._id
                                  )
                                }
                                disabled={
                                  downloadingId ===
                                  report._id
                                }
                                title="Download PDF report"
                              >
                                <FaDownload />
                                <span>
                                  {downloadingId ===
                                  report._id
                                    ? "..."
                                    : "PDF"}
                                </span>
                              </button>

                              <button
                                type="button"
                                className="reports-action reports-action--archive"
                                onClick={() =>
                                  handleArchiveClick(
                                    report._id,
                                    report.candidateName
                                  )
                                }
                                disabled={
                                  actionInProgress ===
                                  report._id
                                }
                                title="Archive report"
                              >
                                <FaArchive />
                                <span>
                                  Archive
                                </span>
                              </button>

                              <button
                                type="button"
                                className="reports-action reports-action--delete"
                                onClick={() =>
                                  handleDeleteClick(
                                    report._id,
                                    report.candidateName
                                  )
                                }
                                disabled={
                                  actionInProgress ===
                                  report._id
                                }
                                title="Delete report"
                              >
                                <FaTrash />
                                <span>
                                  Delete
                                </span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              <TablePagination
                page={pagination.page}
                totalPages={
                  pagination.totalPages
                }
                totalRecords={
                  pagination.totalRecords
                }
                pageSize={
                  pagination.limit
                }
                onPageChange={
                  handlePageChange
                }
              />
            </>
          )}
        </>
      )}

      {/* Archived Reports Section */}
      {activeTab === "archived" && (
        <>
          {successMessage ? (
            <div className="reports-alert reports-alert--success">
              <FaCheckCircle />
              <span>{successMessage}</span>
            </div>
          ) : null}

          {!archiveStats ||
          archiveStats
            .archivedReports
            .length === 0 ? (
            <div className="table-wrapper">
              <EmptyState
                title="No archived reports"
                subtitle="Reports you archive will appear here for compliance and historical records."
              />
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="dashboard-table reports-table">
                <thead>
                  <tr>
                    <th>
                      Candidate
                    </th>
                    <th>Email</th>
                    <th>
                      Archived Date
                    </th>
                    <th>Status</th>
                    <th>
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {archiveStats.archivedReports.map(
                    (
                      report
                    ) => (
                      <tr
                        key={
                          report._id
                        }
                      >
                        <td>
                          <div className="reports-candidate">
                            <span className="reports-candidate__icon">
                              <FaArchive />
                            </span>
                            <div>
                              <strong>
                                {
                                  report.candidateName
                                }
                              </strong>
                              <span>
                                ID:{" "}
                                {
                                  report._id
                                }
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          {
                            report.candidateEmail
                          }
                        </td>
                        <td>
                          {formatDate(
                            report.archivedAt
                          )}
                        </td>
                        <td>
                          <span className="reports-pill">
                            {normalizeLabel(
                              report.status
                            )}
                          </span>
                        </td>
                        <td>
                          <div className="reports-actions">
                            <button
                              type="button"
                              className="reports-action reports-action--view"
                              title="View archived report details"
                              onClick={() => {
                                // Show archived report details
                                setError(
                                  `Archived Report: ${report.candidateName}`
                                );
                              }}
                            >
                              <FaEye />
                              <span>
                                View
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="modal-overlay">
          <div className="modal-content modal-content--confirm">
            <div className="modal-header">
              <h3>
                {confirmModal.type === "archive"
                  ? "Archive Report?"
                  : "Delete Report?"}
              </h3>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to{" "}
                {confirmModal.type === "archive"
                  ? "archive"
                  : "delete"}{" "}
                the report for{" "}
                <strong>
                  {
                    confirmModal.candidateName
                  }
                </strong>
                ?
              </p>
              {confirmModal.type ===
                "delete" && (
                <p className="text-danger">
                  This action cannot be undone.
                </p>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() =>
                  setConfirmModal({
                    isOpen: false,
                    type: "",
                    reportId: "",
                    candidateName: "",
                  })
                }
                disabled={
                  actionInProgress ===
                  confirmModal.reportId
                }
              >
                Cancel
              </button>
              <button
                type="button"
                className={`btn ${
                  confirmModal.type ===
                  "delete"
                    ? "btn-danger"
                    : "btn-warning"
                }`}
                onClick={
                  handleConfirmAction
                }
                disabled={
                  actionInProgress ===
                  confirmModal.reportId
                }
              >
                {actionInProgress ===
                confirmModal.reportId
                  ? "Processing..."
                  : confirmModal.type ===
                    "archive"
                  ? "Archive"
                  : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {exportModal.isOpen && (
        <div className="modal-overlay">
          <div className="modal-content modal-content--export">
            <div className="modal-header">
              <h3>Export Reports</h3>
            </div>
            <div className="modal-body">
              <p>
                Choose export format:
              </p>
              <div className="export-options">
                <button
                  type="button"
                  className="export-option"
                  onClick={() =>
                    handleExport(
                      "csv"
                    )
                  }
                  disabled={
                    exportModal.isExporting
                  }
                >
                  <FaFileImport />
                  <span>
                    Export as CSV
                  </span>
                </button>
                <button
                  type="button"
                  className="export-option"
                  onClick={() =>
                    handleExport(
                      "xlsx"
                    )
                  }
                  disabled={
                    exportModal.isExporting
                  }
                >
                  <FaFileExcel />
                  <span>
                    Export as Excel
                  </span>
                </button>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() =>
                  setExportModal({
                    isOpen: false,
                    isExporting: false,
                  })
                }
                disabled={
                  exportModal.isExporting
                }
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Reports;
