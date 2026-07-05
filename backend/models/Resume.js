const mongoose =
  require("mongoose");

/*
====================================
RESUME SCHEMA
====================================
*/

const resumeSchema =
  new mongoose.Schema(
    {
      candidate: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "User",

        required: true,
      },

      fileName: String,

      filePath: String,

      rawText: String,

      atsScore: Number,

      parsedData: {
        name: String,

        email: String,

        phone: String,

        skills: [String],

        experience: [Object],

        education: [Object],

        projects: [String],

        certifications: [
          String,
        ],

        technologies: [
          String,
        ],

        detectedRole:
          String,

        experienceLevel:
          String,

        strengths: [String],

        weaknesses: [String],
      },
    },

    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Resume",
    resumeSchema
  );