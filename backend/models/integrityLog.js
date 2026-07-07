const mongoose = require("mongoose");

const violationEventSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      required: true,
      enum: [
        "TAB_BLUR", 
        "WINDOW_RESIZE", 
        "COPY_PASTE_ATTEMPT", 
        "UNAUTHORIZED_DEVICE",
        // Legacy event types for backward compatibility
        "tab_switch",
        "fullscreen_exit",
        "copy_paste"
      ]
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    additionalMeta: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    
    // Legacy fields
    type: String,
    severity: { type: Number, default: 1 },
    metadata: { type: Object, default: {} }
  },
  {
    _id: false
  }
);

const integrityLogSchema = new mongoose.Schema(
  {
    interviewSessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InterviewSession",
      required: true,
      index: true
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    // Legacy fields for backward compatibility
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      default: function() {
        return this.candidateId;
      }
    },
    interview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview",
      default: function() {
        return this.interviewSessionId;
      }
    },

    violations: [violationEventSchema],

    riskLevel: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "LOW"
    },

    // Legacy fields for scoring compatibility
    riskScore: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ["safe", "warning", "suspicious"],
      default: "safe"
    }
  },
  {
    timestamps: true
  }
);

// Apply compound performance index for fast queries during assessments
integrityLogSchema.index({ interviewSessionId: 1, candidateId: 1 });

module.exports = mongoose.model("IntegrityLog", integrityLogSchema);