import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaCode, 
  FaClipboardCheck, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaSpinner,
  FaFileInvoice,
  FaArrowRight
} from "react-icons/fa";

import DashboardLayout from "../../components/dashboard/shared/DashboardLayout";
import { startInterviewSession, submitInterviewAnswer } from "../../services/interviewService";
import { fetchActiveProfile } from "../../services/resumeService";
import ProctoringTracker from "../../components/interview/ProctoringTracker";
import "../../styles/interviewWorkspace.css";

const InterviewWorkspace = () => {
  const navigate = useNavigate();

  // Workflow navigation step: 'loading_check' | 'no_profile' | 'prep' | 'interview' | 'completed'
  const [workflowStep, setWorkflowStep] = useState("loading_check");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Resume profile details
  const [profile, setProfile] = useState(null);
  const [questionCount, setQuestionCount] = useState(5);

  // Active Session details
  const [session, setSession] = useState(null);
  const [answer, setAnswer] = useState("");

  // Dismissable error triggers
  const triggerError = (message) => {
    setError(message);
    setTimeout(() => {
      setError("");
    }, 5000);
  };

  // Perform active candidate profile audit check on initialization
  useEffect(() => {
    const checkProfile = async () => {
      try {
        setWorkflowStep("loading_check");
        const response = await fetchActiveProfile();
        if (response && response.success && response.data) {
          setProfile(response.data);
          setWorkflowStep("prep");
        } else {
          setWorkflowStep("no_profile");
        }
      } catch (err) {
        console.error(err);
        // Intercept 404/PROFILE_NOT_FOUND to enforce registration boundaries
        if (err.response?.status === 404 || err.response?.data?.code === "PROFILE_NOT_FOUND") {
          setWorkflowStep("no_profile");
        } else {
          triggerError(err.response?.data?.message || "Failed to retrieve active resume details.");
          setWorkflowStep("no_profile");
        }
      }
    };
    checkProfile();
  }, []);

  // Start Session request
  const handleStartSession = async () => {
    try {
      setLoading(true);
      setError("");
      // Decouple category parameter and pass only requested count
      const response = await startInterviewSession(null, questionCount);
      if (response && response.success) {
        setSession(response.data);
        setWorkflowStep("interview");
        setAnswer("");
      }
    } catch (err) {
      console.error(err);
      triggerError(err.response?.data?.message || "Failed to initialize interview session. Please check database connectivity.");
    } finally {
      setLoading(false);
    }
  };

  // Submit response answer
  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      triggerError("Answer text field cannot be empty. Please draft a response.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await submitInterviewAnswer(session._id, answer.trim());
      if (response && response.success) {
        const updatedSession = response.data;
        setSession(updatedSession);
        
        if (updatedSession.status === "completed") {
          setWorkflowStep("completed");
        } else {
          // Reset workspace answer text for next question
          setAnswer("");
        }
      }
    } catch (err) {
      console.error(err);
      triggerError(err.response?.data?.message || "Failed to submit answer to AI evaluation engine.");
    } finally {
      setLoading(false);
    }
  };

  // Finish and return
  const handleFinish = () => {
    navigate("/candidate/dashboard");
  };

  return (
    <DashboardLayout>
      <ProctoringTracker sessionId={session?._id} status={session?.status}>
        <div className="workspace-page-container">
          {/* Dismissable Error Banner */}
          {error && (
            <div className="workspace-alert workspace-alert--error">
              <FaExclamationTriangle />
              <p>{error}</p>
            </div>
          )}

          {/* Loading Initial Audit state */}
          {workflowStep === "loading_check" && (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
              <FaSpinner className="spin" style={{ fontSize: "3rem", color: "#1976d2" }} />
            </div>
          )}

          {/* Case A: No Resume profile discovered */}
          {workflowStep === "no_profile" && (
            <div className="prep-card-container">
              <FaFileInvoice className="prep-header-icon" style={{ color: "#d32f2f" }} />
              <h2>Resume Profile Required</h2>
              <p>
                To launch a custom technical assessment session, our platform must first review your resume. 
                This helps us generate context-aware questions mapping closely to your tech stack.
              </p>
              <div style={{ marginTop: "2rem" }}>
                <button
                  type="button"
                  className="start-interview-btn"
                  onClick={() => navigate("/candidate/upload")}
                >
                  Upload Resume First <FaArrowRight style={{ marginLeft: "0.5rem" }} />
                </button>
              </div>
            </div>
          )}

          {/* Case B: Preparation Workspace (Prep Card with Candidate Credentials) */}
          {workflowStep === "prep" && profile && (
            <div className="prep-card-container">
              <FaCode className="prep-header-icon" />
              <h2>AI Technical Interview Workspace</h2>
              
              {/* Candidate Credentials Overview */}
              <div className="candidate-overview-box" style={{
                backgroundColor: "#f8f9fa",
                border: "1px solid #eef0f2",
                borderRadius: "0.5rem",
                padding: "1.25rem",
                margin: "1.5rem 0",
                textAlign: "left"
              }}>
                <h4 style={{ margin: "0 0 0.5rem 0", color: "#333", fontSize: "0.95rem" }}>Extracted Profile Focus</h4>
                <div style={{ fontSize: "0.9rem", color: "#555", marginBottom: "0.75rem" }}>
                  Matched Industry Role: <strong>{profile.parsedData?.matchedRole || "Software Developer"}</strong>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {profile.parsedData?.skills?.slice(0, 8).map((skill, idx) => (
                    <span key={idx} style={{
                      padding: "0.2rem 0.5rem",
                      backgroundColor: "rgba(25, 118, 210, 0.08)",
                      color: "#1976d2",
                      borderRadius: "0.25rem",
                      fontSize: "0.75rem",
                      fontWeight: 600
                    }}>{skill}</span>
                  ))}
                  {profile.parsedData?.skills?.length > 8 && (
                    <span style={{ fontSize: "0.75rem", color: "#888", alignSelf: "center" }}>+{profile.parsedData.skills.length - 8} more</span>
                  )}
                </div>
              </div>

              <p>
                The AI interviewer will dynamically query technical questions and coding scenarios customized 
                to your profile, evaluating responses for technical alignment.
              </p>

              <div className="prep-form-controls">
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", textAlign: "left" }}>
                  <label className="prep-select-label">Question Pool Count</label>
                  <select
                    className="prep-dropdown-field"
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    disabled={loading}
                  >
                    <option value={3}>3 Questions (Fast Track)</option>
                    <option value={5}>5 Questions (Standard)</option>
                    <option value={10}>10 Questions (Deep Dive)</option>
                  </select>
                </div>

                <button
                  type="button"
                  className="start-interview-btn"
                  onClick={handleStartSession}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="spin" style={{ marginRight: "0.5rem" }} /> Starting Session...
                    </>
                  ) : (
                    "Start Technical Assessment"
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Live Interview Workspace (Interactive Textarea Panel) */}
          {workflowStep === "interview" && session && (
            <div className="eval-workspace-container">
              {/* Header Progress Indicators */}
              <div className="workspace-status-header">
                <span className="track-indicator-pill">{session.category}</span>
                <span className="progress-numeric-text">
                  Question {session.currentQuestionIndex + 1} of {session.questions.length}
                </span>
              </div>

              {/* Question display */}
              <div className="question-display-banner">
                <h3>Technical Question</h3>
                <p className="question-display-text">
                  {session.questions[session.currentQuestionIndex]?.text}
                </p>
              </div>

              {/* Controlled Textarea Response */}
              <div className="answer-entry-area">
                <label className="answer-text-label">Write your technical response answer below</label>
                <textarea
                  className="answer-textarea-field"
                  placeholder="Draft your solution here. Be detailed, explain code structures, databases, or algorithms where applicable..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  disabled={loading}
                />
              </div>

              {/* Submission Footer with loading spinner */}
              <div className="workspace-actions-footer">
                <button
                  type="button"
                  className="submit-answer-btn"
                  onClick={handleSubmitAnswer}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="spin" style={{ marginRight: "0.5rem" }} /> AI grading response...
                    </>
                  ) : (
                    session.currentQuestionIndex + 1 === session.questions.length ? "Submit & Finalize Assessment" : "Submit Answer & Proceed"
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Results completion dashboard panel */}
          {workflowStep === "completed" && session && (
            <div className="results-completion-card">
              <FaCheckCircle className="results-success-icon" />
              <h2>Evaluation Complete!</h2>
              <p>
                Your technical assessment has been successfully graded by the Gemini AI evaluation engine.
                The results are updated on your candidate dashboard.
              </p>

              <div className="scores-badge-layout">
                {/* Competency Score Card */}
                <div className="score-badge-box">
                  <span className="score-badge-title">Competency Score</span>
                  <span className="score-badge-numeric">{session.overallCompetencyScore}%</span>
                </div>

                {/* Recommendation badge */}
                <div className="score-badge-box">
                  <span className="score-badge-title">Hiring Status Recommendation</span>
                  <span className={`recommendation-badge-text recommendation-badge-text--${session.recommendation}`}>
                    {session.recommendation.replace("_", " ")}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="workspace-finish-btn"
                onClick={handleFinish}
              >
                Finish & Return to Dashboard
              </button>
            </div>
          )}
        </div>
      </ProctoringTracker>
    </DashboardLayout>
  );
};

export default InterviewWorkspace;
