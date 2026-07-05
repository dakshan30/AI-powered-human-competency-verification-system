import API from "./api"
/*
====================================
GET INTERVIEW
====================================
*/

export const getInterview = async (
  interviewId
) => {
  try {
    const response =
      await API.get(
        `/interview/${interviewId}`
      );

    return response.data;
  } catch (error) {
    console.log(
      "Get Interview Error:",
      error.response?.data ||
        error.message
    );

    throw error;
  }
};

/*
====================================
SUBMIT ANSWER
====================================
*/

export const submitAnswer =
  async (
    interviewId,
    payload
  ) => {
    try {
      const response =
        await API.post(
          `/interview/submit/${interviewId}`,
          payload
        );

      return response.data;
    } catch (error) {
      console.log(
        "Submit Answer Error:",
        error.response?.data ||
          error.message
      );

      throw error;
    }
  };

  export const updateDecision =
  async (
    interviewId,
    decisionData
  ) => {

    const response =
      await API.patch(
        `/interview/${interviewId}/decision`,
        decisionData
      );

    return response.data;
  };