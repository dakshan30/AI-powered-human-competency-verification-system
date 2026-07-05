const express =
  require("express");

const router =
  express.Router();

const {
  generateReport,
} = require("../controllers/reportController");

const {
  protect,
} = require("../middleware/authMiddleware");

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