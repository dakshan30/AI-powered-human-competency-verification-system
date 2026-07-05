import React, { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import AuthLayout from "../../components/auth/AuthLayout";

import SignupForm from "../../components/auth/SignupForm";

import { useAuth } from "../../hooks/useAuth";

const Signup = () => {
  const navigate = useNavigate();

  const { signup } = useAuth();

  const [loading, setLoading] = useState(false);

  /*
  ====================================
  HANDLE SIGNUP
  ====================================
  */

  const handleSignup = async (formData) => {
    try {
      setLoading(true);

      const response = await signup(formData);

      toast.success(
        response.message ||
          "Account created successfully"
      );

      /*
      ====================================
      ROLE-BASED REDIRECT
      ====================================
      */

      if (response.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/candidate/dashboard");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="Start your AI-powered competency verification journey."
    >
      <div className="auth-form-wrapper">
        <SignupForm
          onSubmit={handleSignup}
          loading={loading}
        />

        {/* FOOTER */}

        <div className="auth-footer">
          <p>
            Already have an account?
          </p>

          <Link
            to="/login"
            className="auth-link"
          >
            Login
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Signup;