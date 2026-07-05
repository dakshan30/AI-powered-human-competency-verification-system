export const getRecommendation =
  (competency) => {

    if (competency >= 85) {
      return {
        label:
          "STRONG HIRE",

        color:
          "#10B981",

        description:
          "Excellent candidate with strong technical and communication skills."
      };
    }

    if (competency >= 70) {
      return {
        label:
          "HIRE",

        color:
          "#3B82F6",

        description:
          "Candidate meets expectations and can perform effectively."
      };
    }

    if (competency >= 55) {
      return {
        label:
          "HOLD",

        color:
          "#F59E0B",

        description:
          "Requires additional evaluation before final decision."
      };
    }

    return {
      label:
        "REJECT",

      color:
        "#EF4444",

      description:
        "Candidate does not currently meet the required competency level."
    };
  };