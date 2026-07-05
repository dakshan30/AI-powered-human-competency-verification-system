import API from "./api";

/*
====================================
LOG INTEGRITY EVENT
====================================
*/

export const logIntegrityEvent =
  async (
    payload
  ) => {
    const response =
      await API.post(
        "/integrity/log",

        payload
      );

    return response.data;
  };