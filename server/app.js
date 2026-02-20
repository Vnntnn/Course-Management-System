const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const UserRouter = require("./routes/userRoutes");
const sequelize = require("./config/database");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

app.use("/users", UserRouter);

app.get("/", (req, res) => {
	res.json({msg: "hello"});
});

const startServer = async () => {
	try
	{
		await sequelize.sync({alter: true});
		console.log("Sequelize Logging:", process.env.SEQUELIZE_LOG === "true");

		console.log("Database synced succesfully.");
		app.listen(port, () => {
			console.log(`running service at PORT ${port}`);
		});
	}
	catch (error)
	{
		console.error("Failed to start service:", error);
	}
}

startServer();
