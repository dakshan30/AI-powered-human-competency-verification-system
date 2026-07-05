/*
====================================
CLASSIFY EXPERIENCE
====================================
*/

exports.classifyExperience =
  (years) => {
    /*
    FRESHER
    */

    if (years <= 1) {
      return {
        level: "Beginner",

        questionDistribution:
          {
            easy: 70,

            medium: 25,

            hard: 5,
          },
      };
    }

    /*
    MID LEVEL
    */

    if (years <= 4) {
      return {
        level:
          "Intermediate",

        questionDistribution:
          {
            easy: 20,

            medium: 60,

            hard: 20,
          },
      };
    }

    /*
    SENIOR
    */

    return {
      level: "Advanced",

      questionDistribution:
        {
          easy: 10,

          medium: 35,

          hard: 55,
        },
    };
  };