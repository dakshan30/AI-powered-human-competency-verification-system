import React, { useState } from "react";

import { Link } from "react-router-dom";

import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

import Input from "../common/Input";

const LoginForm = ({
  onSubmit,
  loading = false,
}) => {
  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
      rememberMe: false,
    });

  const [errors, setErrors] =
    useState({});

  const [showPassword, setShowPassword] =
    useState(false);

  /*
  ====================================
  HANDLE CHANGE
  ====================================
  */

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  /*
  ====================================
  VALIDATION
  ====================================
  */

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email =
        "Email is required";
    }

    if (!formData.password.trim()) {
      newErrors.password =
        "Password is required";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors)
        .length === 0
    );
  };

  /*
  ====================================
  SUBMIT
  ====================================
  */

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    const valid =
      validateForm();

    if (!valid) return;

    await onSubmit(formData);
  };

  return (
    <form
      className="auth-form"
      onSubmit={handleSubmit}
    >
      {/* EMAIL */}

      <Input
        label="Email Address"
        type="email"
        name="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        icon={<FaEnvelope />}
      />

      {/* PASSWORD */}

      <div className="password-field">
        <Input
          label="Password"
          type={
            showPassword
              ? "text"
              : "password"
          }
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          icon={<FaLock />}
        />

        <button
          type="button"
          className="password-toggle"
          onClick={() =>
            setShowPassword(
              !showPassword
            )
          }
        >
          {showPassword ? (
            <FaEyeSlash />
          ) : (
            <FaEye />
          )}
        </button>
      </div>

      {/* OPTIONS */}

      <div className="auth-options">
        <label className="remember-me">
          <input
            type="checkbox"
            name="rememberMe"
            checked={
              formData.rememberMe
            }
            onChange={handleChange}
          />

          Remember me
        </label>

        <Link
          to="/forgot-password"
          className="forgot-link"
        >
          Forgot Password?
        </Link>
      </div>

      {/* BUTTON */}

      <button
        type="submit"
        className="auth-submit-btn"
        disabled={loading}
      >
        {loading
          ? "Logging in..."
          : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;