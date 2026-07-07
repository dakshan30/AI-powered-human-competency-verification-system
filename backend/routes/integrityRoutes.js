const express = require("express");
const router = express.Router();
const {
  recordViolationEvent,
  getSessionIntegrityProfile
} = require("../controllers/integrityController");
const { protect } = require("../middleware/authMiddleware");

/*
=====================================================
PROC-TORING TELEMETRY ROUTING SYSTEM (JWT SECURED)
=====================================================
*/

// Chain token authorization across all proctoring endpoints
router.use(protect);

// POST /api/integrity/log-event
// Ingests real-time browser/telemetry validation violations
router.post("/log-event", recordViolationEvent);

// GET /api/integrity/session/:sessionId
// Fetches session anti-cheat logging reports (requires administrative credentials)
router.get("/session/:sessionId", getSessionIntegrityProfile);

module.exports = router;