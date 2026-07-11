import prisma from '../config/db.js';
import AppError from '../utils/AppError.js';
import DOMPurify from 'isomorphic-dompurify';

export const getCommentsForPost = async (postId, { page = 1, limit = 10 } = {}) => {
  const skip = (Number(page) - 1) * Number(limit);

  const [rootComments, total] = await Promise.all([
    prisma.comment.findMany({
      where: {
        postId: parseInt(postId),
        parentId: null
      },
      skip,
      take: Number(limit),
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true
          }
        },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                fullName: true,
                avatarUrl: true
              }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { createdAt: 'asc' }
    }),
    prisma.comment.count({
      where: {
        postId: parseInt(postId),
        parentId: null
      }
    })
  ]);

  return {
    comments: rootComments,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit)
    }
  };
};

export const createComment = async ({ postId, authorId, content, parentId }) => {
  if (!content || !content.trim()) {
    throw new AppError('Nội dung bình luận không được để trống.', 400);
  }

  const cleanContent = DOMPurify.sanitize(content, { ALLOWED_TAGS: [] });

  if (parentId) {
    const parentComment = await prisma.comment.findUnique({
      where: { id: parseInt(parentId) }
    });
    if (!parentComment) {
      throw new AppError('Bình luận cha không tồn tại.', 404);
    }
  }

  return await prisma.comment.create({
    data: {
      content: cleanContent,
      postId: parseInt(postId),
      authorId: parseInt(authorId),
      parentId: parentId ? parseInt(parentId) : null
    },
    include: {
      author: {
        select: {
          id: true,
          fullName: true,
          avatarUrl: true
        }
      }
    }
  });
};

export const deleteComment = async (commentId, userId, role) => {
  const comment = await prisma.comment.findUnique({
    where: { id: parseInt(commentId) }
  });

  if (!comment) {
    throw new AppError('Không tìm thấy bình luận.', 404);
  }

  if (comment.authorId !== userId && role !== 'ADMIN') {
    throw new AppError('Bạn không có quyền xóa bình luận này.', 403);
  }

  // Xóa các bình luận con trực tiếp trước
  await prisma.comment.deleteMany({
    where: { parentId: parseInt(commentId) }
  });

  return await prisma.comment.delete({
    where: { id: parseInt(commentId) }
  });
};
