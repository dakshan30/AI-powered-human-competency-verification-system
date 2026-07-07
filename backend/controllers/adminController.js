const adminService = require("../services/adminService");
const auditLogService = require("../services/auditLogService");

/**
 * GET /api/admin/users
 * Lists platform users with query coordinates.
 */
exports.listUsers = async (req, res) => {
  try {
    const { search, role, isActive, page, limit } = req.query;

    const result = await adminService.getAllUsers({
      search,
      role,
      isActive,
      page,
      limit
    });

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error("List users controller error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve platform users.",
      code: error.code || "LIST_USERS_ERROR"
    });
  }
};

/**
 * POST /api/admin/users
 * Registers a new system user and logs the USER_CREATED action.
 */
exports.createPlatformUser = async (req, res) => {
  try {
    const { username, email, password, role, permissions, isActive } = req.body;

    const newUser = await adminService.createUser({
      username,
      email,
      password,
      role,
      permissions,
      isActive
    });

    // Log the administrative action
    await auditLogService.logAdminAction(
      req.user._id,
      "USER_CREATED",
      newUser._id,
      { username: newUser.username, role: newUser.role }
    );

    return res.status(201).json({
      success: true,
      message: "User account created successfully.",
      data: newUser
    });
  } catch (error) {
    console.error("Create platform user controller error:", error);
    const status = error.code === "CREATE_USER_ERROR" ? 400 : 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Failed to create platform user account.",
      code: error.code || "CREATE_USER_ERROR"
    });
  }
};

/**
 * PUT /api/admin/users/:userId
 * Modifies account status or role and logs USER_UPDATED, ACCOUNT_SUSPENDED, or ACCOUNT_ACTIVATED.
 */
exports.updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role, permissions, isActive } = req.body;

    const updatedUser = await adminService.updateUserRoleAndStatus(userId, {
      role,
      permissions,
      isActive
    });

    // Determine the type of audit log based on the modified properties
    let actionType = "ROLE_UPDATED";
    if (isActive !== undefined) {
      actionType = (isActive === true || isActive === "true")
        ? "ACCOUNT_ACTIVATED"
        : "ACCOUNT_SUSPENDED";
    }

    // Log the administrative update action
    await auditLogService.logAdminAction(
      req.user._id,
      actionType,
      updatedUser._id,
      { role: updatedUser.role, isActive: updatedUser.isActive }
    );

    return res.status(200).json({
      success: true,
      message: "User account parameters updated successfully.",
      data: updatedUser
    });
  } catch (error) {
    console.error("Update user status controller error:", error);
    const status = error.code === "UPDATE_USER_ERROR" ? 400 : 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Failed to update platform user parameters.",
      code: error.code || "UPDATE_USER_ERROR"
    });
  }
};

/**
 * GET /api/admin/audit-logs
 * Lists administrative system change audit logs.
 */
exports.listAuditLogs = async (req, res) => {
  try {
    const { adminUserId, actionType, targetId, page, limit } = req.query;

    const result = await adminService.getSystemAuditLogs({
      adminUserId,
      actionType,
      targetId,
      page,
      limit
    });

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error("List audit logs controller error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve administrative audit logs.",
      code: error.code || "LIST_AUDIT_LOGS_ERROR"
    });
  }
};
