import React, { useEffect, useState } from "react";
import { 
  FaUsers, 
  FaShieldAlt, 
  FaPlus, 
  FaSearch, 
  FaBan, 
  FaCheck, 
  FaAngleLeft, 
  FaAngleRight,
  FaSyncAlt
} from "react-icons/fa";

import DashboardLayout from "../../components/dashboard/shared/DashboardLayout";
import { 
  fetchUsers, 
  createPlatformUser, 
  updateUserStatus, 
  fetchAuditLogs 
} from "../../services/adminService";
import "../../styles/admin.css";

const defaultRolePermissions = {
  admin: ["manage_users", "manage_settings", "view_reports", "conduct_interviews", "manage_candidates", "view_analytics"],
  recruiter: ["view_reports", "conduct_interviews", "manage_candidates", "view_analytics"],
  manager: ["view_reports", "view_analytics", "approve_decisions"],
  candidate: ["take_interview", "view_results"]
};

const allPermissionsList = [
  "manage_users",
  "manage_settings",
  "view_reports",
  "conduct_interviews",
  "manage_candidates",
  "view_analytics",
  "approve_decisions",
  "take_interview",
  "view_results"
];

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Users Tab State
  const [users, setUsers] = useState([]);
  const [usersTotal, setUsersTotal] = useState(0);
  const [usersPage, setUsersPage] = useState(1);
  const [usersLimit] = useState(10);
  const [usersPages, setUsersPages] = useState(1);
  const [searchUser, setSearchUser] = useState("");
  const [roleUserFilter, setRoleUserFilter] = useState("");
  const [statusUserFilter, setStatusUserFilter] = useState("");

  // Audit Logs Tab State
  const [logs, setLogs] = useState([]);
  const [logsTotal, setLogsTotal] = useState(0);
  const [logsPage, setLogsPage] = useState(1);
  const [logsLimit] = useState(15);
  const [logsPages, setLogsPages] = useState(1);
  const [actionLogFilter, setActionLogFilter] = useState("");

  // Modal / Form Registration State
  const [modalOpen, setModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("recruiter");
  const [newPermissions, setNewPermissions] = useState(defaultRolePermissions.recruiter);

  // Trigger auto-dismiss alert notifications
  const triggerAlert = (message, type = "success") => {
    if (type === "success") {
      setSuccessMessage(message);
      setError("");
      setTimeout(() => setSuccessMessage(""), 4000);
    } else {
      setError(message);
      setSuccessMessage("");
      setTimeout(() => setError(""), 5000);
    }
  };

  // Load user records
  const loadUsers = async (pageNumber = 1) => {
    try {
      setLoading(true);
      setError("");
      const params = {
        page: pageNumber,
        limit: usersLimit,
        search: searchUser,
        role: roleUserFilter || undefined,
        isActive: statusUserFilter !== "" ? statusUserFilter : undefined
      };
      const response = await fetchUsers(params);
      if (response && response.success) {
        setUsers(response.data.users);
        setUsersTotal(response.data.total);
        setUsersPage(response.data.page);
        setUsersPages(response.data.pages);
      }
    } catch (err) {
      console.error(err);
      triggerAlert(err.message || "Failed to load platform user accounts", "error");
    } finally {
      setLoading(false);
    }
  };

  // Load audit records
  const loadAuditLogs = async (pageNumber = 1) => {
    try {
      setLoading(true);
      setError("");
      const params = {
        page: pageNumber,
        limit: logsLimit,
        actionType: actionLogFilter || undefined
      };
      const response = await fetchAuditLogs(params);
      if (response && response.success) {
        setLogs(response.data.logs);
        setLogsTotal(response.data.total);
        setLogsPage(response.data.page);
        setLogsPages(response.data.pages);
      }
    } catch (err) {
      console.error(err);
      triggerAlert(err.message || "Failed to load system audit trails", "error");
    } finally {
      setLoading(false);
    }
  };

  // Trigger reload on filters/tab adjustments
  useEffect(() => {
    if (activeTab === "users") {
      loadUsers(1);
    } else {
      loadAuditLogs(1);
    }
  }, [activeTab, roleUserFilter, statusUserFilter, actionLogFilter]);

  // Adjust preselected checkboxes on role selections
  const handleRoleChangeInForm = (role) => {
    setNewRole(role);
    setNewPermissions(defaultRolePermissions[role] || []);
  };

  // Toggle checklist parameters
  const handlePermissionToggle = (permission) => {
    if (newPermissions.includes(permission)) {
      setNewPermissions(newPermissions.filter(p => p !== permission));
    } else {
      setNewPermissions([...newPermissions, permission]);
    }
  };

  // Create User Account Request Action
  const handleCreateUserSubmit = async (e) => {
    e.preventDefault();
    if (!newUsername.trim() || !newEmail.trim() || !newPassword) {
      triggerAlert("Please enter all required username, email, and password details.", "error");
      return;
    }

    try {
      setLoading(true);
      const response = await createPlatformUser({
        username: newUsername.trim(),
        email: newEmail.trim(),
        password: newPassword,
        role: newRole,
        permissions: newPermissions
      });

      if (response && response.success) {
        triggerAlert(`Account for user '${newUsername}' registered successfully!`);
        // Reset state
        setNewUsername("");
        setNewEmail("");
        setNewPassword("");
        setNewRole("recruiter");
        setNewPermissions(defaultRolePermissions.recruiter);
        setModalOpen(false);
        // Refresh users
        loadUsers(1);
      }
    } catch (err) {
      console.error(err);
      triggerAlert(err.message || "User creation failed", "error");
    } finally {
      setLoading(false);
    }
  };

  // Quick Inline Role update action
  const handleInlineRoleUpdate = async (userId, targetRole) => {
    try {
      setLoading(true);
      const response = await updateUserStatus(userId, {
        role: targetRole
      });
      if (response && response.success) {
        triggerAlert("User role updated successfully.");
        loadUsers(usersPage);
      }
    } catch (err) {
      console.error(err);
      triggerAlert(err.message || "Failed to update user role", "error");
    } finally {
      setLoading(false);
    }
  };

  // Quick Inline Status Suspend/Activate action
  const handleInlineStatusToggle = async (userId, currentActiveState) => {
    const targetState = !currentActiveState;
    try {
      setLoading(true);
      const response = await updateUserStatus(userId, {
        isActive: targetState
      });
      if (response && response.success) {
        const msg = targetState ? "User account activated successfully." : "User account suspended successfully.";
        triggerAlert(msg);
        loadUsers(usersPage);
      }
    } catch (err) {
      console.error(err);
      triggerAlert(err.message || "Failed to toggle account access state", "error");
    } finally {
      setLoading(false);
    }
  };

  // Pagination navigation helpers
  const handlePrevPage = () => {
    if (activeTab === "users" && usersPage > 1) {
      loadUsers(usersPage - 1);
    } else if (activeTab === "logs" && logsPage > 1) {
      loadAuditLogs(logsPage - 1);
    }
  };

  const handleNextPage = () => {
    if (activeTab === "users" && usersPage < usersPages) {
      loadUsers(usersPage + 1);
    } else if (activeTab === "logs" && logsPage < logsPages) {
      loadAuditLogs(logsPage + 1);
    }
  };

  return (
    <DashboardLayout>
      <div className="admin-panel-container">
        
        {/* Module Header */}
        <div className="admin-header">
          <div className="admin-title-section">
            <h1>Administration Center</h1>
            <p>Configure user roles, platform access guidelines, and track system changes.</p>
          </div>
          {activeTab === "users" && (
            <button 
              type="button"
              className="admin-action-btn"
              onClick={() => setModalOpen(true)}
            >
              <FaPlus /> Create User
            </button>
          )}
        </div>

        {/* Global Notification Alerts */}
        {successMessage && (
          <div className="admin-alert admin-alert--success">
            <FaCheck /> <p>{successMessage}</p>
          </div>
        )}
        {error && (
          <div className="admin-alert admin-alert--error">
            <FaBan /> <p>{error}</p>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="admin-tabs">
          <button 
            type="button"
            className={`admin-tab ${activeTab === "users" ? "admin-tab--active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            <FaUsers /> User Accounts ({usersTotal})
          </button>
          <button 
            type="button"
            className={`admin-tab ${activeTab === "logs" ? "admin-tab--active" : ""}`}
            onClick={() => setActiveTab("logs")}
          >
            <FaShieldAlt /> System Audits
          </button>
        </div>

        {/* Tab 1: User Management Panel Workspace */}
        {activeTab === "users" && (
          <>
            {/* Search and Filters Bar */}
            <div className="admin-search-bar">
              <div className="admin-search-input-group">
                <FaSearch className="admin-search-icon" />
                <input 
                  type="text" 
                  placeholder="Search by username, email or name..." 
                  className="admin-search-input"
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                />
              </div>

              <select 
                className="admin-filter-select"
                value={roleUserFilter}
                onChange={(e) => setRoleUserFilter(e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="recruiter">Recruiter</option>
                <option value="manager">Manager</option>
                <option value="candidate">Candidate</option>
              </select>

              <select 
                className="admin-filter-select"
                value={statusUserFilter}
                onChange={(e) => setStatusUserFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="true">Active Only</option>
                <option value="false">Suspended Only</option>
              </select>

              <button 
                type="button" 
                className="admin-reset-btn" 
                onClick={() => loadUsers(1)}
                style={{ height: "38px", margin: 0 }}
              >
                Filter
              </button>
            </div>

            {/* User Table Grid */}
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User Detail</th>
                    <th>System Role</th>
                    <th>Permissions Count</th>
                    <th>Access State</th>
                    <th>Quick Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center", padding: "3rem" }}>
                        No platform user accounts matched your search configurations.
                      </td>
                    </tr>
                  ) : (
                    users.map((item) => (
                      <tr key={item._id}>
                        {/* Detail Badges */}
                        <td>
                          <div className="user-info-badge">
                            <div className="user-avatar-circle">
                              {item.username.charAt(0)}
                            </div>
                            <div className="user-info-details">
                              <strong>{item.name || item.username}</strong>
                              <span>{item.email}</span>
                            </div>
                          </div>
                        </td>
                        {/* Role */}
                        <td>
                          <span className={`role-badge role-badge--${item.role}`}>
                            {item.role}
                          </span>
                        </td>
                        {/* Permissions Array count */}
                        <td>{item.permissions?.length || 0} enabled</td>
                        {/* Access State Pill */}
                        <td>
                          <span className={`status-pill status-pill--${item.isActive ? "active" : "suspended"}`}>
                            {item.isActive ? "Active" : "Suspended"}
                          </span>
                        </td>
                        {/* Quick Actions Inline Toggles */}
                        <td>
                          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                            <select
                              value={item.role}
                              className="inline-role-select"
                              onChange={(e) => handleInlineRoleUpdate(item._id, e.target.value)}
                              disabled={loading}
                            >
                              <option value="admin">Admin</option>
                              <option value="recruiter">Recruiter</option>
                              <option value="manager">Manager</option>
                              <option value="candidate">Candidate</option>
                            </select>

                            <button
                              type="button"
                              className={`toggle-status-btn ${item.isActive ? "toggle-status-btn--suspend" : "toggle-status-btn--activate"}`}
                              onClick={() => handleInlineStatusToggle(item._id, item.isActive)}
                              disabled={loading}
                            >
                              {item.isActive ? "Suspend" : "Activate"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {usersPages > 1 && (
              <div className="admin-pagination">
                <span className="admin-pagination-info">
                  Showing Page {usersPage} of {usersPages} ({usersTotal} users)
                </span>
                <button 
                  type="button"
                  className="admin-pagination-btn"
                  onClick={handlePrevPage}
                  disabled={usersPage === 1 || loading}
                >
                  <FaAngleLeft />
                </button>
                <button 
                  type="button"
                  className="admin-pagination-btn"
                  onClick={handleNextPage}
                  disabled={usersPage === usersPages || loading}
                >
                  <FaAngleRight />
                </button>
              </div>
            )}
          </>
        )}

        {/* Tab 2: Security Audit Log Feed Viewer Workspace */}
        {activeTab === "logs" && (
          <>
            {/* Logs Filter bar */}
            <div className="admin-search-bar">
              <select
                className="admin-filter-select"
                value={actionLogFilter}
                onChange={(e) => setActionLogFilter(e.target.value)}
              >
                <option value="">All Action Types</option>
                <option value="USER_CREATED">User Created</option>
                <option value="ROLE_UPDATED">Role Updated</option>
                <option value="ACCOUNT_SUSPENDED">Account Suspended</option>
                <option value="ACCOUNT_ACTIVATED">Account Activated</option>
              </select>

              <button
                type="button"
                className="admin-reset-btn"
                onClick={() => loadAuditLogs(1)}
                style={{ height: "38px", margin: 0 }}
              >
                Filter Feed
              </button>
            </div>

            {/* Audit Log Table */}
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Administrator</th>
                    <th>Action</th>
                    <th>Target Subject</th>
                    <th>Metadata Context</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center", padding: "3rem" }}>
                        No changes audit logs were recorded matching current settings.
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log._id}>
                        {/* Timestamp */}
                        <td>{new Date(log.timestamp).toLocaleString()}</td>
                        {/* Admin */}
                        <td>
                          <strong>{log.adminUser?.username || "System"}</strong>
                          <span style={{ fontSize: "0.75rem", color: "#888", display: "block" }}>
                            {log.adminUser?.email || ""}
                          </span>
                        </td>
                        {/* Action Type */}
                        <td>
                          <span className={`audit-log-action audit-log-action--${log.actionType}`}>
                            {log.actionType}
                          </span>
                        </td>
                        {/* Target user */}
                        <td>
                          {log.targetId ? (
                            <>
                              <strong>{log.targetId?.username}</strong>
                              <span style={{ fontSize: "0.75rem", color: "#888", display: "block" }}>
                                {log.targetId?.role}
                              </span>
                            </>
                          ) : (
                            <span style={{ color: "#aaa" }}>N/A</span>
                          )}
                        </td>
                        {/* Metadata Box */}
                        <td>
                          <div className="audit-metadata-box">
                            {JSON.stringify(log.metadata || {})}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Logs Pagination Controls */}
            {logsPages > 1 && (
              <div className="admin-pagination">
                <span className="admin-pagination-info">
                  Showing Page {logsPage} of {logsPages} ({logsTotal} logs)
                </span>
                <button 
                  type="button"
                  className="admin-pagination-btn"
                  onClick={handlePrevPage}
                  disabled={logsPage === 1 || loading}
                >
                  <FaAngleLeft />
                </button>
                <button 
                  type="button"
                  className="admin-pagination-btn"
                  onClick={handleNextPage}
                  disabled={logsPage === logsPages || loading}
                >
                  <FaAngleRight />
                </button>
              </div>
            )}
          </>
        )}

        {/* Stateful Registration Dialog Modal Box Overlay */}
        {modalOpen && (
          <div className="admin-modal-overlay">
            <div className="admin-modal-container">
              <div className="admin-modal-header">
                <h3>Create New User Account</h3>
                <button 
                  type="button" 
                  className="admin-close-modal-btn"
                  onClick={() => setModalOpen(false)}
                >
                  &times;
                </button>
              </div>
              <form onSubmit={handleCreateUserSubmit}>
                <div className="admin-modal-body">
                  <div className="admin-form-group">
                    <label>Username *</label>
                    <input 
                      type="text" 
                      className="admin-form-input" 
                      placeholder="e.g. jdoe"
                      required
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Email Address *</label>
                    <input 
                      type="email" 
                      className="admin-form-input" 
                      placeholder="e.g. jdoe@company.com"
                      required
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Profile Role *</label>
                    <select 
                      className="admin-form-input"
                      value={newRole}
                      onChange={(e) => handleRoleChangeInForm(e.target.value)}
                    >
                      <option value="admin">Admin</option>
                      <option value="recruiter">Recruiter</option>
                      <option value="manager">Manager</option>
                      <option value="candidate">Candidate</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label>Temporary Account Password *</label>
                    <input 
                      type="password" 
                      className="admin-form-input" 
                      placeholder="Minimum 6 characters"
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>

                  {/* Customizable permissions check grid */}
                  <div className="admin-form-group">
                    <label>Custom Permissions Set Mapping</label>
                    <div className="permissions-grid-section">
                      <div className="permissions-grid-title">Select allowed platform actions</div>
                      <div className="permissions-checkbox-list">
                        {allPermissionsList.map((perm) => (
                          <label key={perm} className="permission-checkbox-label">
                            <input 
                              type="checkbox"
                              checked={newPermissions.includes(perm)}
                              onChange={() => handlePermissionToggle(perm)}
                            />
                            {perm.split("_").join(" ")}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="admin-modal-footer">
                  <button 
                    type="button" 
                    className="admin-btn-secondary"
                    onClick={() => setModalOpen(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="admin-action-btn"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Save Account"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminPanel;
