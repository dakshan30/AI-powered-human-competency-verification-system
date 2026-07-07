const User = require("../models/User");
const AuditLog = require("../models/AuditLog");

// Default permission mappings based on platform roles
const defaultRolePermissions = {
  admin: ["manage_users", "manage_settings", "view_reports", "conduct_interviews", "manage_candidates", "view_analytics"],
  recruiter: ["view_reports", "conduct_interviews", "manage_candidates", "view_analytics"],
  manager: ["view_reports", "view_analytics", "approve_decisions"],
  candidate: ["take_interview", "view_results"]
};

/**
 * Fetches platform users matching pagination parameters and status filters.
 * 
 * @param {Object} filters
 * @param {boolean|string} [filters.isActive] - Filter by activity status.
 * @param {string} [filters.role] - Filter by user role.
 * @param {string} [filters.search] - Search text for name/username/email.
 * @param {number|string} [filters.page=1] - Current page number.
 * @param {number|string} [filters.limit=10] - Number of records per page.
 * @returns {Promise<Object>} Users, total counts, current page, and total pages.
 */
exports.getAllUsers = async (filters = {}) => {
  try {
    const query = {};

    // Apply activity state filter
    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive === "true" || filters.isActive === true;
    }

    // Apply role filter
    if (filters.role) {
      query.role = filters.role;
    }

    // Apply global text search
    if (filters.search) {
      const searchRegex = new RegExp(filters.search, "i");
      query.$or = [
        { username: searchRegex },
        { email: searchRegex },
        { name: searchRegex }
      ];
    }

    const page = parseInt(filters.page, 10) || 1;
    const limit = parseInt(filters.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    return {
      users,
      total,
      page,
      pages: Math.ceil(total / limit)
    };
  } catch (error) {
    throw {
      success: false,
      message: `Failed to fetch users: ${error.message}`,
      code: "GET_USERS_ERROR"
    };
  }
};

/**
 * Validates uniqueness, applies role permissions, and registers a new account.
 * 
 * @param {Object} userData
 * @param {string} userData.username - Account username.
 * @param {string} userData.email - Account email.
 * @param {string} userData.password - Account password (unhashed).
 * @param {string} [userData.role="recruiter"] - Account role.
 * @param {string[]} [userData.permissions] - Custom permissions override.
 * @param {boolean} [userData.isActive=true] - Active flag.
 * @returns {Promise<Object>} Newly created user (without password).
 */
exports.createUser = async (userData = {}) => {
  try {
    const { username, email, password, role = "recruiter", permissions, isActive = true } = userData;

    if (!username || !email || !password) {
      throw new Error("Missing required fields: username, email, and password are required.");
    }

    // Check unique constraints
    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username: username.trim() }
      ]
    });

    if (existingUser) {
      throw new Error("A user with this username or email already exists.");
    }

    // Apply default role permissions if not explicitly overridden
    const resolvedPermissions = permissions || defaultRolePermissions[role] || [];

    const user = new User({
      username: username.trim(),
      email: email.toLowerCase(),
      password,
      role,
      permissions: resolvedPermissions,
      isActive
    });

    await user.save();

    const savedUser = user.toObject();
    delete savedUser.password;
    return savedUser;
  } catch (error) {
    throw {
      success: false,
      message: `Failed to create user: ${error.message}`,
      code: "CREATE_USER_ERROR"
    };
  }
};

/**
 * Modifies account parameters including role assignments, custom permissions, and system access status.
 * 
 * @param {string} userId - User identifier.
 * @param {Object} updateData
 * @param {string} [updateData.role] - Modified role.
 * @param {string[]} [updateData.permissions] - Custom permission array overrides.
 * @param {boolean} [updateData.isActive] - System access flag.
 * @returns {Promise<Object>} Updated user profile (without password).
 */
exports.updateUserRoleAndStatus = async (userId, updateData = {}) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Target user account not found.");
    }

    // Change role and apply matching default permissions unless overridden
    if (updateData.role) {
      user.role = updateData.role;
      if (!updateData.permissions) {
        user.permissions = defaultRolePermissions[updateData.role] || [];
      }
    }

    // Explicitly modify permissions
    if (updateData.permissions) {
      user.permissions = updateData.permissions;
    }

    // Change isActive access state
    if (updateData.isActive !== undefined) {
      user.isActive = updateData.isActive === "true" || updateData.isActive === true;
    }

    await user.save();

    const updatedUser = user.toObject();
    delete updatedUser.password;
    return updatedUser;
  } catch (error) {
    throw {
      success: false,
      message: `Failed to update user parameters: ${error.message}`,
      code: "UPDATE_USER_ERROR"
    };
  }
};

/**
 * Fetches structured administrative action logs from the database.
 * 
 * @param {Object} filters
 * @param {string} [filters.adminUserId] - Filter by admin user ID.
 * @param {string} [filters.actionType] - Filter by action.
 * @param {string} [filters.targetId] - Filter by target user ID.
 * @param {number|string} [filters.page=1] - Current page number.
 * @param {number|string} [filters.limit=20] - Records per page.
 * @returns {Promise<Object>} Audit logs, total counts, current page, and total pages.
 */
exports.getSystemAuditLogs = async (filters = {}) => {
  try {
    const query = {};

    if (filters.adminUserId) {
      query.adminUser = filters.adminUserId;
    }

    if (filters.actionType) {
      query.actionType = filters.actionType;
    }

    if (filters.targetId) {
      query.targetId = filters.targetId;
    }

    const page = parseInt(filters.page, 10) || 1;
    const limit = parseInt(filters.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const logs = await AuditLog.find(query)
      .populate("adminUser", "username email name role")
      .populate("targetId", "username email name role")
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    const total = await AuditLog.countDocuments(query);

    return {
      logs,
      total,
      page,
      pages: Math.ceil(total / limit)
    };
  } catch (error) {
    throw {
      success: false,
      message: `Failed to load audit logs: ${error.message}`,
      code: "GET_AUDIT_LOGS_ERROR"
    };
  }
};
