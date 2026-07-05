import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/dashboard/shared/DashboardLayout";
import SectionHeader from "../../components/dashboard/shared/SectionHeader";
import GlassCard from "../../components/dashboard/shared/GlassCard";
import DragDropUpload from "../../components/upload/DragDropUpload";
import UploadProgress from "../../components/upload/UploadProgress";
import { uploadResume } from "../../services/resumeService";

const UploadResume = () => {
  /*
  ====================================
  NAVIGATION
  ====================================
  */
  const navigate = useNavigate();

  /*
  ====================================
  STATES
  ====================================
  */
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  /*
  ====================================
  HANDLE FILE
  ====================================
  */
  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
  };

  /*
  ====================================
  HANDLE UPLOAD
  ====================================
  */
  const handleUpload =
  async () => {
    try {
      if (!file) {
        return toast.error(
          "Please select a resume"
        );
      }

      setLoading(true);

      const formData =
        new FormData();

      formData.append(
        "resume",
        file
      );

      const response =
        await uploadResume(
          formData,
          (progressEvent) => {
            const percent =
              Math.round(
                (progressEvent.loaded *
                  100) /
                  progressEvent.total
              );

            setProgress(percent);
          }
        );

      console.log(
        "UPLOAD RESPONSE:",
        response
      );

      /*
      SUCCESS VALIDATION
      */

      if (
        !response.success
      ) {
        throw new Error(
          "Upload failed"
        );
      }

      /*
      INTERVIEW ID
      */

      const interviewId =
        response.interviewId;

      if (!interviewId) {
        throw new Error(
          "Interview ID missing"
        );
      }

      toast.success(
        "Resume uploaded successfully"
      );

      /*
      NAVIGATE
      */

      setTimeout(() => {
        window.location.href =
          `/candidate/interview/${interviewId}`;
      }, 1000);

    } catch (error) {
      console.log(error);

      toast.error(
        error?.response?.data
          ?.message ||
          error.message ||
          "Upload failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <SectionHeader
        title="Resume Upload"
        subtitle="Upload your resume for AI-powered competency analysis."
      />

      <GlassCard>
        <DragDropUpload onFileSelect={handleFileSelect} />

        {file && (
          <div className="selected-file">
            <h4>Selected File</h4>
            <p>{file.name}</p>
          </div>
        )}

        {loading && <UploadProgress progress={progress} />}

        <button
          className="upload-btn"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload Resume"}
        </button>
      </GlassCard>
    </DashboardLayout>
  );
};

export default UploadResume;