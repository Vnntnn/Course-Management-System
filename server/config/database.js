const nodemon = require("nodemon");
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
	dialect: "sqlite",
	storage: "./database.sqlite",
	logging: process.env.DB_LOGGING === "true" || false
});

module.exports = sequelize;
