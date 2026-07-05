import React from "react";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

import {
  FaChartPie,
} from "react-icons/fa";

import "../../styles/results/radar.css";

const CompetencyRadar = ({
  scores,
}) => {

  const data = [

    {
      subject: "Technical",
      score:
        scores.technical,
      fullMark: 100,
    },

    {
      subject:
        "Communication",
      score:
        scores.communication,
      fullMark: 100,
    },

    {
      subject:
        "Confidence",
      score:
        scores.confidence,
      fullMark: 100,
    },

    {
      subject:
        "Problem Solving",
      score:
        scores.problemSolving,
      fullMark: 100,
    },

  ];

  const average = Math.round(

    (
      scores.technical +
      scores.communication +
      scores.confidence +
      scores.problemSolving
    ) / 4

  );

  return (

    <div className="radar-card">

      <div className="radar-header">

        <div className="radar-title">

          <FaChartPie />

          <div>

            <h2>
              Competency Analytics
            </h2>

            <p>
              AI evaluation of
              core competencies
            </p>

          </div>

        </div>

        <div className="average-score">

          <span>
            Overall Average
          </span>

          <h1>
            {average}%
          </h1>

        </div>

      </div>

      <div className="radar-chart">

        <ResponsiveContainer
          width="100%"
          height={420}
        >

          <RadarChart
            data={data}
          >

            <PolarGrid />

            <PolarAngleAxis
              dataKey="subject"
            />

            <PolarRadiusAxis
              angle={90}
              domain={[0,100]}
            />

            <Radar
              name="Competency"
              dataKey="score"
              stroke="#10B981"
              fill="#10B981"
              fillOpacity={0.45}
            />

          </RadarChart>

        </ResponsiveContainer>

      </div>

      <div className="competency-summary">

        <div className="summary-item">

          <span>
            Highest Score
          </span>

          <h4>

            {

              Object.entries({

                Technical:
                  scores.technical,

                Communication:
                  scores.communication,

                Confidence:
                  scores.confidence,

                "Problem Solving":
                  scores.problemSolving,

              }).sort(
                (a,b)=>
                  b[1]-a[1]
              )[0][0]

            }

          </h4>

        </div>

        <div className="summary-item">

          <span>
            Overall Competency
          </span>

          <h4>

            {
              scores.competency
            }%

          </h4>

        </div>

      </div>

    </div>

  );

};

export default CompetencyRadar;