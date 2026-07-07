import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/public/Home";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";

import CandidateDashboard from "../pages/candidate/CandidateDashboard";
import UploadResume from "../pages/candidate/UploadResume";
import Interview from "../pages/candidate/Interview";
import Results from "../pages/candidate/Results";
import InterviewWorkspace from "../pages/candidate/InterviewWorkspace";
import ResumeIntelligence from "../pages/candidate/ResumeIntelligence";

import AdminDashboard from "../pages/admin/AdminDashboard";
import Candidates from "../pages/admin/Candidates";
import Analytics from "../pages/admin/Analytics";
import Reports from "../pages/admin/Reports";
import CandidateAssessment from "../pages/admin/CandidateAssessment";
import HiringDecision from "../pages/admin/HiringDecision";
import AdminPanel from "../pages/admin/AdminPanel";
import IntegrityMonitor from "../pages/admin/IntegrityMonitor";

import RoleProtectedRoute from "../components/common/RoleProtectedRoute";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* CANDIDATE */}
        <Route
          path="/candidate/dashboard"
          element={
            <RoleProtectedRoute allowedRoles={["candidate"]}>
              <CandidateDashboard />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/candidate/upload"
          element={
            <RoleProtectedRoute allowedRoles={["candidate"]}>
              <ResumeIntelligence />
            </RoleProtectedRoute>
          }
        />
        <Route path="/candidate/interview/:id" element={<Interview />} />
        <Route
          path="/candidate/results/:id"
          element={
            <RoleProtectedRoute allowedRoles={["candidate"]}>
              <Results />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/candidate/workspace"
          element={
            <RoleProtectedRoute allowedRoles={["candidate"]}>
              <InterviewWorkspace />
            </RoleProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin/dashboard"
          element={
            <RoleProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/admin/candidates"
          element={
            <RoleProtectedRoute allowedRoles={["admin"]}>
              <Candidates />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <RoleProtectedRoute allowedRoles={["admin"]}>
              <Analytics />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <RoleProtectedRoute allowedRoles={["admin"]}>
              <Reports />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/admin/interview/:id/report"
          element={
            <RoleProtectedRoute allowedRoles={["admin"]}>
              <CandidateAssessment />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/admin/interview/:id/decision"
          element={
            <RoleProtectedRoute allowedRoles={["admin"]}>
              <HiringDecision />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <RoleProtectedRoute allowedRoles={["admin"]}>
              <AdminPanel />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/admin/integrity/:sessionId"
          element={
            <RoleProtectedRoute allowedRoles={["admin"]}>
              <IntegrityMonitor />
            </RoleProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
