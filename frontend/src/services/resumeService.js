import API from "./api";

/*
====================================
UPLOAD RESUME
====================================
*/

export const uploadResume =
  async (
    formData,
    onUploadProgress
  ) => {
    const response =
      await API.post(
        "/resume/upload",

        formData,

        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },

          onUploadProgress,
        }
      );

    return response.data;
  };