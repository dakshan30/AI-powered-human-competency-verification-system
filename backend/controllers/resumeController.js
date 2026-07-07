const path = require("path");
const fs = require("fs");
const pdfParse = require("pdf-parse"); // Extracted dependency from handoff configurations
const mammoth = require("mammoth");    // Extracted dependency from handoff configurations
const Resume = require("../models/Resume");
const resumeIntelligenceService = require("../services/resumeIntelligenceService");
const atsScoringService = require("../services/atsScoringService");

/**
 * Helper utility to extract raw textual strings from supported file buffers.
 * @param {Object} file - The file metadata stream processed by Multer.
 * @returns {Promise<string>} The raw text payload extracted from the file.
 */
const extractTextFromFile = async (file) => {
  const filePath = file.path;
  const fileBuffer = fs.readFileSync(filePath);

  if (file.mimetype === "application/pdf") {
    const pdfData = await pdfParse(fileBuffer);
    return pdfData.text || "";
  } else if (
    file.mimetype === "application/msword" ||
    file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const docxData = await mammoth.extractRawText({ path: filePath });
    return docxData.value || "";
  }
  throw new Error("Unsupported MIME extension encountered during text stream extraction.");
};

/**
 * POST /api/resume/upload
 * Processes resume binary streams, extracts entities via Gemini AI, updates scoring configurations, 
 * and commits records securely to the database.
 */
exports.uploadAndParseResume = async (req, res) => {
  let tempFileDeleted = false;
  try {
    // 1. Enforce file existences matching Multer single configuration handles
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No document attachment detected. Please select a valid file to upload.",
        code: "MISSING_UPLOAD_FILE"
      });
    }

    const { targetedRole, benchmarkSkills = "" } = req.body;
    if (!targetedRole) {
      return res.status(400).json({
        success: false,
        message: "Targeted professional application track is required.",
        code: "MISSING_TARGET_ROLE"
      });
    }

    // 2. Prevent profile assignment collisions per candidate account signature
    const existingResume = await Resume.findOne({ candidateId: req.user._id });
    if (existingResume) {
      // Safely clear the freshly uploaded file from local temporary disk paths first
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: "An active resume profile is already associated with this candidate account. Please update or clear previous submissions.",
        code: "DUPLICATE_PROFILE_EXISTS"
      });
    }

    // 3. Extract text content fields from file
    console.log(`Processing file content stream extraction for user: ${req.user._id}`);
    const rawContentText = await extractTextFromFile(req.file);

    if (!rawContentText.trim()) {
      throw new Error("Extracted resume textual sequence returned empty contents.");
    }

    // 4. Trigger Gemini AI core semantic entities extraction
    const parsedProfileData = await resumeIntelligenceService.parseResumeText(
      rawContentText,
      targetedRole
    );

    // 5. Parse required benchmarking skill matrices for algorithmic calculations
    const cleanBenchmarkSkillsArray = benchmarkSkills
      ? benchmarkSkills.split(",").map(s => s.trim()).filter(Boolean)
      : ["JavaScript", "Node.js", "Express", "MongoDB", "React"]; // Robust default tech track backup

    // 6. Execute deterministic algorithm scoring mapping parameters
    const computedAtsScore = atsScoringService.calculateAtsScore(
      parsedProfileData.skills,
      cleanBenchmarkSkillsArray,
      parsedProfileData.experienceYears,
      3 // System standard recommended baseline minimum years of experience requirement
    );

    // 7. Provision document data schema structures matching pre-set indexes
    const virtualDownloadPath = `/uploads/${req.file.filename}`;

    const resumeRecord = new Resume({
      candidateId: req.user._id,
      fileName: req.file.originalname,
      fileUrl: virtualDownloadPath,
      parsedData: parsedProfileData,
      atsScore: computedAtsScore
    });

    await resumeRecord.save();

    return res.status(201).json({
      success: true,
      message: "Resume processed, analyzed, and saved successfully.",
      data: resumeRecord
    });

  } catch (error) {
    console.error("Resume extraction workflow controller fault execution:", error);
    
    // Safety clearing mechanism: ensure unhandled logic errors remove pending temp disk blocks
    if (req.file && req.file.path && !tempFileDeleted && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (clearErr) {
        console.error("Failed to clean up file system temporary path artifact:", clearErr);
      }
    }

    return res.status(500).json({
      success: false,
      message: error.message || "An internal error occurred during the resume parsing lifecycle loop.",
      code: error.code || "RESUME_PROCESSING_FAILED"
    });
  }
};

/**
 * GET /api/resume/my-profile
 * Fetches the active resume parameters and ATS mapping index associated with the caller token user.
 */
exports.getCandidateProfile = async (req, res) => {
  try {
    const profile = await Resume.findOne({ candidateId: req.user._id });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "No resume profile record found matching current credentials. Please complete your registration configuration.",
        code: "PROFILE_NOT_FOUND"
      });
    }

    return res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error("Get Candidate Profile controller fault exception:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve matching candidate profile metadata tracks.",
      code: "PROFILE_FETCH_ERROR"
    });
  }
};