import React, {
  useEffect,
  useState,
} from "react";

import {
  FaUsers,
  FaUserCheck,
  FaClock,
  FaClipboardCheck,
} from "react-icons/fa";

import DashboardLayout from "../../components/dashboard/shared/DashboardLayout";
import SectionHeader from "../../components/dashboard/shared/SectionHeader";
import DashboardGrid from "../../components/dashboard/shared/DashboardGrid";
import StatCard from "../../components/dashboard/shared/StatCard";
import AnalyticsCard from "../../components/dashboard/shared/AnalyticsCard";
import ActivityCard from "../../components/dashboard/shared/ActivityCard";
import CompetencyRadarChart from "../../components/charts/CompetencyRadarChart";
import LoadingSkeleton from "../../components/dashboard/shared/LoadingSkeleton";

import {
  getDashboardStats,
} from "../../services/dashboardService";

const AdminDashboard = () => {

  const [dashboard,setDashboard] =
    useState(null);

  const [loading,setLoading] =
    useState(true);

  useEffect(()=>{

    const loadDashboard =
      async()=>{

        try{

          const response =
            await getDashboardStats();

          setDashboard(
            response.data
          );

        }

        catch(error){

          console.error(
            error
          );

        }

        finally{

          setLoading(false);

        }

      };

    loadDashboard();

  },[]);

  if(loading){

    return(

      <DashboardLayout>

        <DashboardGrid>

          <LoadingSkeleton/>

          <LoadingSkeleton/>

          <LoadingSkeleton/>

          <LoadingSkeleton/>

        </DashboardGrid>

      </DashboardLayout>

    );

  }

  const overview =
    dashboard?.overview || {};

  const recommendation =
    dashboard?.recommendations || {};

  const recentActivity =
    dashboard?.recentActivity || [];

  return(

    <DashboardLayout>

      <SectionHeader

        title="Admin Dashboard"

        subtitle="Enterprise AI Recruitment Intelligence Dashboard"

      />

      <DashboardGrid>

        <StatCard

          title="Candidates"

          value={
            overview.totalCandidates || 0
          }

          growth={`${overview.completedInterviews || 0} Completed`}

          icon={<FaUsers/>}

        />

        <StatCard

          title="Completed"

          value={
            overview.completedInterviews || 0
          }

          growth={`${overview.pendingInterviews || 0} Pending`}

          icon={<FaClipboardCheck/>}

        />

        <StatCard

          title="Average Competency"

          value={`${overview.averageCompetency || 0}%`}

          growth={`${overview.averageTechnical || 0}% Technical`}

          icon={<FaUserCheck/>}

        />

        <StatCard

          title="Average Trust"

          value={`${overview.averageTrustScore || 0}%`}

          growth={`${overview.averageATS || 0}% ATS`}

          icon={<FaClock/>}

        />

      </DashboardGrid>

      <div className="analytics-section">

        <AnalyticsCard

          title="AI Competency Overview"

        >

          <CompetencyRadarChart

            technical={
              overview.averageTechnical || 0
            }

            communication={
              overview.averageCommunication || 0
            }

            confidence={
              overview.averageConfidence || 0
            }

            problemSolving={
              overview.averageProblemSolving || 0
            }

          />

        </AnalyticsCard>

        <AnalyticsCard

          title="Hiring Recommendation"

        >

          <div className="recommendation-grid">

            <div className="recommendation-card">

              <h4>

                Strong Hire

              </h4>

              <h2>

                {recommendation.strongHire || 0}

              </h2>

            </div>

            <div className="recommendation-card">

              <h4>

                Hire

              </h4>

              <h2>

                {recommendation.hire || 0}

              </h2>

            </div>

            <div className="recommendation-card">

              <h4>

                Hold

              </h4>

              <h2>

                {recommendation.hold || 0}

              </h2>

            </div>

            <div className="recommendation-card">

              <h4>

                Reject

              </h4>

              <h2>

                {recommendation.reject || 0}

              </h2>

            </div>

          </div>

        </AnalyticsCard>

      </div>

      <ActivityCard

        activities={recentActivity}

      />

    </DashboardLayout>

  );

};

export default AdminDashboard;