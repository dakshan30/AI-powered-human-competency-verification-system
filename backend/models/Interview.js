const mongoose = require("mongoose");

/*
====================================
QUESTION SCHEMA
====================================
*/

const questionSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },

    question: {
      type: String,
      required: true,
    },

    skill: {
      type: String,
      default: "General",
    },

    difficulty: {
      type: String,
      enum: [
        "easy",
        "medium",
        "hard",
        "beginner",
        "intermediate",
        "advanced",
        "beginner-intermediate",
        "intermediate-advanced",
      ],
      default: "medium",
    },

    type: {
      type: String,
      default: "technical",
    },

    expectedTopics: [
      {
        type: String,
      },
    ],

    evaluationCriteria: [
      {
        type: String,
      },
    ],

    estimatedTime: {
      type: Number,
      default: 180,
    },
  },
  {
    _id: false,
  }
);

/*
====================================
EVALUATION SCHEMA
====================================
*/

const evaluationSchema = new mongoose.Schema(
  {
    technicalScore: {
      type: Number,
      default: 0,
    },

    communicationScore: {
      type: Number,
      default: 0,
    },

    confidenceScore: {
      type: Number,
      default: 0,
    },

    problemSolvingScore: {
      type: Number,
      default: 0,
    },

    overallScore: {
      type: Number,
      default: 0,
    },

    strengths: [
      {
        type: String,
      },
    ],

    weaknesses: [
      {
        type: String,
      },
    ],

    feedback: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  }
);

/*
====================================
ANSWER SCHEMA
====================================
*/

const answerSchema = new mongoose.Schema(
  {
    questionId: {
      type: Number,
      required: true,
    },

    question: {
      type: String,
      required: true,
    },

    answer: {
      type: String,
      required: true,
    },

    skill: {
      type: String,
      default: "General",
    },

    difficulty: {
      type: String,
      default: "medium",
    },

    evaluation: evaluationSchema,
  },
  {
    timestamps: true,
  }
);

/*
====================================
OVERALL SCORE SCHEMA
====================================
*/

const overallScoreSchema = new mongoose.Schema(
  {
    technical: {
      type: Number,
      default: 0,
    },

    communication: {
      type: Number,
      default: 0,
    },

    confidence: {
      type: Number,
      default: 0,
    },

    problemSolving: {
      type: Number,
      default: 0,
    },

    competency: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: false,
  }
);

/*
====================================
REPORT SCHEMA
====================================
*/

const reportSchema = new mongoose.Schema(
  {
    recommendation: {
      type: String,
      enum: [
        "STRONG_HIRE",
        "HIRE",
        "HOLD",
        "REJECT",
      ],
      default: "HOLD",
    },

    trustScore: {
      type: Number,
      default: 100,
    },

    candidateRank: {
      type: String,
      default: "N/A",
    },

    strengthsSummary: [
      {
        type: String,
      },
    ],

    weaknessesSummary: [
      {
        type: String,
      },
    ],

    improvementPlan: [
      {
        type: String,
      },
    ],
  },
  {
    _id: false,
  }
);

/*
====================================
HIRING DECISION SCHEMA
====================================
*/

const decisionSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: [
        "hire",
        "hold",
        "reject",
      ],
      default: "hold",
    },

    comments: {
      type: String,
      default: "",
    },

    decidedBy: {
      type:
        mongoose.Schema.Types
          .ObjectId,

      ref: "User",
    },

    decidedAt: Date,
  },
  {
    _id: false,
  }
);

/*
====================================
INTERVIEW SCHEMA
====================================
*/

const interviewSchema = new mongoose.Schema(
  {
    /*
    CANDIDATE
    */

    candidate: {
      type:
        mongoose.Schema.Types
          .ObjectId,

      ref: "User",

      required: true,
    },

    /*
    RESUME
    */

    resume: {
      type:
        mongoose.Schema.Types
          .ObjectId,

      ref: "Resume",

      required: true,
    },

    /*
    QUESTIONS
    */

    questions: [
      questionSchema,
    ],

    /*
    ANSWERS
    */

    answers: [
      answerSchema,
    ],

    /*
    STATUS
    */

    status: {
      type: String,

      enum: [
        "pending",
        "in_progress",
        "completed",
      ],

      default:
        "in_progress",
    },

    /*
    CURRENT QUESTION
    */

    currentQuestion: {
      type: Number,
      default: 0,
    },

    /*
    OVERALL SCORES
    */

    overallScores:
      overallScoreSchema,

    /*
    INTEGRITY MONITORING
    */

    integrityFlags: [
      {
        type: String,
      },
    ],

    suspiciousActivityScore:
      {
        type: Number,
        default: 0,
      },

    warnings: {
      type: Number,
      default: 0,
    },

    fullscreenViolations:
      {
        type: Number,
        default: 0,
      },

    tabSwitches: {
      type: Number,
      default: 0,
    },

    /*
    GENERATED REPORT
    */

    report: reportSchema,

    /*
    RECRUITER DECISION
    */

    decision:
      decisionSchema,

    /*
    TIMINGS
    */

    startedAt: {
      type: Date,
      default:
        Date.now,
    },

    completedAt:
      Date,

    interviewDuration: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.model(
    "Interview",
    interviewSchema
  );