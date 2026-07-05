const express =
  require("express");

const router =
  express.Router();

const {
  logViolation,
} = require("../controllers/integrityController");

const {
  protect,
} = require("../middleware/authMiddleware");

/*
====================================
LOG VIOLATION
====================================
*/

router.post(
  "/log",

  protect,

  logViolation
);

module.exports = router;