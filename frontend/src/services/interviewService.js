import API from "./api";

/*
=====================================================
NEW STATEFUL INTERVIEW SESSION ENDPOINTS (PHASE 4)
=====================================================
*/

/**
 * Initializes a new stateful interview session.
 * 
 * @param {string} category - Skill track (e.g. Backend, Frontend).
 * @param {number} [questionCount=5] - Number of questions to pull.
 * @returns {Promise<Object>} Response data containing initialized session.
 */
export const startInterviewSession = async (category, questionCount = 5) => {
  const response = await API.post("/interview/start", { category, questionCount });
  return response.data;
};

/**
 * Fetches the active or completed session context details.
 * 
 * @param {string} sessionId - Interview session ID.
 * @returns {Promise<Object>} Response data containing session details.
 */
export const fetchSessionDetails = async (sessionId) => {
  const response = await API.get(`/interview/session/${sessionId}`);
  return response.data;
};

/**
 * Submits candidate's answer for the current index and progresses session.
 * 
 * @param {string} sessionId - Interview session ID.
 * @param {string} answer - Text answer content.
 * @returns {Promise<Object>} Response data containing updated session.
 */
export const submitInterviewAnswer = async (sessionId, answer) => {
  const response = await API.post(`/interview/session/${sessionId}/submit`, { answer });
  return response.data;
};

/**
 * Fetches all past and present sessions matching the current candidate.
 * 
 * @returns {Promise<Object>} Response data containing session lists.
 */
export const fetchMySessions = async () => {
  const response = await API.get("/interview/my-sessions");
  return response.data;
};

/*
=====================================================
LEGACY ENDPOINTS (BACKWARD COMPATIBILITY)
=====================================================
*/

export const getInterview = async (interviewId) => {
  try {
    const response = await API.get(`/interview/${interviewId}`);
    return response.data;
  } catch (error) {
    console.log(
      "Get Interview Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getInterviewReport = async (interviewId) => {
  try {
    const response = await API.get(`/interview/${interviewId}/report`);
    return response.data;
  } catch (error) {
    console.log(
      "Get Interview Report Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const submitAnswer = async (interviewId, payload) => {
  try {
    const response = await API.post(`/interview/submit/${interviewId}`, payload);
    return response.data;
  } catch (error) {
    console.log(
      "Submit Answer Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateDecision = async (interviewId, decisionData) => {
  const response = await API.patch(`/interview/${interviewId}/decision`, decisionData);
  return response.data;
};
