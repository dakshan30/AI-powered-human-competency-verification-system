import React from "react";

import { Link } from "react-router-dom";

import {
  FaRobot,
  FaChartLine,
  FaUserCheck,
  FaArrowRight,
  FaShieldAlt,
  FaBrain,
  FaUserTie,
} from "react-icons/fa";

import { motion } from "framer-motion";

import "../../styles/home.css";

const features = [
  {
    icon: <FaRobot />,
    title: "AI Resume Analysis",
    description:
      "Advanced AI-powered resume parsing and competency evaluation system.",
  },

  {
    icon: <FaBrain />,
    title: "Smart Interview Engine",
    description:
      "Generate adaptive interview questions based on candidate skills and experience.",
  },

  {
    icon: <FaChartLine />,
    title: "Competency Scoring",
    description:
      "Measure technical performance, confidence, and communication using AI.",
  },

  {
    icon: <FaShieldAlt />,
    title: "Verification System",
    description:
      "Validate claimed skills and detect competency gaps intelligently.",
  },

  {
    icon: <FaUserCheck />,
    title: "Recruitment Analytics",
    description:
      "Generate intelligent reports and recruitment insights for companies.",
  },
];

const Home = () => {
  return (
    <div className="home-page">
      {/* HERO SECTION */}

      <section className="hero-section">
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="hero-badge">
              AI Recruitment Intelligence Platform
            </span>

            <h1>
              AI Powered Resume
              <br />
              Competency Verification
              System
            </h1>

            <p>
              Analyze resumes, conduct AI-powered
              interviews, evaluate technical
              competency, and generate intelligent
              recruitment analytics using advanced AI.
            </p>

            {/* ROLE BUTTONS */}

            <div className="hero-buttons">
              <Link to="/signup">
                <button className="hero-btn primary-btn">
                  Get Started
                </button>
              </Link>

              <Link to="/login">
                <button className="hero-btn secondary-btn">
                  Login
                </button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* HERO CARD */}

        <div className="hero-image">
          <motion.div
            className="hero-card"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="hero-card-header">
              <div className="hero-dot"></div>
              <div className="hero-dot"></div>
              <div className="hero-dot"></div>
            </div>

            <div className="hero-card-body">
              <div className="analysis-item">
                <span>Resume Analysis</span>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: "92%" }}
                  ></div>
                </div>
              </div>

              <div className="analysis-item">
                <span>Technical Skills</span>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: "81%" }}
                  ></div>
                </div>
              </div>

              <div className="analysis-item">
                <span>Communication</span>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: "74%" }}
                  ></div>
                </div>
              </div>

              <div className="analysis-score">
                <h2>82%</h2>

                <p>Overall Competency Score</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}

      <section className="features-section">
        <div className="section-header">
          <h2>Core Platform Features</h2>

          <p>
            Intelligent recruitment workflow powered
            by AI and competency analytics.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-box"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              viewport={{ once: true }}
            >
              <div className="feature-icon">
                {feature.icon}
              </div>

              <h3>{feature.title}</h3>

              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}

      <section className="cta-section">
        <motion.div
          className="cta-card"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{
            opacity: 1,
            scale: 1,
          }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2>
            Transform Recruitment Using AI
          </h2>

          <p>
            Build intelligent hiring workflows with
            AI-powered competency verification and
            interview automation.
          </p>

          <Link to="/candidate/signup">
            <button className="hero-btn primary-btn">
              <FaArrowRight />

              <span>Create Account</span>
            </button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;