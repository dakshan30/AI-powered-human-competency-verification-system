const express =
  require("express");

const router =
  express.Router();

const {
  startInterview,
  submitAnswer,
  completeInterview,
  getInterview,
  getInterviewReport,
} = require("../controllers/interviewController");

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

const {
  updateHiringDecision,
} = require(
  "../controllers/interviewController"
);

/*
====================================
START INTERVIEW
====================================
*/

router.post(
  "/start",
  protect,
  startInterview
);

/*
====================================
GET INTERVIEW
====================================
*/

router.get(
  "/:id",
  protect,
  getInterview
);

router.get(
  "/:id/report",
  protect,
  getInterviewReport
);



/*
====================================
SUBMIT ANSWER
====================================
*/

router.post(
  "/submit/:interviewId",
  protect,
  submitAnswer
);

module.exports =
  router;

router.patch(
  "/:id/decision",
  protect,
  updateHiringDecision
);