const IntegrityLog =
  require("../models/IntegrityLog");

const {
  calculateRiskScore,
} = require("../services/integrityScoringService");

/*
====================================
LOG VIOLATION
====================================
*/

exports.logViolation =
  async (req, res) => {
    try {
      const {
        interviewId,

        type,

        severity,

        metadata,
      } = req.body;

      /*
      FIND LOG
      */

      let integrityLog =
        await IntegrityLog.findOne(
          {
            candidate:
              req.user.id,

            interview:
              interviewId,
          }
        );

      /*
      CREATE
      */

      if (!integrityLog) {
        integrityLog =
          await IntegrityLog.create(
            {
              candidate:
                req.user.id,

              interview:
                interviewId,

              violations:
                [],
            }
          );
      }

      /*
      PUSH
      */

      integrityLog.violations.push(
        {
          type,

          severity,

          metadata,
        }
      );

      /*
      SCORE
      */

      const risk =
        calculateRiskScore(
          integrityLog.violations
        );

      integrityLog.riskScore =
        risk.score;

      integrityLog.status =
        risk.status;

      /*
      SAVE
      */

      await integrityLog.save();

      /*
      RESPONSE
      */

      res.status(200).json({
        success: true,

        riskScore:
          integrityLog.riskScore,

        status:
          integrityLog.status,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,

        message:
          "Integrity logging failed",
      });
    }
  };