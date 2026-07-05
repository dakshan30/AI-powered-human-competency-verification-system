import React from "react";

import {
  Doughnut,
} from "react-chartjs-2";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const CompletionDonutChart =
  () => {
    const data = {
      labels: [
        "Completed",
        "Pending",
      ],

      datasets: [
        {
          data: [78, 22],

          backgroundColor: [
            "#3eb489",
            "#e5e7eb",
          ],

          borderWidth: 0,
        },
      ],
    };

    return (
      <Doughnut
        data={data}
      />
    );
  };

export default CompletionDonutChart;