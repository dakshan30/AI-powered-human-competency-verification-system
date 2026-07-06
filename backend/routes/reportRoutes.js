const express =
  require("express");

const router =
  express.Router();

const {
  getReports,
  generateReport,
} = require("../controllers/reportController");

const {
  protect,
} = require("../middleware/authMiddleware");

/*
====================================
LIST REPORTS
====================================
*/

router.get(
  "/",
  protect,
  getReports
);

/*
====================================
GENERATE REPORT
====================================
*/

router.get(
  "/candidate/:id",

  protect,

  generateReport
);

module.exports = router;
