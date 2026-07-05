import React from "react";

import {
  FaChartLine,
  FaBrain,
  FaRobot,
  FaCheckCircle,
} from "react-icons/fa";

import DashboardLayout from "../../components/dashboard/shared/DashboardLayout";

import SectionHeader from "../../components/dashboard/shared/SectionHeader";

import DashboardGrid from "../../components/dashboard/shared/DashboardGrid";

import StatCard from "../../components/dashboard/shared/StatCard";

import ProgressCard from "../../components/dashboard/shared/ProgressCard";

import AnalyticsCard from "../../components/dashboard/shared/AnalyticsCard";

import ActivityCard from "../../components/dashboard/shared/ActivityCard";

import CompetencyRadarChart from "../../components/charts/CompetencyRadarChart";

import CompletionDonutChart from "../../components/charts/CompletionDonutChart";

import {
  candidateStats,
  recentActivities,
} from "../../utils/mockData";

const CandidateDashboard =
  () => {
    return (
      <DashboardLayout>
        <SectionHeader
          title="Candidate Dashboard"
          subtitle="Track your AI interview performance and competency progress."
        />

        {/* STATS */}

        <DashboardGrid>
          <StatCard
            title="Competency Score"
            value="82%"
            growth="+12%"
            icon={
              <FaChartLine />
            }
          />

          <StatCard
            title="AI Evaluation"
            value="91%"
            growth="+8%"
            icon={<FaBrain />}
          />

          <StatCard
            title="Interview Progress"
            value="68%"
            growth="+4%"
            icon={<FaRobot />}
          />

          <StatCard
            title="Verification"
            value="Verified"
            growth="+100%"
            icon={
              <FaCheckCircle />
            }
          />
        </DashboardGrid>

        {/* ANALYTICS */}

        <div className="analytics-section">
          <AnalyticsCard title="Competency Analysis">
            <CompetencyRadarChart />
          </AnalyticsCard>

          <AnalyticsCard title="Completion Status">
            <CompletionDonutChart />
          </AnalyticsCard>

          <ActivityCard
            activities={
              recentActivities
            }
          />
        </div>

        {/* PROGRESS */}

        <DashboardGrid>
          <ProgressCard
            title="Resume Analysis"
            progress={92}
            subtitle="Resume successfully parsed and verified."
          />

          <ProgressCard
            title="Interview Completion"
            progress={68}
            subtitle="Continue AI interview assessment."
          />

          <ProgressCard
            title="Skill Verification"
            progress={74}
            subtitle="Technical competency verification in progress."
          />
        </DashboardGrid>
      </DashboardLayout>
    );
  };

export default CandidateDashboard;