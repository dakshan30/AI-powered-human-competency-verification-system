import React, {
  useState,
} from "react";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import toast from "react-hot-toast";

import AuthLayout from "../components/auth/AuthLayout";
import LoginForm from "../components/auth/LoginForm";

import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const { login } =
    useAuth();

  const [loading, setLoading] =
    useState(false);

  const from =
    location.state?.from
      ?.pathname || "/dashboard";

  const handleLogin =
    async (formData) => {
      try {
        setLoading(true);

        const response =
          await login(formData);

        toast.success(
          response.message ||
            "Login successful"
        );

        navigate(from, {
          replace: true,
        });
      } catch (error) {
        toast.error(
          error?.response?.data
            ?.message ||
            "Login failed"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Login to continue your AI competency verification journey."
    >
      <LoginForm
        onSubmit={handleLogin}
        loading={loading}
      />
    </AuthLayout>
  );
};

export default Login;