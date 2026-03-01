const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const prisma = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const passport = require("passport");
const session = require("express-session");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
require("./config/passport")(passport);

// Middleware
app.use(cors());
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.initialize());
app.use(passport.session());

// User routes
app.use("/api/users", userRoutes);

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Course Management System API" });
});

app.use("/api/auth", require("./routes/auth"));

// Port listening
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
