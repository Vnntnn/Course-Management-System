const prisma = require("../config/database");

class UserService {
  async getAllUsers() {
    return await prisma.users.findMany({
      select: {
        id: true,
        full_name: true,
        email: true,
        role: true,
        created_at: true,
      },
    });
  }

  async getUserById(id) {
    return await prisma.users.findUnique({
      where: { id: parseInt(id, 10) },
      select: {
        id: true,
        full_name: true,
        email: true,
        role: true,
        created_at: true,
      },
    });
  }

  async updateUser(id, updateData) {
    const { full_name, role } = updateData;
    return await prisma.users.update({
      where: { id: parseInt(id, 10) },
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
  }

  async deleteUser(id) {
    return await prisma.users.delete({
      where: { id: parseInt(id, 10) },
    });
  }
}

module.exports = new UserService();
