import React from "react";

import {
  FaChartLine,
  FaBrain,
  FaCheckCircle,
  FaRobot,
} from "react-icons/fa";

import DashboardLayout from "../components/dashboard/shared/DashboardLayout";

import StatCard from "../components/dashboard/shared/StatCard";

import ProfileCard from "../components/dashboard/ProfileCard";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="dashboard-page">
        <div className="dashboard-header">
          <h1>
            AI Competency Dashboard
          </h1>

          <p>
            Analyze candidate performance,
            interview progress, and AI
            competency metrics.
          </p>
        </div>

        <div className="stats-grid">
          <StatCard
            title="Overall Score"
            value="82%"
            subtitle="AI competency performance"
            icon={<FaChartLine />}
          />

          <StatCard
            title="Technical Skills"
            value="76%"
            subtitle="Technical assessment"
            icon={<FaBrain />}
          />

          <StatCard
            title="Verified Skills"
            value="12"
            subtitle="Skills successfully verified"
            icon={<FaCheckCircle />}
          />

          <StatCard
            title="AI Interviews"
            value="4"
            subtitle="Completed interviews"
            icon={<FaRobot />}
          />
        </div>

        <div className="dashboard-grid">
          <ProfileCard />

          <div className="activity-card">
            <h3>Recent Activity</h3>

            <div className="activity-item">
              Resume uploaded successfully
            </div>

            <div className="activity-item">
              AI interview completed
            </div>

            <div className="activity-item">
              Competency report generated
            </div>

            <div className="activity-item">
              Skill evaluation updated
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;