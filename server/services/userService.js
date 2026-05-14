import prisma from '../config/db.js';

export const getUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      createdAt: true,
      avatarUrl: true
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const deleteUser = async (id) => {
  await prisma.user.delete({
    where: { id: parseInt(id) }
  });
};
