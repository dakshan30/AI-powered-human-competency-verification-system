import React from "react";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  FaHome,
  FaUpload,
  FaRobot,
  FaChartPie,
  FaUsers,
  FaChartLine,
  FaCog,
  FaSignOutAlt,
  FaClipboardList,
  FaShieldAlt,
  FaBars,
} from "react-icons/fa";

import { useAuth } from "../../../hooks/useAuth";

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
}) => {
  const { user, logout } =
    useAuth();

  const navigate =
    useNavigate();

  /*
  ====================================
  NAVIGATION
  ====================================
  */

  const candidateLinks = [
    {
      label: "Dashboard",
      path:
        "/candidate/dashboard",
      icon: <FaHome />,
    },

    {
      label: "Upload Resume",
      path:
        "/candidate/upload",
      icon: <FaUpload />,
    },

    {
      label: "Interview",
      path:
        "/candidate/interview/${interviewId}",
      icon: <FaRobot />,
    },

    {
      label: "Results",
      path:
        "/candidate/results",
      icon: <FaChartPie />,
    },

    {
      label: "Settings",
      path:
        "/candidate/settings",
      icon: <FaCog />,
    },
  ];

  const adminLinks = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: <FaHome />,
    },

    {
      label: "Candidates",
      path: "/admin/candidates",
      icon: <FaUsers />,
    },

    {
      label: "Analytics",
      path: "/admin/analytics",
      icon: <FaChartLine />,
    },

    {
      label: "Reports",
      path: "/admin/reports",
      icon: (
        <FaClipboardList />
      ),
    },

    {
      label: "Fraud Detection",
      path: "/admin/fraud",
      icon: <FaShieldAlt />,
    },

    {
      label: "Settings",
      path: "/admin/settings",
      icon: <FaCog />,
    },
  ];

  const navLinks =
    user?.role === "admin"
      ? adminLinks
      : candidateLinks;

  /*
  ====================================
  LOGOUT
  ====================================
  */

  const handleLogout = () => {
    logout();

    navigate("/login");
  };

  return (
    <>
      {/* MOBILE OVERLAY */}

      <div
        className={`sidebar-overlay ${
          sidebarOpen
            ? "active"
            : ""
        }`}
        onClick={() =>
          setSidebarOpen(false)
        }
      />

      {/* SIDEBAR */}

      <aside
        className={`sidebar ${
          sidebarOpen
            ? "sidebar-open"
            : ""
        }`}
      >
        {/* HEADER */}

        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-circle">
              AI
            </div>

            <div>
              <h2>AI Recruiter</h2>

              <span>
                Intelligence Platform
              </span>
            </div>
          </div>

          <button
            className="sidebar-close"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <FaBars />
          </button>
        </div>

        {/* USER */}

        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {user?.name?.charAt(
              0
            )}
          </div>

          <div>
            <h4>{user?.name}</h4>

            <p>
              {user?.role}
            </p>
          </div>
        </div>

        {/* NAVIGATION */}

        <nav className="sidebar-nav">
          {navLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({
                isActive,
              }) =>
                isActive
                  ? "sidebar-link active"
                  : "sidebar-link"
              }
            >
              <span className="sidebar-icon">
                {item.icon}
              </span>

              <span>
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* FOOTER */}

        <div className="sidebar-footer">
          <button
            className="logout-btn"
            onClick={
              handleLogout
            }
          >
            <FaSignOutAlt />

            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;