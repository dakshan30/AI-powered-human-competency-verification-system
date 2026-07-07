const mongoose = require("mongoose");

const sessionQuestionSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question"
    },
    text: {
      type: String,
      required: true
    },
    candidateAnswer: {
      type: String,
      default: ""
    },
    aiScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    aiFeedback: {
      type: String,
      default: ""
    }
  },
  {
    _id: false
  }
);

const interviewSessionSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: ["scheduled", "in_progress", "completed", "cancelled"],
      default: "scheduled"
    },
    category: {
      type: String,
      required: true
    },
    questions: [sessionQuestionSchema],
    currentQuestionIndex: {
      type: Number,
      default: 0
    },
    overallCompetencyScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    recommendation: {
      type: String,
      enum: ["STRONG_HIRE", "HIRE", "HOLD", "REJECT"],
      default: "HOLD"
    },
    interviewDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("InterviewSession", interviewSessionSchema);
