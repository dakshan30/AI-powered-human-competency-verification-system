import React, {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import AuthLayout from "../../components/auth/AuthLayout";

import LoginForm from "../../components/auth/LoginForm";

import { useAuth } from "../../hooks/useAuth";

const Login = () => {
  const navigate =
    useNavigate();

  const { login } =
    useAuth();

  const [loading, setLoading] =
    useState(false);

  const handleLogin =
    async (formData) => {
      try {
        setLoading(true);

        const response =
          await login(formData);

        toast.success(
          "Login successful"
        );

        if (
          response.user.role ===
          "admin"
        ) {
          navigate(
            "/admin/dashboard"
          );
        } else {
          navigate(
            "/candidate/dashboard"
          );
        }
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
      subtitle="Login to continue using the AI recruitment platform."
    >
      <LoginForm
        onSubmit={handleLogin}
        loading={loading}
      />
    </AuthLayout>
  );
};

export default Login;