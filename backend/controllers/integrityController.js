const IntegrityLog = require("../models/IntegrityLog");

/*
=====================================================
NEW PROC-TORING TELEMETRY EVENT HANDLERS (PHASE 6)
=====================================================
*/

/**
 * POST /api/integrity/log-event
 * Registers a candidate proctoring event and updates risk levels dynamically.
 */
exports.recordViolationEvent = async (req, res) => {
  try {
    const { interviewSessionId, eventType, additionalMeta } = req.body;

    if (!interviewSessionId || !eventType) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters: interviewSessionId and eventType are required.",
        code: "MISSING_PARAMETERS"
      });
    }

    // Retrieve or initialize the session's proctoring log
    let integrityLog = await IntegrityLog.findOne({ interviewSessionId });
    if (!integrityLog) {
      integrityLog = new IntegrityLog({
        interviewSessionId,
        candidateId: req.user._id,
        violations: []
      });
    }

    // Record the telemetry violation event
    integrityLog.violations.push({
      eventType,
      additionalMeta: additionalMeta || {},
      timestamp: new Date()
    });

    // Dynamically calculate and scale proctoring Risk Level
    const totalViolations = integrityLog.violations.length;
    if (totalViolations >= 8) {
      integrityLog.riskLevel = "CRITICAL";
    } else if (totalViolations >= 5) {
      integrityLog.riskLevel = "HIGH";
    } else if (totalViolations >= 3) {
      integrityLog.riskLevel = "MEDIUM";
    } else {
      integrityLog.riskLevel = "LOW";
    }

    // Update legacy status markers for backwards compatibility
    if (totalViolations >= 5) {
      integrityLog.status = "suspicious";
    } else if (totalViolations >= 3) {
      integrityLog.status = "warning";
    } else {
      integrityLog.status = "safe";
    }
    integrityLog.riskScore = totalViolations * 12.5; // Scale to 100 max

    await integrityLog.save();

    return res.status(200).json({
      success: true,
      message: "Proctoring telemetry event logged successfully.",
      data: {
        riskLevel: integrityLog.riskLevel,
        violationsCount: totalViolations,
        status: integrityLog.status
      }
    });

  } catch (error) {
    console.error("Record Violation Event controller error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to record proctoring telemetry event.",
      code: "LOG_EVENT_ERROR"
    });
  }
};

/**
 * GET /api/integrity/session/:sessionId
 * Retrieves log summaries for administrators, recruiters, or managers.
 */
exports.getSessionIntegrityProfile = async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Enforce strict administrative role credentials checks
    const hasAccessRole = ["admin", "recruiter", "manager"].includes(req.user.role);
    if (!hasAccessRole) {
      return res.status(403).json({
        success: false,
        message: "Permission denied: Insufficient access credentials to view integrity profiles.",
        code: "FORBIDDEN_INTEGRITY_ACCESS"
      });
    }

    const log = await IntegrityLog.findOne({ interviewSessionId: sessionId })
      .populate("candidateId", "username email name role");

    if (!log) {
      return res.status(404).json({
        success: false,
        message: "No proctoring integrity log profile found for this session.",
        code: "LOG_NOT_FOUND"
      });
    }

    return res.status(200).json({
      success: true,
      data: log
    });

  } catch (error) {
    console.error("Get Session Integrity Profile controller error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve session integrity profile.",
      code: "GET_INTEGRITY_PROFILE_ERROR"
    });
  }
};