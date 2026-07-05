/*
====================================
BUILD RESUME AI PROMPT
====================================
*/

exports.buildResumePrompt =
  (resumeText) => {

    /*
    ✅ TRUNCATE TEXT to max 3000 chars
    to save tokens and avoid rate limits
    */
    const truncatedText =
      resumeText?.slice(0, 3000) || "";

    return `Parse this resume. Return STRICT JSON ONLY. No explanation. No markdown.

{
  "name": "",
  "email": "",
  "phone": "",
  "skills": [],
  "experience": [{ "company": "", "role": "", "years": "" }],
  "education": [{ "degree": "", "institution": "" }],
  "projects": [],
  "certifications": [],
  "technologies": [],
  "detectedRole": "",
  "experienceLevel": "",
  "strengths": [],
  "weaknesses": []
}

Resume:
${truncatedText}`;
  };