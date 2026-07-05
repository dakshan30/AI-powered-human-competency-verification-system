import React, {
  createContext,
  useEffect,
  useState,
} from "react";

import authService from "../services/authService";

export const AuthContext =
  createContext();

export const AuthProvider = ({
  children,
}) => {
  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [authenticated, setAuthenticated] =
    useState(false);

  /*
  ====================================
  INITIAL AUTH CHECK
  ====================================
  */

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication =
    async () => {
      try {
        const token =
          localStorage.getItem("token");

        if (!token) {
          setLoading(false);
          return;
        }

        const response =
          await authService.getProfile();

        setUser(response.user);

        setAuthenticated(true);
      } catch (error) {
        localStorage.removeItem(
          "token"
        );

        setUser(null);

        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

  /*
  ====================================
  LOGIN
  ====================================
  */

  const login = async (formData) => {
    const response =
      await authService.login(
        formData
      );

    setUser(response.user);

    setAuthenticated(true);

    return response;
  };

  /*
  ====================================
  SIGNUP
  ====================================
  */

  const signup = async (
    formData
  ) => {
    const response =
      await authService.signup(
        formData
      );

    setUser(response.user);

    setAuthenticated(true);

    return response;
  };

  /*
  ====================================
  LOGOUT
  ====================================
  */

  const logout = () => {
    authService.logout();

    setUser(null);

    setAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authenticated,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};