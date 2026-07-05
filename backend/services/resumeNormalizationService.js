/*
====================================
NORMALIZE RESUME DATA
====================================
*/

exports.normalizeResumeData =
  (data) => {
    return {
      name:
        data.name || "",

      email:
        data.email || "",

      phone:
        data.phone || "",

      skills:
        Array.isArray(data.skills)
          ? data.skills.map((s) =>
              typeof s === "string"
                ? s
                : s?.name || String(s)
            )
          : [],

      experience:
        Array.isArray(data.experience)
          ? data.experience
          : [],

      education:
        Array.isArray(data.education)
          ? data.education
          : [],

      /*
      ✅ FIXED: projects can be strings OR objects {title, description}
      Convert everything to strings
      */
      projects:
        Array.isArray(data.projects)
          ? data.projects.map((p) => {
              if (typeof p === "string") {
                return p;
              }
              if (typeof p === "object" && p !== null) {
                return p.title || p.name || p.description || JSON.stringify(p);
              }
              return String(p);
            })
          : [],

      /*
      ✅ FIXED: certifications can also be objects
      */
      certifications:
        Array.isArray(data.certifications)
          ? data.certifications.map((c) => {
              if (typeof c === "string") return c;
              if (typeof c === "object" && c !== null) {
                return c.name || c.title || JSON.stringify(c);
              }
              return String(c);
            })
          : [],

      /*
      ✅ FIXED: technologies can also be objects
      */
      technologies:
        Array.isArray(data.technologies)
          ? data.technologies.map((t) => {
              if (typeof t === "string") return t;
              if (typeof t === "object" && t !== null) {
                return t.name || t.title || JSON.stringify(t);
              }
              return String(t);
            })
          : [],

      detectedRole:
        data.detectedRole || "Software Developer",

      experienceLevel:
        data.experienceLevel || "Beginner",

      /*
      ✅ FIXED: strengths/weaknesses can also be objects
      */
      strengths:
        Array.isArray(data.strengths)
          ? data.strengths.map((s) => {
              if (typeof s === "string") return s;
              if (typeof s === "object" && s !== null) {
                return s.text || s.name || JSON.stringify(s);
              }
              return String(s);
            })
          : [],

      weaknesses:
        Array.isArray(data.weaknesses)
          ? data.weaknesses.map((w) => {
              if (typeof w === "string") return w;
              if (typeof w === "object" && w !== null) {
                return w.text || w.name || JSON.stringify(w);
              }
              return String(w);
            })
          : [],
    };
  };