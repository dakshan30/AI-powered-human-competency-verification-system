import React, { useEffect, useState, useRef } from "react";
import { 
  FaCloudUploadAlt, 
  FaFilePdf, 
  FaFileWord, 
  FaTimes, 
  FaSpinner, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaArrowRight
} from "react-icons/fa";

import DashboardLayout from "../../components/dashboard/shared/DashboardLayout";
import { 
  uploadCandidateResume, 
  fetchActiveProfile 
} from "../../services/resumeService";
import "../../styles/resumeIntelligence.css";

const defaultSkillsMap = {
  "Backend Developer": "Node.js, Express, MongoDB, SQL, JavaScript, Redis, Docker",
  "Frontend Developer": "React, HTML, CSS, JavaScript, TailwindCSS, TypeScript, Redux",
  "Fullstack Developer": "Node.js, React, JavaScript, MongoDB, Express, HTML, CSS",
  "DevOps Engineer": "Docker, Kubernetes, AWS, CI/CD, Linux, Bash, Terraform",
  "System Architect": "Microservices, System Design, AWS, Redis, SQL, Security, Nginx"
};

const ResumeIntelligence = () => {
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [hasProfile, setHasProfile] = useState(false);
  const [profile, setProfile] = useState(null);

  // Form parameters
  const [targetedRole, setTargetedRole] = useState("Backend Developer");
  const [benchmarkSkills, setBenchmarkSkills] = useState(defaultSkillsMap["Backend Developer"]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // Auto-dismiss alert helpers
  const triggerAlert = (message, type = "success") => {
    if (type === "success") {
      setSuccessMessage(message);
      setError("");
      setTimeout(() => setSuccessMessage(""), 4000);
    } else {
      setError(message);
      setSuccessMessage("");
      setTimeout(() => setError(""), 5000);
    }
  };

  // Load existing profile details
  const checkActiveProfile = async () => {
    try {
      setFetching(true);
      setError("");
      const response = await fetchActiveProfile();
      if (response && response.success && response.data) {
        setProfile(response.data);
        setHasProfile(true);
      }
    } catch (err) {
      // If 404 PROFILE_NOT_FOUND, we just stay in upload state
      if (err.response?.status === 404 || err.response?.data?.code === "PROFILE_NOT_FOUND") {
        setHasProfile(false);
      } else {
        triggerAlert(err.response?.data?.message || "Error checking profile status.", "error");
      }
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    checkActiveProfile();
  }, []);

  // Update benchmark defaults on role change
  const handleRoleChange = (role) => {
    setTargetedRole(role);
    setBenchmarkSkills(defaultSkillsMap[role] || "");
  };

  // Drag and Drop Event Handles
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file) => {
    const allowedExtensions = [".pdf", ".doc", ".docx"];
    const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    
    if (!allowedExtensions.includes(fileExtension)) {
      triggerAlert("Invalid file format. Please upload PDF or Word (.doc/.docx) files.", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      triggerAlert("File is too large. Maximum file size allowed is 5MB.", "error");
      return;
    }

    setSelectedFile(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Submit and upload resume Form data
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      triggerAlert("Please select a resume file to upload.", "error");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      const formData = new FormData();
      formData.append("resume", selectedFile);
      formData.append("targetedRole", targetedRole);
      formData.append("benchmarkSkills", benchmarkSkills);

      const response = await uploadCandidateResume(formData);
      if (response && response.success) {
        triggerAlert("Resume processed and analyzed successfully!");
        setProfile(response.data);
        setHasProfile(true);
      }
    } catch (err) {
      console.error(err);
      triggerError(err.response?.data?.message || "Failed to process and analyze resume.");
    } finally {
      setLoading(false);
    }
  };

  // Trigger local error boundary
  const triggerError = (msg) => {
    setError(msg);
    setTimeout(() => setError(""), 5000);
  };

  const onDropzoneClick = () => {
    fileInputRef.current?.click();
  };

  // SVG Progress Ring calculations
  const radius = 70;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const atsScore = profile?.atsScore || 0;
  const strokeDashoffset = circumference - (atsScore / 100) * circumference;

  if (fetching) {
    return (
      <DashboardLayout>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
          <FaSpinner className="spin" style={{ fontSize: "3rem", color: "#1976d2" }} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="resume-intel-container">
        
        {/* Header Title */}
        <div className="resume-intel-header">
          <h1>Resume Semantic Intelligence</h1>
          <p>Extract technical entities, profile qualifications, and check target ATS role alignment scores.</p>
        </div>

        {/* Global Notifications */}
        {successMessage && (
          <div className="resume-alert resume-alert--success">
            <FaCheckCircle /> <p>{successMessage}</p>
          </div>
        )}
        {error && (
          <div className="resume-alert resume-alert--error">
            <FaExclamationTriangle /> <p>{error}</p>
          </div>
        )}

        {/* Workflow Conditional Routing */}
        {!hasProfile ? (
          /* Intake Upload view */
          <div className="intake-drop-zone-card">
            
            {/* Drag & Drop zone */}
            <div 
              className={`drop-zone-box ${dragActive ? "drop-zone-box--active" : ""}`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={onDropzoneClick}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: "none" }}
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
              />
              <FaCloudUploadAlt className="drop-zone-icon" />
              <h3>Drag and drop your resume file here</h3>
              <p>Supports PDF, DOC, or DOCX formats (Max 5MB)</p>
            </div>

            {/* Selected File indicator */}
            {selectedFile && (
              <div style={{ marginTop: "1rem" }}>
                <div className="selected-file-pill">
                  {selectedFile.name.endsWith(".pdf") ? <FaFilePdf /> : <FaFileWord />}
                  <span>{selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                  <FaTimes className="remove-file-cross" onClick={removeFile} />
                </div>
              </div>
            )}

            {/* Role configurations forms */}
            <form className="intake-form-controls" onSubmit={handleFormSubmit}>
              <div className="intake-form-group">
                <label>Target Application Track</label>
                <select
                  className="intake-select-input"
                  value={targetedRole}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  disabled={loading}
                >
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Fullstack Developer">Fullstack Developer</option>
                  <option value="DevOps Engineer">DevOps Engineer</option>
                  <option value="System Architect">System Architect</option>
                </select>
              </div>

              <div className="intake-form-group">
                <label>Benchmark Skills Matrix (Comma separated)</label>
                <input 
                  type="text" 
                  className="intake-text-input"
                  placeholder="e.g. React, Node.js, Express"
                  value={benchmarkSkills}
                  onChange={(e) => setBenchmarkSkills(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <button
                type="submit"
                className="upload-submit-btn"
                disabled={loading || !selectedFile}
              >
                {loading ? (
                  <>
                    <FaSpinner className="spin" /> Processing AI parsing loop...
                  </>
                ) : (
                  <>
                    Process & Analyze Resume <FaArrowRight />
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Profile dashboard summary view */
          <div className="profile-dashboard-grid">
            
            {/* Main stack details */}
            <div className="profile-main-stack">
              
              {/* Text overview profile parameters */}
              <div className="profile-card">
                <div className="profile-card-header">
                  <h2>Candidate Credentials</h2>
                </div>
                <div className="overview-details-list">
                  <div className="overview-detail-item">
                    <label>Name</label>
                    <span>{profile.parsedData?.name || "N/A"}</span>
                  </div>
                  <div className="overview-detail-item">
                    <label>Email Address</label>
                    <span>{profile.parsedData?.email || "N/A"}</span>
                  </div>
                  <div className="overview-detail-item">
                    <label>Contact Phone</label>
                    <span>{profile.parsedData?.phone || "N/A"}</span>
                  </div>
                  <div className="overview-detail-item">
                    <label>Experience volume</label>
                    <span>{profile.parsedData?.experienceYears || 0} years</span>
                  </div>
                  <div className="overview-detail-item" style={{ gridColumn: "span 2" }}>
                    <label>Matched Classification Role</label>
                    <span>{profile.parsedData?.matchedRole || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Extracted skills pill arrays */}
              <div className="profile-card">
                <div className="profile-card-header">
                  <h2>Extracted Skill Profiles</h2>
                </div>
                <div className="skills-pills-wrap">
                  {profile.parsedData?.skills?.length === 0 ? (
                    <span style={{ color: "#aaa", fontSize: "0.9rem" }}>No skill tags extracted.</span>
                  ) : (
                    profile.parsedData?.skills?.map((skill, idx) => (
                      <span key={idx} className="skill-pill-item">{skill}</span>
                    ))
                  )}
                </div>
              </div>

              {/* Project Highlights list */}
              <div className="profile-card">
                <div className="profile-card-header">
                  <h2>Project Case Studies</h2>
                </div>
                <div>
                  {profile.parsedData?.projects?.length === 0 ? (
                    <span style={{ color: "#aaa", fontSize: "0.9rem" }}>No projects detected.</span>
                  ) : (
                    profile.parsedData?.projects?.map((proj, idx) => (
                      <div key={idx} className="project-highlight-item">
                        {proj}
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

            {/* ATS Score Progress Ring side pane */}
            <div>
              <div className="ats-gauge-card">
                <div className="progress-ring-container">
                  <svg width="160" height="160">
                    <circle
                      className="progress-ring-circle-bg"
                      cx="80"
                      cy="80"
                      r={radius}
                    />
                    <circle
                      className="progress-ring-circle-fill"
                      cx="80"
                      cy="80"
                      r={radius}
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                    />
                  </svg>
                  <div className="progress-ring-text">
                    {profile.atsScore}%
                  </div>
                </div>

                <div className="ats-score-label">ATS Alignment Score</div>
                <p className="ats-description-text">
                  This indicator measures matching ratios between candidate skills and target track expectations 
                  weighted linearly by experience years.
                </p>

                <button 
                  type="button" 
                  className="re-upload-btn"
                  onClick={() => {
                    // Reset selected file and let them change tracks
                    setSelectedFile(null);
                    setHasProfile(false);
                  }}
                >
                  Upload New Resume
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ResumeIntelligence;
