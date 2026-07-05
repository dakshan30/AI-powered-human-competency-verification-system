import React from "react";

import {
  FaCloudUploadAlt,
} from "react-icons/fa";

const DragDropUpload = ({
  onFileSelect,
}) => {
  const handleFileChange = (
    e
  ) => {
    const file =
      e.target.files[0];

    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="drag-drop-upload">
      <FaCloudUploadAlt />

      <h3>
        Drag & Drop Resume
      </h3>

      <p>
        Upload PDF or DOCX
      </p>

      <input
        type="file"
        accept=".pdf,.docx"
        onChange={
          handleFileChange
        }
      />
    </div>
  );
};

export default DragDropUpload;