import React, { useState } from "react";

import Sidebar from "./Sidebar";

import Topbar from "./Topbar";

import "../../../styles/dashboard.css";

import "../../../styles/sidebar.css";

import "../../../styles/topbar.css";

import "../../../styles/cards.css";

import "../../../styles/responsive.css";

const DashboardLayout = ({
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={
          setSidebarOpen
        }
      />

      {/* MAIN CONTENT */}

      <div className="dashboard-main">
        <Topbar
          setSidebarOpen={
            setSidebarOpen
          }
        />

        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;