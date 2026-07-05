import axios from "axios";

/*
====================================
BASE API INSTANCE
====================================
*/

const API = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL ||
    "http://localhost:5000/api",

  headers: {
    "Content-Type":
      "application/json",
  },
});

/*
====================================
REQUEST INTERCEPTOR
Attach JWT Token
====================================
*/

API.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem(
        "token"
      );

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(
      error
    );
  }
);

/*
====================================
RESPONSE INTERCEPTOR
Handle Unauthorized
====================================
*/

API.interceptors.response.use(
  (response) => response,

  (error) => {
    if (
      error.response?.status ===
      401
    ) {
      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "user"
      );

      window.location.href =
        "/login";
    }

    return Promise.reject(
      error
    );
  }
);

export default API;