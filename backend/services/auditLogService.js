const AuditLog = require("../models/AuditLog");

/**
 * Log administrative actions into the database for audit tracking.
 * 
 * @param {string} adminUserId - The user ID of the administrator who performed the action.
 * @param {string} actionType - The type of action (USER_CREATED, ROLE_UPDATED, ACCOUNT_SUSPENDED, etc.).
 * @param {string} [targetId=null] - The ID of the affected user/object.
 * @param {Object} [metadata={}] - Structured logging details.
 * @returns {Promise<Object|null>} Saved AuditLog object or null if recording fails.
 */
exports.logAdminAction = async (adminUserId, actionType, targetId = null, metadata = {}) => {
  try {
    const log = new AuditLog({
      adminUser: adminUserId,
      actionType,
      targetId: targetId || null,
      metadata,
      timestamp: new Date()
    });

    await log.save();
    return log;
  } catch (error) {
    console.error("Audit logging error:", error);
    // Silent fail in production to avoid crashing primary operations
    return null;
  }
};
