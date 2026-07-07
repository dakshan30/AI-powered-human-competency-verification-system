const InterviewSession = require("../models/InterviewSession");
const Interview = require("../models/Interview");
const interviewService = require("../services/interviewService");

/*
=====================================================
NEW STATEFUL INTERVIEW SESSION CONTROLLERS (PHASE 4)
=====================================================
*/

/**
 * POST /api/interview/start
 * Initializes a new stateful interview session for a candidate.
 */
exports.startSession = async (req, res) => {
  try {
    const { questionCount } = req.body;

    const session = await interviewService.initializeResumeDrivenSession(
      req.user._id,
      questionCount
    );

    return res.status(201).json({
      success: true,
      message: "Interview session initialized successfully based on resume credentials.",
      data: session
    });
  } catch (error) {
    console.error("Start Session controller error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to initialize interview session.",
      code: error.code || "START_SESSION_ERROR"
    });
  }
};

/**
 * POST /api/interview/session/:sessionId/submit
 * Captures candidate answer, evaluates it using AI, and increments session index.
 */
exports.submitAnswer = async (req, res) => {
  try {
    const sessionId = req.params.sessionId || req.params.interviewId;
    const { answer } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Interview session ID parameter is required.",
        code: "MISSING_SESSION_ID"
      });
    }

    const session = await InterviewSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Interview session not found.",
        code: "SESSION_NOT_FOUND"
      });
    }

    // Verify requesting candidate owns the session
    if (session.candidateId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Permission denied: You do not own this interview session.",
        code: "FORBIDDEN_SESSION_ACCESS"
      });
    }

    const updatedSession = await interviewService.submitAnswerAndProgress(sessionId, answer);

    return res.status(200).json({
      success: true,
      message: "Answer submitted and evaluated successfully.",
      data: updatedSession
    });
  } catch (error) {
    console.error("Submit Answer controller error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to submit interview answer.",
      code: error.code || "SUBMIT_ANSWER_ERROR"
    });
  }
};

/**
 * GET /api/interview/session/:sessionId
 * Retrieves detailed session context for owners, admins, or recruiters.
 */
exports.getSessionDetail = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Interview session ID parameter is required.",
        code: "MISSING_SESSION_ID"
      });
    }

    const session = await InterviewSession.findById(sessionId)
      .populate("candidateId", "username email name role");

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Interview session not found.",
        code: "SESSION_NOT_FOUND"
      });
    }

    // Enforce ownership or administrative credentials checks
    const isOwner = session.candidateId._id.toString() === req.user._id.toString();
    const hasAccessRole = ["admin", "recruiter"].includes(req.user.role);

    if (!isOwner && !hasAccessRole) {
      return res.status(403).json({
        success: false,
        message: "Permission denied: Insufficient credentials to view this session.",
        code: "FORBIDDEN_SESSION_ACCESS"
      });
    }

    return res.status(200).json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error("Get Session Detail controller error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch interview session details.",
      code: error.code || "GET_SESSION_ERROR"
    });
  }
};

/**
 * GET /api/interview/my-sessions
 * Fetches all past and present sessions matching the current candidate.
 */
exports.listCandidateSessions = async (req, res) => {
  try {
    const sessions = await InterviewSession.find({ candidateId: req.user._id })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: sessions
    });
  } catch (error) {
    console.error("List Candidate Sessions controller error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve candidate interview sessions.",
      code: error.code || "LIST_SESSIONS_ERROR"
    });
  }
};

/*
=====================================================
ADMIN/REPORTS RUNTIME ACCESS ENDPOINTS
=====================================================
*/

exports.getInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found"
      });
    }

    if (interview.candidate.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access"
      });
    }

    return res.status(200).json({
      success: true,
      data: interview
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Interview fetch failed",
      error: error.message
    });
  }
};

exports.getInterviewReport = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id).populate("candidate");
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found"
      });
    }
    return res.json({
      success: true,
      data: interview
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateHiringDecision = async (req, res) => {
  try {
    const { status, comments } = req.body;
    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found"
      });
    }

    interview.decision = {
      status,
      comments,
      decidedBy: req.user.id,
      decidedAt: new Date()
    };

    await interview.save();
    return res.json({
      success: true,
      message: "Hiring decision saved successfully",
      data: interview.decision
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};