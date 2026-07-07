const express = require("express");
const router = express.Router();
const {
  listUsers,
  createPlatformUser,
  updateUserStatus,
  listAuditLogs
} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

/*
====================================
ADMIN PANEL ROUTING (SECURE RBAC)
====================================
*/

// Chain standard JWT protection and strict Admin role checks for all admin endpoints
router.use(protect);
router.use(authorize("admin"));

// GET /api/admin/users
// Fetch and filter platform user accounts
router.get("/users", listUsers);

// POST /api/admin/users
// Create new administrative or operational platform users
router.post("/users", createPlatformUser);

// PUT /api/admin/users/:userId
// Modify role, permissions, or system access status of user accounts
router.put("/users/:userId", updateUserStatus);

// GET /api/admin/audit-logs
// Retrieve admin actions and changes audit log feed
router.get("/audit-logs", listAuditLogs);

module.exports = router;
