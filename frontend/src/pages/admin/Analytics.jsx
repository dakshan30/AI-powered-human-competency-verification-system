import React, {
  useEffect,
  useState,
} from "react";

import DashboardLayout from "../../components/dashboard/shared/DashboardLayout";

import GlassCard from "../../components/dashboard/shared/GlassCard";

import CompetencyRadarChart from "../../components/analytics/CompetencyRadarChart";

import CompetencyProgressBar from "../../components/analytics/CompetencyProgressBar";

import HiringRecommendationCard from "../../components/analytics/HiringRecommendationCard";

import {
  getAnalytics,
} from "../../services/analyticsService";

const Analytics = () => {
  const [data, setData] =
    useState(null);

  /*
  ====================================
  FETCH
  ====================================
  */

  useEffect(() => {
    const fetchAnalytics =
      async () => {
        try {
          const response =
            await getAnalytics();

          setData(response);
        } catch (error) {
          console.log(error);
        }
      };

    fetchAnalytics();
  }, []);

  /*
  ====================================
  LOADING
  ====================================
  */

  if (!data) {
    return (
      <DashboardLayout>
        Loading...
      </DashboardLayout>
    );
  }

  const analytics =
    data.analytics;

  const topCandidate =
    data.candidateReports[0];

  return (
    <DashboardLayout>
      <div className="analytics-page">
        <div className="analytics-grid">
          <GlassCard>
            <h2>
              Competency Analytics
            </h2>

            <CompetencyRadarChart
              scores={{
                technical:
                  analytics.averageTechnical,

                communication:
                  analytics.averageCommunication,

                confidence:
                  analytics.averageConfidence,

                problemSolving:
                  analytics.averageProblemSolving,

                competency:
                  analytics.averageCompetency,
              }}
            />
          </GlassCard>

          <HiringRecommendationCard
            recommendation={
              topCandidate.recommendation
            }
          />
        </div>

        <GlassCard>
          <h2>
            Performance Metrics
          </h2>

          <CompetencyProgressBar
            label="Technical"
            value={
              analytics.averageTechnical
            }
          />

          <CompetencyProgressBar
            label="Communication"
            value={
              analytics.averageCommunication
            }
          />

          <CompetencyProgressBar
            label="Confidence"
            value={
              analytics.averageConfidence
            }
          />

          <CompetencyProgressBar
            label="Problem Solving"
            value={
              analytics.averageProblemSolving
            }
          />

          <CompetencyProgressBar
            label="Overall Competency"
            value={
              analytics.averageCompetency
            }
          />
        </GlassCard>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;