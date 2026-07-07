const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    adminUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    actionType: {
      type: String,
      required: true,
      enum: ["USER_CREATED", "ROLE_UPDATED", "ACCOUNT_SUSPENDED", "ACCOUNT_ACTIVATED", "SETTINGS_CHANGED"]
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Optimize aggregation queries with a compound index
auditLogSchema.index({ adminUser: 1, actionType: 1, timestamp: -1 });

module.exports = mongoose.model("AuditLog", auditLogSchema);
