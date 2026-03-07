const prisma = require("../config/database");
const bcrypt = require("bcrypt");
const { ROLES } = require("../utils/constants");

class AuthService {
  async register(userData) {
    const { full_name, email, password, role } = userData;
    const hashedPassword = await bcrypt.hash(password, 12);

    return await prisma.users.create({
      data: {
        full_name,
        email,
        password_hash: hashedPassword,
        role: role || ROLES.STUDENT,
      },
    });
  }

  async findUserByEmail(email) {
    return await prisma.users.findUnique({
      where: { email },
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
