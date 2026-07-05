import React from "react";

import {
  Radar,
} from "react-chartjs-2";

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const CompetencyRadarChart =
  ({ scores }) => {
    const data = {
      labels: [
        "Technical",
        "Communication",
        "Confidence",
        "Problem Solving",
        "Competency",
      ],

      datasets: [
        {
          label:
            "Candidate Scores",

          data: [
            scores.technical,

            scores.communication,

            scores.confidence,

            scores.problemSolving,

            scores.competency,
          ],
        },
      ],
    };

    return (
      <div className="chart-card">
        <Radar data={data} />
      </div>
    );
  };

export default CompetencyRadarChart;