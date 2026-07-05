const {
  classifyExperience,
} = require("./experienceClassifier");

/*
====================================
RESUME INTELLIGENCE
====================================
*/

exports.analyzeResumeIntelligence =
  (parsedData) => {
    /*
    EXTRACT EXPERIENCE
    */

    const experienceText =
      parsedData
        ?.experience?.[0] ||
      "";

    /*
    PARSE YEARS
    */

    const yearsMatch =
      experienceText.match(
        /\d+/
      );

    const years =
      yearsMatch
        ? parseInt(
            yearsMatch[0]
          )
        : 0;

    /*
    CLASSIFY
    */

    const experienceData =
      classifyExperience(
        years
      );

    /*
    DETECT ROLE
    */

    let role =
      "Software Developer";

    const skills =
      parsedData.skills || [];

    if (
      skills.includes(
        "React"
      ) &&
      skills.includes(
        "Node"
      )
    ) {
      role =
        "MERN Stack Developer";
    }

    /*
    RETURN
    */

    return {
      role,

      years,

      difficultyLevel:
        experienceData.level,

      difficultyDistribution:
        experienceData.questionDistribution,
    };
  };