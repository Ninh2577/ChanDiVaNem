import prisma from '../config/db.js';
import AppError from '../utils/AppError.js';

export const getCategories = async () => {
  return await prisma.category.findMany({
    include: {
      children: true
    }
  });
};

export const createCategory = async (data) => {
  return await prisma.category.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      parentId: data.parentId ? parseInt(data.parentId) : null
    }
  });
};

export const updateCategory = async (id, data) => {
  return await prisma.category.update({
    where: { id: parseInt(id) },
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      parentId: data.parentId ? parseInt(data.parentId) : null
    }
  });
};

export const deleteCategory = async (id) => {
  const postCount = await prisma.post.count({
    where: { categoryId: parseInt(id) }
  });

  if (postCount > 0) {
    throw new AppError(`Không thể xóa danh mục vì còn ${postCount} bài viết thuộc danh mục này. Vui lòng chuyển các bài viết sang danh mục khác trước.`, 400);
  }

  return await prisma.category.delete({
    where: { id: parseInt(id) }
  });
};
