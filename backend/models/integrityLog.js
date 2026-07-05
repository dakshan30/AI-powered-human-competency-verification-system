const mongoose =
  require("mongoose");

/*
====================================
INTEGRITY LOG
====================================
*/

const integrityLogSchema =
  new mongoose.Schema(
    {
      candidate: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "User",

        required: true,
      },

      interview: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "Interview",
      },

      violations: [
        {
          type: {
            type: String,
          },

          timestamp: {
            type: Date,

            default:
              Date.now,
          },

          severity: {
            type: Number,

            default: 1,
          },

          metadata: {
            type: Object,

            default: {},
          },
        },
      ],

      riskScore: {
        type: Number,

        default: 0,
      },

      status: {
        type: String,

        enum: [
          "safe",
          "warning",
          "suspicious",
        ],

        default: "safe",
      },
    },

    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "IntegrityLog",
    integrityLogSchema
  );