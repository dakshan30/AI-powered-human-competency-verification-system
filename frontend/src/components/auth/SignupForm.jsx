import React, { useState } from "react";

import { Link } from "react-router-dom";

import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

import Input from "../common/Input";

import Button from "../common/Button";

const SignupForm = ({
  onSubmit,
  loading = false,
}) => {
  const [formData, setFormData] =
    useState({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

  const [errors, setErrors] =
    useState({});

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  /*
  ====================================
  HANDLE INPUT CHANGE
  ====================================
  */

  const handleChange = (e) => {
    const { name, value } =
      e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    /*
    CLEAR FIELD ERROR
    */

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

    /*
    FULL NAME
    */

    if (
      !formData.fullName.trim()
    ) {
      newErrors.fullName =
        "Full name is required";
    } else if (
      formData.fullName.trim().length <
      3
    ) {
      newErrors.fullName =
        "Full name must be at least 3 characters";
    }

    /*
    EMAIL
    */

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      newErrors.email =
        "Email is required";
    } else if (
      !emailRegex.test(
        formData.email
      )
    ) {
      newErrors.email =
        "Invalid email address";
    }

    /*
    PASSWORD
    */

    if (!formData.password) {
      newErrors.password =
        "Password is required";
    } else if (
      formData.password.length < 6
    ) {
      newErrors.password =
        "Password must be at least 6 characters";
    }

    /*
    CONFIRM PASSWORD
    */

    if (
      !formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Confirm password is required";
    } else if (
      formData.password !==
      formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors)
        .length === 0
    );
  };

  /*
  ====================================
  HANDLE SUBMIT
  ====================================
  */

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    const isValid =
      validateForm();

    if (!isValid) return;

    await onSubmit({
      fullName:
        formData.fullName,
      email: formData.email,
      password:
        formData.password,
    });
  };

  return (
    <form
      className="auth-form"
      onSubmit={handleSubmit}
      noValidate
    >
      {/* FULL NAME */}

      <Input
        label="Full Name"
        type="text"
        name="fullName"
        placeholder="Enter your full name"
        value={formData.fullName}
        onChange={handleChange}
        error={errors.fullName}
        icon={<FaUser />}
      />

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
          placeholder="Create password"
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

      {/* CONFIRM PASSWORD */}

      <div className="password-field">
        <Input
          label="Confirm Password"
          type={
            showConfirmPassword
              ? "text"
              : "password"
          }
          name="confirmPassword"
          placeholder="Confirm password"
          value={
            formData.confirmPassword
          }
          onChange={handleChange}
          error={
            errors.confirmPassword
          }
          icon={<FaLock />}
        />

        <button
          type="button"
          className="password-toggle"
          onClick={() =>
            setShowConfirmPassword(
              !showConfirmPassword
            )
          }
        >
          {showConfirmPassword ? (
            <FaEyeSlash />
          ) : (
            <FaEye />
          )}
        </button>
      </div>

      {/* TERMS */}

      <div className="terms-box">
        By creating an account, you agree
        to our{" "}
        <Link to="/terms">
          Terms
        </Link>{" "}
        and{" "}
        <Link to="/privacy">
          Privacy Policy
        </Link>
        .
      </div>

      {/* SUBMIT */}

      <Button
        type="submit"
        disabled={loading}
        className="auth-submit-btn"
      >
        {loading
          ? "Creating Account..."
          : "Create Account"}
      </Button>
    </form>
  );
};

export default SignupForm;