import prisma from '../config/db.js';
import AppError from '../utils/AppError.js';

export const getUsers = async ({ page = 1, limit = 10, role } = {}) => {
  const skip = (Number(page) - 1) * Number(limit);
  const where = {};
  if (role && role !== 'all') {
    where.role = role;
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: Number(limit),
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
        avatarUrl: true
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.user.count({ where })
  ]);

  return {
    users,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit)
    }
  };
};

export const deleteUser = async (id) => {
  const postCount = await prisma.post.count({
    where: { authorId: parseInt(id) }
  });

  if (postCount > 0) {
    throw new AppError(`Không thể xóa tài khoản vì người dùng này đã viết ${postCount} bài viết trên hệ thống. Vui lòng chuyển giao bài viết hoặc xử lý bài viết trước khi xóa.`, 400);
  }

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

export const getAuthorProfile = async (id) => {
  const authorId = parseInt(id);
  const author = await prisma.user.findUnique({
    where: { id: authorId },
    select: {
      id: true,
      fullName: true,
      avatarUrl: true,
      bio: true,
      createdAt: true,
      role: true
    }
  });

  if (!author || author.role === 'READER') {
    throw new AppError('Không tìm thấy tác giả hoặc người dùng này không phải là tác giả.', 404);
  }

  return author;
};
