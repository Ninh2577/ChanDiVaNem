import prisma from '../config/db.js';
import AppError from '../utils/AppError.js';

const generateSlug = (name) => {
  return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};

export const getTags = async () => {
  return await prisma.tag.findMany({
    orderBy: { name: 'asc' }
  });
};

export const createTag = async (data) => {
  const { name } = data;
  if (!name || !name.trim()) {
    throw new AppError('Tên thẻ không được trống.', 400);
  }

  const slug = generateSlug(name);
  const existingTag = await prisma.tag.findFirst({
    where: { OR: [{ name }, { slug }] }
  });

  if (existingTag) {
    throw new AppError('Thẻ này đã tồn tại.', 400);
  }

  return await prisma.tag.create({
    data: { name, slug }
  });
};

export const updateTag = async (id, data) => {
  const { name } = data;
  if (!name || !name.trim()) {
    throw new AppError('Tên thẻ không được trống.', 400);
  }

  const tagId = parseInt(id);
  const slug = generateSlug(name);

  const existingTag = await prisma.tag.findFirst({
    where: {
      OR: [{ name }, { slug }],
      id: { not: tagId }
    }
  });

  if (existingTag) {
    throw new AppError('Tên hoặc slug của thẻ đã bị trùng với thẻ khác.', 400);
  }

  return await prisma.tag.update({
    where: { id: tagId },
    data: { name, slug }
  });
};

export const deleteTag = async (id) => {
  const tagId = parseInt(id);
  const tag = await prisma.tag.findUnique({ where: { id: tagId } });

  if (!tag) {
    throw new AppError('Không tìm thấy thẻ cần xóa.', 404);
  }

  return await prisma.tag.delete({
    where: { id: tagId }
  });
};
