import axiosInstance from "./axiosInstance";

const authService = {
  signup: async (userData) => {
    const response = await axiosInstance.post(
      "/auth/signup",
      userData
    );

    if (response.data?.token) {
      localStorage.setItem(
        "token",
        response.data.token
      );
    }

    return response.data;
  },

  login: async (userData) => {
    const response = await axiosInstance.post(
      "/auth/login",
      userData
    );

    if (response.data?.token) {
      localStorage.setItem(
        "token",
        response.data.token
      );
    }

    return response.data;
  },

  getProfile: async () => {
    const response = await axiosInstance.get(
      "/auth/profile"
    );

    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
  },
};

export default authService;