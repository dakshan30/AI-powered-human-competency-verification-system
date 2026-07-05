/*
====================================
ATS SCORE CALCULATOR
====================================
*/

exports.calculateATSScore =
  ({
    skills = [],

    experience = [],

    education = [],

    projects = [],

    certifications = [],
  }) => {
    let score = 0;

    /*
    SKILLS
    */

    score += Math.min(
      skills.length * 5,
      35
    );

    /*
    EXPERIENCE
    */

    score += Math.min(
      experience.length * 10,
      25
    );

    /*
    EDUCATION
    */

    if (education.length > 0) {
      score += 15;
    }

    /*
    PROJECTS
    */

    score += Math.min(
      projects.length * 5,
      15
    );

    /*
    CERTIFICATIONS
    */

    score += Math.min(
      certifications.length *
        5,
      10
    );

    return Math.min(
      score,
      100
    );
  };