import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FaArrowLeft, 
  FaShieldAlt, 
  FaClock, 
  FaLaptopCode, 
  FaCopy, 
  FaExclamationTriangle,
  FaSpinner,
  FaCheckCircle,
  FaSearchMinus
} from "react-icons/fa";

import DashboardLayout from "../../components/dashboard/shared/DashboardLayout";
import { fetchSessionIntegrityProfile } from "../../services/integrityService";

const eventLabelMap = {
  TAB_BLUR: "Tab Navigation Shift Detected",
  WINDOW_RESIZE: "Window Resize / Screen Split Attempt",
  COPY_PASTE_ATTEMPT: "Unauthorized Copy/Paste Attempt",
  UNAUTHORIZED_DEVICE: "Unauthorized Secondary Device Warning",
  
  // Legacy mappings
  tab_switch: "Tab Switch Warning",
  fullscreen_exit: "Fullscreen Mode Exited",
  copy_paste: "Clipboard Copy/Paste Shortcut Blocked"
};

const eventIconMap = {
  TAB_BLUR: <FaExclamationTriangle style={{ color: "#ff9800" }} />,
  WINDOW_RESIZE: <FaLaptopCode style={{ color: "#1976d2" }} />,
  COPY_PASTE_ATTEMPT: <FaCopy style={{ color: "#d32f2f" }} />,
  UNAUTHORIZED_DEVICE: <FaShieldAlt style={{ color: "#d32f2f" }} />,
  
  // Legacy
  tab_switch: <FaExclamationTriangle style={{ color: "#ff9800" }} />,
  fullscreen_exit: <FaLaptopCode style={{ color: "#ff9800" }} />,
  copy_paste: <FaCopy style={{ color: "#d32f2f" }} />
};

