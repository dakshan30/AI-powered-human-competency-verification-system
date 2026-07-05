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
  () => {
    const data = {
      labels: [
        "Technical",
        "Communication",
        "Leadership",
        "Problem Solving",
        "Confidence",
        "Adaptability",
      ],

      datasets: [
        {
          label:
            "Competency Score",

          data: [
            85,
            74,
            68,
            88,
            71,
            82,
          ],

          backgroundColor:
            "rgba(62,180,137,0.2)",

          borderColor:
            "#3eb489",

          borderWidth: 2,
        },
      ],
    };

    const options = {
      responsive: true,

      plugins: {
        legend: {
          display: false,
        },
      },

      scales: {
        r: {
          min: 0,
          max: 100,
        },
      },
    };

    return (
      <Radar
        data={data}
        options={options}
      />
    );
  };

export default CompetencyRadarChart;