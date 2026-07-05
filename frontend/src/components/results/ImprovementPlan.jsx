import React from "react";

import {
  FaArrowRight,
  FaBook,
  FaCode,
  FaComments,
  FaLightbulb,
  FaRocket,
} from "react-icons/fa";

import "../../styles/results/improvementPlan.css";

const ImprovementPlan = ({
  scores = {},
}) => {

  const roadmap = [];

  if ((scores.technical || 0) < 80) {

    roadmap.push({
      title: "Improve Technical Knowledge",
      icon: <FaCode />,
      priority: "High",
      description:
        "Practice DSA, SQL, System Design and core programming concepts regularly.",
      duration: "2 - 4 Weeks",
    });

  }

  if ((scores.communication || 0) < 80) {

    roadmap.push({
      title: "Communication Skills",
      icon: <FaComments />,
      priority: "Medium",
      description:
        "Practice explaining technical concepts through mock interviews and presentations.",
      duration: "1 - 2 Weeks",
    });

  }

  if ((scores.confidence || 0) < 80) {

    roadmap.push({
      title: "Build Interview Confidence",
      icon: <FaRocket />,
      priority: "Medium",
      description:
        "Attend mock interviews, improve body language and maintain eye contact.",
      duration: "1 Week",
    });

  }

  if ((scores.problemSolving || 0) < 80) {

    roadmap.push({
      title: "Problem Solving",
      icon: <FaLightbulb />,
      priority: "High",
      description:
        "Solve coding challenges daily on LeetCode, HackerRank or Codeforces.",
      duration: "3 Weeks",
    });

  }

  if (roadmap.length === 0) {

    roadmap.push({

      title: "Excellent Performance",

      icon: <FaBook />,

      priority: "Completed",

      description:
        "Excellent work. Continue learning advanced technologies and participate in real-world projects.",

      duration: "Continuous",

    });

  }

  return (

    <section className="improvement-plan">

      <div className="plan-header">

        <div>

          <h2>

            Personalized Improvement Roadmap

          </h2>

          <p>

            AI generated learning recommendations based on your interview performance.

          </p>

        </div>

      </div>

      <div className="timeline">

        {

          roadmap.map(
            (
              item,
              index
            ) => (

              <div
                className="timeline-card"
                key={index}
              >

                <div className="timeline-left">

                  <div className="timeline-icon">

                    {item.icon}

                  </div>

                </div>

                <div className="timeline-content">

                  <div className="timeline-top">

                    <h3>

                      {item.title}

                    </h3>

                    <span
                      className={`priority ${item.priority.toLowerCase()}`}
                    >

                      {item.priority}

                    </span>

                  </div>

                  <p>

                    {item.description}

                  </p>

                  <div className="timeline-footer">

                    <span>

                      Estimated Time :
                      {" "}
                      {item.duration}

                    </span>

                    <FaArrowRight />

                  </div>

                </div>

              </div>

            )
          )

        }

      </div>

    </section>

  );

};

export default ImprovementPlan;