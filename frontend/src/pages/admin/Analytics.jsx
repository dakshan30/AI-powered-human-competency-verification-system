import React, { useEffect, useState } from "react";
import { 
  FaCalendarAlt, 
  FaUsers, 
  FaCheckCircle, 
  FaGraduationCap, 
  FaPercent, 
  FaSyncAlt,
  FaFolderOpen
} from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ComposedChart
} from "recharts";

import DashboardLayout from "../../components/dashboard/shared/DashboardLayout";
import { fetchDashboardAnalytics } from "../../services/analyticsService";
import "../../styles/analytics.css";

const Analytics = () => {
  // State for metrics data
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters State
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [groupBy, setGroupBy] = useState("monthly");

  // Fetch metrics data from aggregated analytics API
  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError("");
      
      const params = { groupBy };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const result = await fetchDashboardAnalytics(params);
      if (result && result.success) {
        setData(result.data);
      } else {
        setError(result.message || "Failed to load dashboard analytics");
      }
    } catch (err) {
      console.error("Analytics fetch error:", err);
      setError(err.message || "An unexpected error occurred while fetching analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [groupBy]);

  const handleApplyFilters = () => {
    loadAnalytics();
  };

  const handleResetFilters = () => {
    setStartDate("");
    setEndDate("");
    setGroupBy("monthly");
    // Directly fetch with default parameters after resetting local state
    const resetFetch = async () => {
      try {
        setLoading(true);
        setError("");
        const result = await fetchDashboardAnalytics({ groupBy: "monthly" });
        if (result && result.success) {
          setData(result.data);
        }
      } catch (err) {
        setError(err.message || "Reset failed");
      } finally {
        setLoading(false);
      }
    };
    resetFetch();
  };

  // Renders a high-end skeleton loader during asynchronous requests
  const renderSkeleton = () => (
    <div className="skeleton-loader">
      <div className="analytics-filters-bar skeleton-pulse" style={{ height: "78px", border: "none" }}></div>
      <div className="skeleton-metric-grid">
        <div className="skeleton-metric-card skeleton-pulse"></div>
        <div className="skeleton-metric-card skeleton-pulse"></div>
        <div className="skeleton-metric-card skeleton-pulse"></div>
        <div className="skeleton-metric-card skeleton-pulse"></div>
      </div>
      <div className="skeleton-charts-grid">
        <div className="skeleton-chart-card skeleton-pulse"></div>
        <div className="skeleton-chart-card skeleton-pulse"></div>
      </div>
    </div>
  );

  if (loading && !data) {
    return (
      <DashboardLayout>
        <div style={{ padding: "2rem" }}>
          <div className="analytics-title-area" style={{ marginBottom: "2rem" }}>
            <h1>Dashboard Analytics</h1>
            <p>Loading competency, alignment and performance statistics...</p>
          </div>
          {renderSkeleton()}
        </div>
      </DashboardLayout>
    );
  }

  // Map competency tiers and recommendation shares for Recharts
  const overview = data?.overview || {};
  const competencyTiers = data?.distributions?.competencyTiers || {};
  const recommendations = data?.distributions?.recommendations || {};
  const trends = data?.trends || [];

  const competencyTiersData = [
    { name: "0-50", value: competencyTiers["0-50"] || 0 },
    { name: "51-70", value: competencyTiers["51-70"] || 0 },
    { name: "71-85", value: competencyTiers["71-85"] || 0 },
    { name: "86-100", value: competencyTiers["86-100"] || 0 }
  ];

  const recommendationsData = [
    { name: "Strong Hire", value: recommendations.STRONG_HIRE || 0, color: "#2e7d32" },
    { name: "Hire", value: recommendations.HIRE || 0, color: "#4caf50" },
    { name: "Hold", value: recommendations.HOLD || 0, color: "#ff9800" },
    { name: "Reject", value: recommendations.REJECT || 0, color: "#d32f2f" }
  ].filter(item => item.value > 0); // Hide 0-value items in donut labels

  return (
    <DashboardLayout>
      <div style={{ padding: "2rem" }}>
        
        {/* Title Header */}
        <div className="analytics-header">
          <div className="analytics-title-area">
            <h1>Dashboard Analytics</h1>
            <p>Enterprise statistics on candidates, competencies, and system performance</p>
          </div>
        </div>

        {/* Error Alert Display */}
        {error && (
          <div className="analytics-alert analytics-alert--error">
            <p>{error}</p>
          </div>
        )}

        {/* Custom Filter Controls */}
        <div className="analytics-filters-bar">
          <div className="analytics-filter-group">
            <label>Start Date</label>
            <input 
              type="date" 
              className="analytics-input"
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)} 
            />
          </div>
          
          <div className="analytics-filter-group">
            <label>End Date</label>
            <input 
              type="date" 
              className="analytics-input" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)} 
            />
          </div>

          <div className="analytics-filter-group">
            <label>Trend Grouping</label>
            <div className="analytics-toggle-group">
              <button 
                type="button"
                className={`analytics-toggle-btn ${groupBy === "monthly" ? "analytics-toggle-btn--active" : ""}`}
                onClick={() => setGroupBy("monthly")}
              >
                Monthly
              </button>
              <button 
                type="button"
                className={`analytics-toggle-btn ${groupBy === "weekly" ? "analytics-toggle-btn--active" : ""}`}
                onClick={() => setGroupBy("weekly")}
              >
                Weekly
              </button>
            </div>
          </div>

          <button 
            type="button"
            className="analytics-reset-btn" 
            onClick={handleApplyFilters}
            style={{ backgroundColor: "#1976d2", color: "#fff", borderColor: "#1976d2" }}
          >
            Apply Filters
          </button>

          <button 
            type="button"
            className="analytics-reset-btn" 
            onClick={handleResetFilters}
          >
            <FaSyncAlt /> Reset
          </button>
        </div>

        {/* Elegant Fallback for Empty Metrics State */}
        {overview.totalInterviews === 0 ? (
          <div className="analytics-empty-state">
            <FaFolderOpen className="analytics-empty-state__icon" />
            <h3>No Analytics Data Available</h3>
            <p>There are no completed interviews that match the selected date filters. Try broadening your dates or conducts more sessions.</p>
          </div>
        ) : (
          <>
            {/* Top Metrics Bar: 4 KPI Cards */}
            <div className="analytics-overview-grid">
              <div className="metric-card metric-card--primary">
                <div className="metric-card__content">
                  <span className="metric-card__label">Total Conducted</span>
                  <span className="metric-card__value">{overview.totalInterviews}</span>
                  <span className="metric-card__change metric-card__change--up">Completed interviews</span>
                </div>
                <div className="metric-card__icon-wrapper">
                  <FaCheckCircle size={20} />
                </div>
              </div>

              <div className="metric-card metric-card--success">
                <div className="metric-card__content">
                  <span className="metric-card__label">Unique Candidates</span>
                  <span className="metric-card__value">{overview.totalCandidates}</span>
                  <span className="metric-card__change metric-card__change--up">Participated applicants</span>
                </div>
                <div className="metric-card__icon-wrapper">
                  <FaUsers size={20} />
                </div>
              </div>

              <div className="metric-card metric-card--warning">
                <div className="metric-card__content">
                  <span className="metric-card__label">Avg Competency</span>
                  <span className="metric-card__value">{overview.averageCompetency}%</span>
                  <span className="metric-card__change metric-card__change--up">Average score index</span>
                </div>
                <div className="metric-card__icon-wrapper">
                  <FaGraduationCap size={20} />
                </div>
              </div>

              <div className="metric-card metric-card--danger">
                <div className="metric-card__content">
                  <span className="metric-card__label">Hiring Conversion</span>
                  <span className="metric-card__value">{overview.hiringConversionRate}%</span>
                  <span className="metric-card__change metric-card__change--up">Hired / Total ratio</span>
                </div>
                <div className="metric-card__icon-wrapper">
                  <FaPercent size={20} />
                </div>
              </div>
            </div>

            {/* Row 1: Pipeline Performance Trends & Hiring Conversion Chart */}
            <div className="analytics-charts-row">
              {/* Trends Line Chart */}
              <div className="chart-card">
                <div className="chart-card__header">
                  <h3 className="chart-card__title">Pipeline Performance Trends</h3>
                  <span className="chart-card__subtitle">Scores over time</span>
                </div>
                <div className="chart-card__body">
                  {trends.length === 0 ? (
                    <div style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center" }}>No trend details</div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trends}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="period" tick={{ fontSize: 11, fill: "#666" }} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#666" }} />
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: "12px" }} />
                        <Line type="monotone" dataKey="averageCompetency" name="Competency Score" stroke="#1976d2" strokeWidth={2.5} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="averageATS" name="ATS Alignment" stroke="#ff9800" strokeWidth={2} />
                        <Line type="monotone" dataKey="averageTrustScore" name="Trust Score" stroke="#2e7d32" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Conversion Composed Chart */}
              <div className="chart-card">
                <div className="chart-card__header">
                  <h3 className="chart-card__title">Hiring Conversion Metrics</h3>
                  <span className="chart-card__subtitle">Session volumes vs hiring ratios</span>
                </div>
                <div className="chart-card__body">
                  {trends.length === 0 ? (
                    <div style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center" }}>No trend details</div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={trends}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="period" tick={{ fontSize: 11, fill: "#666" }} />
                        <YAxis yAxisId="left" label={{ value: 'Interviews Conducted', angle: -90, position: 'insideLeft', style: { fill: '#666', fontSize: '11px' } }} tick={{ fontSize: 11, fill: "#666" }} />
                        <YAxis yAxisId="right" orientation="right" label={{ value: 'Hiring Conversion (%)', angle: 90, position: 'insideRight', style: { fill: '#666', fontSize: '11px' } }} tick={{ fontSize: 11, fill: "#666" }} />
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: "12px" }} />
                        <Bar yAxisId="left" dataKey="totalInterviews" name="Interviews volume" fill="#1976d2" barSize={32} radius={[4, 4, 0, 0]} />
                        <Line yAxisId="right" type="monotone" dataKey="hiringConversionRate" name="Conversion Rate (%)" stroke="#2e7d32" strokeWidth={2.5} activeDot={{ r: 6 }} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>

            {/* Row 2: Competency Distribution & Recommendation Pie */}
            <div className="analytics-charts-row">
              {/* Score distributions Bar Chart */}
              <div className="chart-card">
                <div className="chart-card__header">
                  <h3 className="chart-card__title">Competency Score Distribution</h3>
                  <span className="chart-card__subtitle">Candidate frequency in competency brackets</span>
                </div>
                <div className="chart-card__body">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={competencyTiersData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#666" }} />
                      <YAxis tick={{ fontSize: 11, fill: "#666" }} allowDecimals={false} />
                      <Tooltip cursor={{ fill: "rgba(0,0,0,0.02)" }} />
                      <Bar dataKey="value" name="Candidates" barSize={40} radius={[4, 4, 0, 0]}>
                        {competencyTiersData.map((entry, index) => {
                          const colors = ["#d32f2f", "#ff9800", "#1976d2", "#2e7d32"];
                          return <Cell key={`cell-${index}`} fill={colors[index]} />;
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recommendation Donut Chart */}
              <div className="chart-card">
                <div className="chart-card__header">
                  <h3 className="chart-card__title">Recommendation Distribution</h3>
                  <span className="chart-card__subtitle">Proportional breakdown of evaluation decisions</span>
                </div>
                <div className="chart-card__body">
                  {recommendationsData.length === 0 ? (
                    <div style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center" }}>No recommendation decisions logged</div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={recommendationsData}
                          cx="50%"
                          cy="50%"
                          innerRadius={65}
                          outerRadius={90}
                          paddingAngle={4}
                          dataKey="value"
                          nameKey="name"
                        >
                          {recommendationsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} Candidates`, "Recommendation"]} />
                        <Legend layout="horizontal" align="center" verticalAlign="bottom" wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Analytics;