import React from "react";

import {
  FaBars,
  FaBell,
  FaSearch,
} from "react-icons/fa";

import { useAuth } from "../../../hooks/useAuth";

const Topbar = ({
  setSidebarOpen,
}) => {
  const { user } =
    useAuth();

  return (
    <header className="topbar">
      {/* LEFT */}

      <div className="topbar-left">
        <button
          className="menu-btn"
          onClick={() =>
            setSidebarOpen(
              true
            )
          }
        >
          <FaBars />
        </button>

        <div className="topbar-search">
          <FaSearch />

          <input
            type="text"
            placeholder="Search candidates, reports, analytics..."
          />
        </div>
      </div>

      {/* RIGHT */}

      <div className="topbar-right">
        <button className="notification-btn">
          <FaBell />

          <span className="notification-badge">
            3
          </span>
        </button>

        <div className="topbar-profile">
          <div className="topbar-avatar">
            {user?.name?.charAt(
              0
            )}
          </div>

          <div className="topbar-user-info">
            <h4>{user?.name}</h4>

            <span>
              {user?.role}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;