const prisma = require("../config/database");
const bcrypt = require("bcryptjs");

exports.createUser = async (req, res) => {
  const { fullname, email, password_hash, role } = req.body;

  try {
    const user = await prisma.users.create({
      data: {
        full_name: fullname,
        email,
        password_hash,
        role: role || "student",
      },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.users.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getuserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.users.findUnique({
      where: { id: parseInt(id) },
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.users.update({
      where: { id: parseInt(id) },
      data: req.body,
    });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.users.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.registerUser = async (req, res) => {
  const { full_name, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.users.create({
      data: {
        full_name,
        email,
        password_hash: hashedPassword,
        role: role || "student", // default role is student
      },
    });
    res.status(201).json({
      message: "User registered successfully!",
      userId: newUser.id,
    });
  } catch (err) {
    res.status(400).json({
      message: "Email already been registered or invalid data!",
    });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await prisma.users.findUnique({ where: { email } });
    
    if (!user) {
      return res.status(401).json({ message: "No user email found in our database" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Password is incorrect" });
    }
    
    res.json({
      message: "Login successful!",
      userId: user.id,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
