import React from "react";

import ReactDOM from "react-dom/client";

import App from "./App";

import { AuthProvider } from "./context/AuthContext";

import { Toaster } from "react-hot-toast";

import "./styles/global.css";
import "./styles/variables.css";
import "./styles/components.css";
import "./styles/auth.css";
import "./styles/dashboard.css";
import "./styles/home.css";

const root = ReactDOM.createRoot(
  document.getElementById("root")
);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <Toaster position="top-right" />

      <App />
    </AuthProvider>
  </React.StrictMode>
);