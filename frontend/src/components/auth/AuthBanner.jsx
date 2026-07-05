import React from "react";
import { motion } from "framer-motion";
import { FaRobot, FaChartLine, FaUserCheck } from "react-icons/fa";


const features = [
  {
    icon: <FaRobot />,
    title: "AI Resume Analysis",
    description:
      "Analyze candidate resumes intelligently using AI-powered competency verification.",
  },
  {
    icon: <FaChartLine />,
    title: "Skill Evaluation",
    description:
      "Evaluate technical strengths, weaknesses, and performance metrics.",
  },
  {
    icon: <FaUserCheck />,
    title: "Interview Automation",
    description:
      "Generate adaptive interview questions questions and competency reports.",
  },
];

const AuthBanner = () => {
  return (
    <div className="auth-banner">
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h1 className="banner-title">
          AI Powered Resume Competency Verification System
        </h1>

        <p className="banner-subtitle">
          Smart recruitment intelligence powered by AI-driven resume analysis,
          interview evaluation, and competency scoring.
        </p>

        <div className="banner-features">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>

              <div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthBanner;