const express =
  require("express");

const router =
  express.Router();

const {
  getReports,
  generateReport,
  deleteReport,
  archiveReportHandler,
  exportReports,
  getArchiveStatsHandler,
} = require(
  "../controllers/reportController"
);

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

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
GET ARCHIVE STATS
====================================
*/

router.get(
  "/archive/stats",
  protect,
  getArchiveStatsHandler
);

/*
====================================
EXPORT REPORTS
====================================
*/

router.get(
  "/export",
  protect,
  exportReports
);

/*
====================================
GENERATE REPORT (PDF)
====================================
*/

router.get(
  "/:id",
  protect,
  generateReport
);

/*
====================================
ARCHIVE REPORT
====================================
*/

router.put(
  "/:id/archive",
  protect,
  archiveReportHandler
);

/*
====================================
DELETE REPORT
====================================
*/

router.delete(
  "/:id",
  protect,
  deleteReport
);

module.exports = router;
