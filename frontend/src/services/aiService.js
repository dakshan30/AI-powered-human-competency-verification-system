import API from "./api";

/*
====================================
GENERATE INTERVIEW
====================================
*/

export const generateInterview =
  async (resumeId) => {
    const response =
      await API.get(
        `/ai/generate-interview/${resumeId}`
      );

    return response.data;
  };