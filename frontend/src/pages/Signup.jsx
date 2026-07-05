import React, {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import AuthLayout from "../components/auth/AuthLayout";

import SignupForm from "../components/auth/SignupForm";

import { useAuth } from "../hooks/useAuth";

const Signup = () => {
  const navigate =
    useNavigate();

  const { signup } =
    useAuth();

  const [loading, setLoading] =
    useState(false);

  const handleSignup =
    async (formData) => {
      try {
        setLoading(true);

        const response =
          await signup(formData);

        toast.success(
          response.message ||
            "Account created successfully"
        );

        navigate("/dashboard");
      } catch (error) {
        toast.error(
          error?.response?.data
            ?.message ||
            "Signup failed"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Start using AI-powered resume competency analysis."
    >
      <SignupForm
        onSubmit={handleSignup}
        loading={loading}
      />
    </AuthLayout>
  );
};

export default Signup;