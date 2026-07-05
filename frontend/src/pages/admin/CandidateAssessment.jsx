import React, {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import DashboardLayout from "../../components/dashboard/shared/DashboardLayout";

import SectionHeader from "../../components/dashboard/shared/SectionHeader";

import ScoreCard from "../../components/results/ScoreCard";

import CompetencyRadar from "../../components/results/CompetencyRadar";

import RecommendationCard from "../../components/results/RecommendationCard";

import StrengthWeaknessPanel from "../../components/results/StrengthWeaknessPanel";

import IntegrityReport from "../../components/results/IntegrityReport";

import QuestionAnalysis from "../../components/results/QuestionAnalysis";

import {
  getInterview,
} from "../../services/interviewService";

import {
  getRecommendation,
} from "../../utils/recommendationEngine";

import {
  calculateTrustScore,
} from "../../utils/trustScoreCalculator";

const CandidateAssessment = () => {
  const { id } =
    useParams();

  const [report, setReport] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchData =
      async () => {
        try {
          const response =
            await getInterview(
              id
            );

          const data =
            response?.data
              ?.data ||
            response?.data ||
            response;

          setReport(data);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        Loading...
      </DashboardLayout>
    );
  }

  if (!report) {
    return (
      <DashboardLayout>
        Candidate Report Not Found
      </DashboardLayout>
    );
  }

  const scores =
    report.overallScores;

  const recommendation =
    getRecommendation(
      scores.competency
    );

  const trustScore =
    calculateTrustScore({
      warnings:
        report.warnings || 0,

      fullscreenViolations:
        report.fullscreenViolations ||
        0,

      tabSwitches:
        report.tabSwitches || 0,
    });

  return (
    <DashboardLayout>
      <SectionHeader
        title="Candidate Assessment"
        subtitle="Enterprise AI Assessment Report"
      />

      <div className="score-grid">
        <ScoreCard
          title="Technical"
          score={scores.technical}
        />

        <ScoreCard
          title="Communication"
          score={
            scores.communication
          }
        />

        <ScoreCard
          title="Confidence"
          score={scores.confidence}
        />

        <ScoreCard
          title="Problem Solving"
          score={
            scores.problemSolving
          }
        />
      </div>

      <RecommendationCard
        recommendation={
          recommendation
        }
      />

      <CompetencyRadar
        scores={scores}
      />

      <StrengthWeaknessPanel
        answers={
          report.answers || []
        }
      />

      <IntegrityReport
        trustScore={
          trustScore
        }
        warnings={
          report.warnings || 0
        }
        tabSwitches={
          report.tabSwitches || 0
        }
        fullscreenViolations={
          report.fullscreenViolations ||
          0
        }
      />

      <QuestionAnalysis
        answers={
          report.answers || []
        }
      />
    </DashboardLayout>
  );
};

export default CandidateAssessment;