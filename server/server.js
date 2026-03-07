const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const passport = require("passport");
const prisma = require("./config/database");
const path = require("path");
const crypto = require("crypto");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
require("./config/passport")(passport);

// Middleware
app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware - auto-generate secret if not provided
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  }),
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Static resource for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API info route
app.get("/api", (req, res) => {
  res.json({ message: "Course Management System API" });
});

// API Routes (MUST come before catch-all route)
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/courses", require("./routes/courseRoutes"));
app.use("/api/content", require("./routes/contentRoutes"));
app.use("/api/enrollments", require("./routes/enrollmentRoutes"));
app.use("/api/exams", require("./routes/examRoutes"));
app.use('/api/upload', require('./routes/uploadRoutes'));

// Frontend static files (dist from Vite build)
app.use(express.static(path.join(__dirname, '../client/dist')));

// Catch-all route to serve frontend for Vue Router (MUST be last)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

module.exports = app;
