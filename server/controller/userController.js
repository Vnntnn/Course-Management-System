const User = require("../models/User");

exports.createUser = async (req, res) => {
	const { fullname, email, password } = req.body;

	try
	{
		const user = await User.create({
			"fullname": fullname,
			"email": email,
			"password_hash": password
		});
		res.status(201).json(user);
	}
	catch (error)
	{
		res.status(400).json({error: error.message});
	}
;}

exports.getAllUsers = async (req, res) => {
	try
	{
		const users = await User.findAll();
		res.json(users);
	}
	catch (error)
	{
		res.status(500).json({error: error.message});
	}
};

exports.getuserById = async (req, res) => {
	const id  = req.params.id;

	try
	{
		const user = await User.findByPk(id);
		if (user)
			res.json(user)
		else
			res.status(404).json({error: "User not found"});
	}
	catch (error)
	{
		res.status(500).json({error: error.message});
	}
};

exports.updateUser = async (req, res) => {
	try
	{
		const user = await User.findByPk(req.params.id);
		if (user)
		{
			await user.update(req.body);
			res.json(user);
		}
		else
			res.status(404).json({ error: 'User not found' });
	} catch (error)
	{
		res.status(400).json({ error: error.message });
	}
};

exports.deleteUser = async (req, res) => {
	try
	{
		const user = await User.findByPk(req.params.id);
		if (user)
		{
			await user.destroy();
			res.json({message: "User deleted successfully"});
		}
		else
			res.status(404).json({ error: 'User not found' });
	}
	catch (error)
	{
		res.status(400).json({ error: error.message });
	}
};
