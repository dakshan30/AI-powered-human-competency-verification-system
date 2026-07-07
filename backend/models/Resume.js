const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true
    },

    // Legacy candidate alias for backwards compatibility
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      default: function() {
        return this.candidateId;
      }
    },

    fileName: {
      type: String,
      required: true,
      trim: true
    },

    fileUrl: {
      type: String,
      required: true,
      trim: true
    },

    // Legacy filePath alias for backwards compatibility
    filePath: {
      type: String,
      default: function() {
        return this.fileUrl;
      }
    },

    parsedData: {
      name: { type: String, trim: true },
      email: { type: String, lowercase: true, trim: true },
      phone: { type: String, trim: true },
      skills: [{ type: String }],
      experienceYears: { type: Number, default: 0 },
      matchedRole: { type: String, trim: true },
      projects: [{ type: String }],
      
      // Legacy fields
      experience: [Object],
      education: [Object],
      certifications: [String],
      technologies: [String],
      detectedRole: String,
      experienceLevel: String,
      strengths: [String],
      weaknesses: [String]
    },

    atsScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Resume", resumeSchema);