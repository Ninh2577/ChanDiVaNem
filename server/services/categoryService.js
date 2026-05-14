import prisma from '../config/db.js';

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
  return await prisma.category.delete({
    where: { id: parseInt(id) }
  });
};