const IntegrityMonitor = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [log, setLog] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetchSessionIntegrityProfile(sessionId);
        if (response && response.success) {
          setLog(response.data);
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load session integrity parameters.");
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      loadProfile();
    }
  }, [sessionId]);

  const getRiskStyles = (level) => {
    switch (level) {
      case "LOW":
        return {
          bg: "rgba(46, 125, 50, 0.1)",
          color: "#2e7d32",
          border: "1px solid rgba(46, 125, 50, 0.3)",
          label: "Low Risk Status"
        };
      case "MEDIUM":
        return {
          bg: "rgba(255, 152, 0, 0.1)",
          color: "#ff9800",
          border: "1px solid rgba(255, 152, 0, 0.3)",
          label: "Medium Risk Warnings"
        };
      case "HIGH":
        return {
          bg: "rgba(211, 47, 47, 0.1)",
          color: "#d32f2f",
          border: "1px solid rgba(211, 47, 47, 0.3)",
          label: "High Security Risk"
        };
      case "CRITICAL":
        return {
          bg: "rgba(211, 47, 47, 0.15)",
          color: "#d32f2f",
          border: "2px solid #d32f2f",
          label: "Critical Breach Warning",
          className: "pulse-critical-card"
        };
      default:
        return {
          bg: "#f1f3f5",
          color: "#495057",
          border: "1px solid #dee2e6",
          label: "Undetermined Risk"
        };
    }
  };

  const riskStyles = log ? getRiskStyles(log.riskLevel) : {};

  return (
    <DashboardLayout>
      {/* Inject custom pulsing frames dynamically to keep components self-contained */}
      <style>{`
        @keyframes proctorPulseCritical {
          0% { box-shadow: 0 0 0 0 rgba(211, 47, 47, 0.3); }
          70% { box-shadow: 0 0 0 8px rgba(211, 47, 47, 0); }
          100% { box-shadow: 0 0 0 0 rgba(211, 47, 47, 0); }
        }
        .pulse-critical-card {
          animation: proctorPulseCritical 2s infinite;
        }
        .integrity-monitor-view {
          padding: 2rem;
          max-width: 1000px;
          margin: 0 auto;
        }
        .back-btn-anchor {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: #1976d2;
          font-weight: 600;
          cursor: pointer;
          font-size: 0.9rem;
          background: none;
          border: none;
          margin-bottom: 1.5rem;
          padding: 0;
        }
        .back-btn-anchor:hover {
          color: #1565c0;
          text-decoration: underline;
        }
        .integrity-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          border-bottom: 1px solid #eef0f2;
          padding-bottom: 1rem;
        }
        .integrity-header h1 {
          font-size: 1.6rem;
          font-weight: 700;
          color: #333;
          margin: 0;
        }
        .risk-gauge-card {
          padding: 1.5rem;
          border-radius: 0.5rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin-bottom: 2rem;
        }
        .risk-gauge-card h2 {
          margin: 0 0 0.5rem 0;
          font-size: 2rem;
          font-weight: 800;
          letter-spacing: 0.5px;
        }
        .violation-feed-panel {
          background-color: #fff;
          border-radius: 0.75rem;
          border: 1px solid #eef0f2;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
          padding: 1.75rem;
        }
        .violation-feed-panel h3 {
          margin: 0 0 1.5rem 0;
          font-size: 1.1rem;
          font-weight: 700;
          color: #333;
        }
        .violation-stream-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .violation-stream-item {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          background-color: #fafcff;
          border: 1px solid #eef0f2;
          border-radius: 0.5rem;
          align-items: flex-start;
        }
        .violation-details {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          flex: 1;
        }
        .violation-title {
          font-weight: 700;
          font-size: 0.95rem;
          color: #333;
        }
        .violation-meta-text {
          font-size: 0.85rem;
          color: #666;
        }
        .violation-time {
          font-size: 0.8rem;
          color: #888;
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }
        .empty-violations-card {
          text-align: center;
          padding: 3rem 2rem;
          background-color: #fff;
          border-radius: 0.75rem;
          border: 1px solid #eef0f2;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
        }
      `}</style>

      <div className="integrity-monitor-view">
        
        {/* Back navigation button */}
        <button className="back-btn-anchor" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back to candidates panel
        </button>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "4rem 0" }}>
            <FaSpinner className="spin" style={{ fontSize: "2.5rem", color: "#1976d2" }} />
          </div>
        ) : error ? (
          <div className="empty-violations-card" style={{ borderLeft: "4px solid #d32f2f" }}>
            <FaExclamationTriangle style={{ fontSize: "3rem", color: "#d32f2f", marginBottom: "1rem" }} />
            <h3>Failed to load telemetry profile</h3>
            <p style={{ color: "#666" }}>{error}</p>
          </div>
        ) : !log ? (
          <div className="empty-violations-card">
            <FaSearchMinus style={{ fontSize: "3rem", color: "#aaa", marginBottom: "1rem" }} />
            <h3>No records discovered</h3>
            <p style={{ color: "#666" }}>This session has not generated any telemetry logs.</p>
          </div>
        ) : (
          <>
            {/* Header info */}
            <div className="integrity-header">
              <div>
                <h1>Assessment Proctoring Report</h1>
                <p style={{ margin: "0.25rem 0 0 0", color: "#666", fontSize: "0.9rem" }}>
                  Candidate: <strong>{log.candidateId?.username || "N/A"}</strong> ({log.candidateId?.email || "N/A"})
                </p>
              </div>
              <div style={{ fontSize: "0.85rem", color: "#888", textAlign: "right" }}>
                <div>Session Log ID: {log.interviewSessionId}</div>
                <div>Last Telemetry: {new Date(log.updatedAt).toLocaleTimeString()}</div>
              </div>
            </div>

            {/* Risk Gauge metric */}
            <div 
              className={`risk-gauge-card ${riskStyles.className || ""}`}
              style={{
                backgroundColor: riskStyles.bg,
                color: riskStyles.color,
                border: riskStyles.border
              }}
            >
              <span style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.25rem" }}>
                {riskStyles.label}
              </span>
              <h2>{log.riskLevel}</h2>
              <p style={{ margin: 0, fontSize: "0.9rem", opacity: 0.9 }}>
                Total recorded telemetry infractions: <strong>{log.violations?.length || 0}</strong>
              </p>
            </div>

            {/* Violation list stream */}
            {log.violations?.length === 0 ? (
              <div className="empty-violations-card">
                <FaCheckCircle style={{ fontSize: "3.5rem", color: "#2e7d32", marginBottom: "1rem" }} />
                <h3 style={{ color: "#2e7d32" }}>Safe Assessment Profile</h3>
                <p style={{ color: "#666" }}>Excellent! Candidate has zero proctoring infractions recorded during this session.</p>
              </div>
            ) : (
              <div className="violation-feed-panel">
                <h3>Chronological Infractions Stream</h3>
                <div className="violation-stream-list">
                  {log.violations.map((violation, idx) => (
                    <div key={idx} className="violation-stream-item">
                      <div style={{ fontSize: "1.25rem", marginTop: "0.15rem" }}>
                        {eventIconMap[violation.eventType] || <FaExclamationTriangle style={{ color: "#ff9800" }} />}
                      </div>
                      <div className="violation-details">
                        <div className="violation-title">
                          {eventLabelMap[violation.eventType] || violation.eventType}
                        </div>
                        {violation.additionalMeta && violation.additionalMeta.description && (
                          <div className="violation-meta-text">
                            {violation.additionalMeta.description}
                          </div>
                        )}
                        {violation.additionalMeta && violation.additionalMeta.size && (
                          <div className="violation-meta-text" style={{ fontFamily: "monospace" }}>
                            Viewport details: {violation.additionalMeta.size}
                          </div>
                        )}
                        <div className="violation-time">
                          <FaClock /> {new Date(violation.timestamp).toLocaleTimeString()} ({new Date(violation.timestamp).toLocaleDateString()})
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default IntegrityMonitor;
