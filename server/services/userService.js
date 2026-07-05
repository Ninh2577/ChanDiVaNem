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

export const getUserProfile = async (nameOrId) => {
  let user;

  // Kiểm tra nếu là ID dạng số
  if (!isNaN(nameOrId)) {
    user = await prisma.user.findUnique({
      where: { id: parseInt(nameOrId) },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        avatarUrl: true,
        bio: true,
        createdAt: true,
        posts: {
          where: { isPublished: true },
          include: {
            category: { select: { name: true, slug: true } }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
  } else {
    // Tìm kiếm tương đối bằng cách chuyển dấu gạch ngang thành khoảng trắng
    // Ví dụ: nguyen-minh-chau -> Nguyen Minh Chau
    const formattedName = nameOrId.replace(/-/g, ' ');
    user = await prisma.user.findFirst({
      where: {
        fullName: {
          equals: formattedName
        }
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        avatarUrl: true,
        bio: true,
        createdAt: true,
        posts: {
          where: { isPublished: true },
          include: {
            category: { select: { name: true, slug: true } }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
  }

  return user;
};
