const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("Users", {
	id : {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	fullname: {
		type: DataTypes.STRING,
		allowNull: false
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true
	},
	password_hash: {
		type: DataTypes.STRING,
		allowNull: false
	},
	role: {
		type: DataTypes.ENUM("Student", "Instructor"),
		allowNull: false,
		defaultValue: "Student"
	},
	created_id: {
		type: DataTypes.TIME,
		defaultValue: DataTypes.NOW
	}
}, {
	tableName: "users",
	timestamps: true,
	sequelize
});

module.exports = User;
