const express = require("express");
const router = express.Router();
const uploadMiddleware = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");
const { uploadAndParseResume, getCandidateProfile } = require("../controllers/resumeController");

/*
=====================================================
RESUME INTELLIGENCE ROUTING SYSTEM (JWT & MUTTER LOCKED)
=====================================================
*/

// Chain token authorization across all pipeline handles
router.use(protect);

// POST /api/resume/upload
// Ingests single data form binary fields attached under key namespace "resume"
router.post("/upload", uploadMiddleware.single("resume"), uploadAndParseResume);

// GET /api/resume/my-profile
// Fetches the active candidate resume analysis metrics
router.get("/my-profile", getCandidateProfile);

module.exports = router;