import API from "./api";

/*
====================================
GET ANALYTICS
====================================
*/

export const getAnalytics =
  async () => {
    const response =
      await API.get(
        "/analytics"
      );

    return response.data;
  };