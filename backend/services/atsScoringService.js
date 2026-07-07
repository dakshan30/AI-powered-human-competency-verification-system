/**
 * Computes an ATS alignment score based on candidate skills and experience matching.
 * Mapped to a 0-100 scale: 60% Skills matching, 40% Experience alignment.
 * 
 * @param {string[]} candidateSkills - List of candidate skills.
 * @param {string[]} targetRoleSkills - List of target role requirements.
 * @param {number} experienceYears - Candidate's years of experience.
 * @param {number} requiredMinYears - Role requirement min years of experience.
 * @returns {number} Score integer between 0 and 100.
 */
exports.calculateAtsScore = (candidateSkills = [], targetRoleSkills = [], experienceYears = 0, requiredMinYears = 0) => {
  try {
    const candidateArray = Array.isArray(candidateSkills) ? candidateSkills : [];
    const targetArray = Array.isArray(targetRoleSkills) ? targetRoleSkills : [];
    const candidateExp = typeof experienceYears === "number" ? experienceYears : 0;
    const requiredExp = typeof requiredMinYears === "number" ? requiredMinYears : 0;

    // 1. Skill Match Weight (60%)
    let skillScore = 0;
    if (targetArray.length > 0) {
      const candidateLower = candidateArray.map(s => String(s).toLowerCase().trim());
      const requiredLower = targetArray.map(s => String(s).toLowerCase().trim());
      
      const intersection = requiredLower.filter(s => candidateLower.includes(s));
      skillScore = 60 * (intersection.length / requiredLower.length);
    } else {
      // If target specifies no skills, default to full skill match points if candidate lists skills, else 0
      skillScore = candidateArray.length > 0 ? 60 : 0;
    }

    // 2. Experience Alignment Weight (40%)
    let experienceScore = 0;
    if (requiredExp <= 0) {
      experienceScore = 40; // No requirements means full credit
    } else {
      const experienceRatio = candidateExp / requiredExp;
      experienceScore = experienceRatio >= 1 ? 40 : 40 * experienceRatio;
    }

    const finalScore = Math.round(skillScore + experienceScore);
    return Math.min(Math.max(finalScore, 0), 100);

  } catch (error) {
    console.error("ATS alignment scoring calculator exception:", error);
    return 0; // Fallback score to avoid crashing primary systems
  }
};