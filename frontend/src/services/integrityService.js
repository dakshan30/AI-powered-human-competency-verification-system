import API from "./api";

/**
 * Registers an active proctoring integrity violation event.
 * 
 * @param {Object} eventData - Form mapping { interviewSessionId, eventType, additionalMeta }.
 * @returns {Promise<Object>} Response payload containing updated risk assessment.
 */
export const logProctoringEvent = async (eventData) => {
  const response = await API.post("/integrity/log-event", eventData);
  return response.data;
};

/**
 * Fetches anti-cheat logging summaries associated with an active interview session.
 * 
 * @param {string} sessionId - The specific target interview session Identifier.
 * @returns {Promise<Object>} Response payload containing proctoring metrics.
 */
export const fetchSessionIntegrityProfile = async (sessionId) => {
  const response = await API.get(`/integrity/session/${sessionId}`);
  return response.data;
};

/*
=====================================================
LEGACY ENDPOINTS (BACKWARD COMPATIBILITY)
=====================================================
*/

export const logIntegrityEvent = async (payload) => {
  const response = await API.post("/integrity/log", payload);
  return response.data;
};