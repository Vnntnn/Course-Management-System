const prisma = require("../config/database");
const bcrypt = require("bcryptjs");
const { ROLES } = require("../utils/constants");

class AuthService {
  async register(userData) {
    const { full_name, email, password, role } = userData;
    const normalizedEmail = email?.trim()?.toLowerCase();
    const hashedPassword = await bcrypt.hash(password, 12);

    return await prisma.users.create({
      data: {
        full_name,
        email: normalizedEmail,
        password_hash: hashedPassword,
        role: role || ROLES.STUDENT,
      },
    });
  }

  async findUserByEmail(email) {
    const normalizedEmail = email?.trim()?.toLowerCase();
    return await prisma.users.findUnique({
      where: { email: normalizedEmail },
    });
  }

  async findUserProfile(userId) {
    return await prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        full_name: true,
        email: true,
        role: true,
        created_at: true,
      },
    });
  }
}

module.exports = new AuthService();
