import React from "react";

const UploadProgress = ({
  progress,
}) => {
  return (
    <div className="upload-progress">
      <div className="upload-progress-top">
        <span>
          Uploading Resume
        </span>

        <span>
          {progress}%
        </span>
      </div>

      <div className="upload-progress-bar">
        <div
          className="upload-progress-fill"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  );
};

export default UploadProgress;