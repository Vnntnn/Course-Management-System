const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const passport = require("passport");
const prisma = require("./config/database");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
require("./config/passport")(passport);

// Global Middleware
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallback_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" },
  }),
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes definitions
app.get("/", (req, res) => {
  res.json({ message: "Course Management System API" });
});

// API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/courses", require("./routes/courseRoutes"));
app.use("/api/content", require("./routes/contentRoutes"));
app.use("/api/enrollments", require("./routes/enrollmentRoutes"));
app.use("/api/exams", require("./routes/examRoutes"));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
