import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "../../styles/results/resultsLayout.css";

import { getInterview } from "../../services/interviewService";

import ReportHeader from "../../components/results/ReportHeader";
import ScoreCard from "../../components/results/ScoreCard";
import CompetencyRadar from "../../components/results/CompetencyRadar";
import RecommendationCard from "../../components/results/RecommendationCard";
import StrengthWeaknessPanel from "../../components/results/StrengthWeaknessPanel";
import ImprovementPlan from "../../components/results/ImprovementPlan";
import QuestionAnalysis from "../../components/results/QuestionAnalysis";
import IntegrityReport from "../../components/results/IntegrityReport";

import { getRecommendation } from "../../utils/recommendationEngine";
import { calculateTrustScore } from "../../utils/trustScoreCalculator";

const Results = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchInterview = async () => {
            try {
                setLoading(true);

                const response = await getInterview(id);

                const data =
                    response?.data?.data ||
                    response?.data ||
                    response;

                setReport(data);
            } catch (err) {
                console.error(err);
                setError("Unable to load interview report.");
            } finally {
                setLoading(false);
            }
        };

        fetchInterview();
    }, [id]);

    const scores = useMemo(() => ({
        technical: report?.overallScores?.technical || 0,
        communication: report?.overallScores?.communication || 0,
        confidence: report?.overallScores?.confidence || 0,
        problemSolving: report?.overallScores?.problemSolving || 0,
        competency: report?.overallScores?.competency || 0
    }), [report]);

    const recommendation = useMemo(
        () => getRecommendation(scores.competency),
        [scores]
    );

    const trustScore = useMemo(
        () =>
            calculateTrustScore({
                warnings: report?.warnings || 0,
                tabSwitches: report?.tabSwitches || 0,
                fullscreenViolations:
                    report?.fullscreenViolations || 0
            }),
        [report]
    );

    if (loading) {
        return (
            <div className="results-loading">
                <div className="loader"></div>
                <h2>Generating AI Assessment Report...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="results-error">
                <h2>{error}</h2>

                <button
                    onClick={() => navigate("/candidate/dashboard")}
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="results-container">

            <ReportHeader
                report={report}
                recommendation={recommendation}
                competency={scores.competency}
            />

            <section className="score-grid">

                <ScoreCard
                    title="Technical"
                    score={scores.technical}
                />

                <ScoreCard
                    title="Communication"
                    score={scores.communication}
                />

                <ScoreCard
                    title="Confidence"
                    score={scores.confidence}
                />

                <ScoreCard
                    title="Problem Solving"
                    score={scores.problemSolving}
                />

            </section>

            <section className="analytics-grid">

                <CompetencyRadar
                    scores={scores}
                />

                <RecommendationCard
                    recommendation={recommendation}
                    competency={scores.competency}
                />

            </section>

            <StrengthWeaknessPanel
                answers={report?.answers || []}
            />

            <ImprovementPlan
                scores={scores}
                recommendation={recommendation}
            />

            <QuestionAnalysis
                answers={report?.answers || []}
            />

            <IntegrityReport
                trustScore={trustScore}
                warnings={report?.warnings || 0}
                tabSwitches={report?.tabSwitches || 0}
                fullscreenViolations={
                    report?.fullscreenViolations || 0
                }
            />

            <div className="results-footer">

                <button
                    className="dashboard-btn"
                    onClick={() =>
                        navigate("/candidate/dashboard")
                    }
                >
                    Back to Dashboard
                </button>

            </div>

        </div>
    );
};

export default Results;