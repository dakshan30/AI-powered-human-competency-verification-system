import API from "./api";

/**
 * Fetch database-level dashboard analytics including overview, distributions, and trends.
 * @param {Object} [params] - Filtering coordinates.
 * @param {string} [params.startDate] - ISO date string for start boundary.
 * @param {string} [params.endDate] - ISO date string for end boundary.
 * @param {string} [params.groupBy="monthly"] - Timeline interval group ('weekly' or 'monthly').
 * @returns {Promise<Object>} The analytics payload data.
 */
export const fetchDashboardAnalytics = async (params = {}) => {
  const response = await API.get("/analytics/dashboard", { params });
  return response.data;
};

/**
 * Legacy function for pre-fetched basic analytics.
 * @returns {Promise<Object>}
 */
export const getAnalytics = async () => {
  const response = await API.get("/analytics");
  return response.data;
};