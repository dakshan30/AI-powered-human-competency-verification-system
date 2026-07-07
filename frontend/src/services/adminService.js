import API from "./api";

/**
 * Fetch platform user accounts with queries for pagination, searching, and filtering.
 * 
 * @param {Object} [params] - Query options (search, role, isActive, page, limit).
 * @returns {Promise<Object>} Axios response JSON.
 */
export const fetchUsers = async (params = {}) => {
  const response = await API.get("/admin/users", { params });
  return response.data;
};

/**
 * Create a new administrative or operational platform user account.
 * 
 * @param {Object} userData - User profile details (username, email, password, role, permissions).
 * @returns {Promise<Object>} Axios response JSON.
 */
export const createPlatformUser = async (userData) => {
  const response = await API.post("/admin/users", userData);
  return response.data;
};

/**
 * Modifies parameters of an existing user account (status toggles or role changes).
 * 
 * @param {string} userId - Affected user identifier.
 * @param {Object} updateData - Values to update (role, permissions, isActive).
 * @returns {Promise<Object>} Axios response JSON.
 */
export const updateUserStatus = async (userId, updateData) => {
  const response = await API.put(`/admin/users/${userId}`, updateData);
  return response.data;
};

/**
 * Retrieve Platform Administrative Audit Log Feed logs.
 * 
 * @param {Object} [params] - Query filters (adminUserId, actionType, targetId, page, limit).
 * @returns {Promise<Object>} Axios response JSON.
 */
export const fetchAuditLogs = async (params = {}) => {
  const response = await API.get("/admin/audit-logs", { params });
  return response.data;
};
