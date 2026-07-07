const express = require("express");
const router = express.Router();
const {
  startSession,
  submitAnswer,
  getSessionDetail,
  listCandidateSessions,
  
  // Admin report view hooks
  getInterview,
  getInterviewReport,
  updateHiringDecision
} = require("../controllers/interviewController");
const { protect } = require("../middleware/authMiddleware");

/*
=====================================================
STATEFUL INTERVIEW ROUTING (JWT SECURED)
=====================================================
*/

// Chain token verification across all interview endpoints
router.use(protect);

// POST /api/interview/start
// Starts a new interview session
router.post("/start", startSession);

// GET /api/interview/my-sessions
// Lists candidate's own sessions
router.get("/my-sessions", listCandidateSessions);

// GET /api/interview/session/:sessionId
// Retrieves active or completed session context details
router.get("/session/:sessionId", getSessionDetail);

// POST /api/interview/session/:sessionId/submit
// Submits a single candidate response and progress index
router.post("/session/:sessionId/submit", submitAnswer);

/*
=====================================================
ADMIN REPORT SYSTEM WORKSPACE ROUTES
=====================================================
*/

// GET /api/interview/:id
// Retrieves report details
router.get("/:id", getInterview);

// GET /api/interview/:id/report
// Report details retrieval
router.get("/:id/report", getInterviewReport);

// PATCH /api/interview/:id/decision
// Hiring decision update route
router.patch("/:id/decision", updateHiringDecision);

module.exports = router;