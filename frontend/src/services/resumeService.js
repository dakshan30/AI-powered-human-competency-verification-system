import API from "./api";

/**
 * Uploads candidate resume document (multi-part form binary stream).
 * 
 * @param {FormData} formData - Form containing target tracks and candidate resume file.
 * @returns {Promise<Object>} Response data containing parsed resume metadata.
 */
export const uploadCandidateResume = async (formData) => {
  const response = await API.post("/resume/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return response.data;
};

/**
 * Fetches the active resume profile analysis associated with the candidate.
 * 
 * @returns {Promise<Object>} Response data containing parsed resume detail.
 */
export const fetchActiveProfile = async () => {
  const response = await API.get("/resume/my-profile");
  return response.data;
};

/*
=====================================================
LEGACY ENDPOINTS (BACKWARD COMPATIBILITY)
=====================================================
*/

export const uploadResume = async (formData, onUploadProgress) => {
  const response = await API.post("/resume/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    },
    onUploadProgress
  });
  return response.data;
};