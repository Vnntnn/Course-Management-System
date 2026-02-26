const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const prisma = require("./config/database");
const userRoutes = require("./routes/userRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// User routes
app.use("/api/users", userRoutes);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
	res.json({ message: "Course Management System API" });
});

// Port listening
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

// Shutdown
process.on('SIGINT', async () => {
	await prisma.$disconnect();
	process.exit(0);
});