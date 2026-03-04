const prisma = require("../config/database");

/**
 * Get all users
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.users.findMany({
      select: {
        id: true,
        full_name: true,
        email: true,
        role: true,
        created_at: true,
      },
    });
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve users", error: error.message });
  }
};

/**
 * Get user by ID
 */
exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.users.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        full_name: true,
        email: true,
        role: true,
        created_at: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve user", error: error.message });
  }
};

/**
 * Update user details
 */
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { full_name, role } = req.body;

  try {
    const user = await prisma.users.update({
      where: { id: parseInt(id) },
      data: {
        ...(full_name && { full_name }),
        ...(role && { role }),
      },
      select: {
        id: true,
        full_name: true,
        email: true,
        role: true,
      },
    });
    res.json({ message: "User updated successfully", user });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to update user", error: error.message });
  }
};

/**
 * Delete a user
 */
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.users.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to delete user", error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.users.findUnique({ where: { email } });

    if (!user) {
      return res
        .status(401)
        .json({ message: "No user email found in our database" });
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
