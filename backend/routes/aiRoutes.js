const express =
  require("express");

const router =
  express.Router();

const {
  generateInterview,
} = require("../controllers/aiController");

/*
====================================
AI INTERVIEW
====================================
*/

router.get(
  "/generate-interview/:resumeId",

  generateInterview
);

module.exports = router;