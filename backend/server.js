require('dotenv').config({ path: '.env' });

console.log("USE_MOCK value:", process.env.USE_MOCK);
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const initializeReportsSystem = require("./utils/initializeReportsSystem");

const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const aiRoutes = require("./routes/aiRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const reportRoutes = require("./routes/reportRoutes");
const integrityRoutes = require("./routes/integrityRoutes");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// ✅ Connect to DB after dotenv is loaded
connectDB();

// ✅ Initialize Reports System
initializeReportsSystem();

const app = express();

// ✅ Middleware must come BEFORE routes
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
app.get("/", (req, res) => {
  res.json({
    message: "AI Resume Competency Verification API Running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/integrity", integrityRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});