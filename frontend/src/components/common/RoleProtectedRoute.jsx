import React from "react";

import {
  Navigate,
  useLocation,
} from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

import Loader from "./Loader";

const RoleProtectedRoute = ({
  children,
  allowedRoles,
}) => {
  const {
    authenticated,
    loading,
    user,
  } = useAuth();

  const location = useLocation();

  if (loading) {
    return <Loader />;
  }

  if (!authenticated) {
    return (
      <Navigate
        to="/candidate/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  if (
    !allowedRoles.includes(user?.role)
  ) {
    return (
      <Navigate
        to="/unauthorized"
        replace
      />
    );
  }

  return children;
};

export default RoleProtectedRoute;