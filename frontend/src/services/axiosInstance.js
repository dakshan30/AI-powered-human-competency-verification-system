import axios from "axios";

const axiosInstance =
  axios.create({
    baseURL:
      process.env
        .REACT_APP_API_BASE_URL ||
      "http://localhost:5000/api",

    headers: {
      "Content-Type":
        "application/json",
    },

    timeout: 15000,
  });

/*
====================================
REQUEST INTERCEPTOR
====================================
*/

axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem(
        "token"
      );

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) =>
    Promise.reject(error)
);

/*
====================================
RESPONSE INTERCEPTOR
====================================
*/

axiosInstance.interceptors.response.use(
  (response) => response,

  (error) => {
    if (
      error.response?.status ===
      401
    ) {
      localStorage.removeItem(
        "token"
      );

      window.location.href =
        "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;