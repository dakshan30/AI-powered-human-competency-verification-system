/*
====================================
BUILD INTERVIEW PROMPT
====================================
*/

exports.buildInterviewPrompt =
  ({
    role,

    skills,

    experience,

    difficultyLevel,

    projects = [],
  }) => {
    return `
You are an enterprise-level AI technical interviewer.

Generate high-quality technical interview questions.

Candidate Details:

Role:
${role}

Experience:
${experience} years

Difficulty:
${difficultyLevel}

Skills:
${skills.join(", ")}

Projects:
${projects.join(", ")}

Requirements:

1. Questions must match candidate experience level.

2. Include:
- debugging questions
- optimization questions
- scenario-based questions
- architecture questions
- practical implementation questions

3. Avoid:
- purely theoretical questions
- repetitive questions
- vague questions

4. Difficulty balancing:
- beginner
- intermediate
- advanced

5. Questions must evaluate:
- technical depth
- reasoning
- real-world problem solving

Return STRICT JSON ONLY.

Required JSON format:

{
  "questions": [
    {
      "question": "",
      "difficulty": "",
      "skill": "",
      "type": "",
      "expectedTopics": [],
      "evaluationCriteria": []
    }
  ]
}
`;
  };