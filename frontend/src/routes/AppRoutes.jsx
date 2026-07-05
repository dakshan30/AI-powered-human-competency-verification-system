import React from "react";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "../pages/public/Home";

import Login from "../pages/auth/Login";

import Signup from "../pages/auth/Signup";

import CandidateDashboard from "../pages/candidate/CandidateDashboard";

import AdminDashboard from "../pages/admin/AdminDashboard";

import RoleProtectedRoute from "../components/common/RoleProtectedRoute";

import Candidates from "../pages/admin/Candidates";

import Analytics from "../pages/admin/Analytics";

import UploadResume from "../pages/candidate/UploadResume";

import Interview from "../pages/candidate/Interview";

import Results from "../pages/candidate/Results";

import HiringDecision from "../pages/admin/HiringDecision";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        {/* CANDIDATE */}

        <Route
          path="/candidate/dashboard"
          element={
            <RoleProtectedRoute
              allowedRoles={[
                "candidate",
              ]}
            >
              <CandidateDashboard />
            </RoleProtectedRoute>
          }
        />

        {/* ADMIN */}

        <Route
          path="/admin/dashboard"
          element={
            <RoleProtectedRoute
              allowedRoles={[
                "admin",
              ]}
            >
              <AdminDashboard />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/admin/candidates"
          element={
            <RoleProtectedRoute
              allowedRoles={["admin"]}
            >
              <Candidates />
            </RoleProtectedRoute>
          }
        />

       <Route
          path="/admin/analytics"
          element={
            <RoleProtectedRoute
              allowedRoles={["admin",]}
            >
              <Analytics />
            </RoleProtectedRoute>
          }
        />

      <Route
        path="/admin/interview/:id/decision"
        element={
          <HiringDecision />
        }
      />

        <Route
          path="/candidate/upload"
          element={
            <RoleProtectedRoute
              allowedRoles={[
                "candidate",
              ]}
            >
              <UploadResume />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/candidate/interview/:id"
          element={<Interview />}
        />

        <Route
          path="/candidate/results/:id"
          element={
            <RoleProtectedRoute allowedRoles={["candidate"]}>
              <Results />
            </RoleProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;