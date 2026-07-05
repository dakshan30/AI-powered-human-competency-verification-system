/*
====================================
COMPETENCY ANALYTICS
====================================
*/

exports.generateAnalytics =
  (interviews) => {
    /*
    EMPTY
    */

    if (
      !interviews ||
      interviews.length === 0
    ) {
      return {
        averageCompetency: 0,

        averageTechnical: 0,

        averageCommunication: 0,

        averageConfidence: 0,

        averageProblemSolving: 0,

        topSkills: [],
      };
    }

    /*
    TOTALS
    */

    let competency = 0;

    let technical = 0;

    let communication = 0;

    let confidence = 0;

    let problemSolving = 0;

    const skillMap = {};

    /*
    LOOP
    */

    interviews.forEach(
      (interview) => {
        competency +=
          interview
            .overallScores
            .competency || 0;

        technical +=
          interview
            .overallScores
            .technical || 0;

        communication +=
          interview
            .overallScores
            .communication || 0;

        confidence +=
          interview
            .overallScores
            .confidence || 0;

        problemSolving +=
          interview
            .overallScores
            .problemSolving || 0;

        /*
        SKILLS
        */

        interview.answers.forEach(
          (answer) => {
            const skill =
              answer.skill;

            if (
              !skillMap[skill]
            ) {
              skillMap[
                skill
              ] = 0;
            }

            skillMap[skill] += 1;
          }
        );
      }
    );

    /*
    TOP SKILLS
    */

    const topSkills =
      Object.entries(skillMap)
        .map(
          ([skill, count]) => ({
            skill,
            count,
          })
        )
        .sort(
          (a, b) =>
            b.count - a.count
        )
        .slice(0, 5);

    /*
    TOTAL
    */

    const total =
      interviews.length;

    /*
    RETURN
    */

    return {
      averageCompetency:
        Math.round(
          competency / total
        ),

      averageTechnical:
        Math.round(
          technical / total
        ),

      averageCommunication:
        Math.round(
          communication /
            total
        ),

      averageConfidence:
        Math.round(
          confidence / total
        ),

      averageProblemSolving:
        Math.round(
          problemSolving /
            total
        ),

      topSkills,
    };
  };