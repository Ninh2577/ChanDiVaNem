import prisma from '../config/db.js';
import AppError from '../utils/AppError.js';

// Chuyển đổi slug chuyên mục sang đường dẫn menu (bao gồm các trang tĩnh tùy chỉnh)
const getPathForSlug = (slug) => {
  if (slug === 'van-hoa') return '/culture';
  if (slug === 'am-thuc') return '/cuisine';
  if (slug === 'diem-den') return '/destinations';
  return `/category/${slug}`;
};

// Đồng bộ tự động chuyên mục với NavigationItem
const syncMenuForItem = async (category, show, oldPath = null) => {
  const currentPath = getPathForSlug(category.slug);
  const searchPath = oldPath || currentPath;

  // Tìm NavigationItem tương ứng với chuyên mục
  const existingNav = await prisma.navigationItem.findFirst({
    where: { path: searchPath }
  });

  if (show) {
    let navParentId = null;

    if (category.parentId) {
      // Tìm chuyên mục cha
      const parentCat = await prisma.category.findUnique({
        where: { id: category.parentId }
      });
      if (parentCat) {
        // Tìm menu item ứng với chuyên mục cha
        const parentNav = await prisma.navigationItem.findFirst({
          where: { path: getPathForSlug(parentCat.slug) }
        });
        if (parentNav) {
          navParentId = parentNav.id;
        }
      }
    } else {
      // Không có cha thì lồng dưới menu "Chuyên Mục" (nếu tồn tại trên menu chính)
      const rootChuyenMuc = await prisma.navigationItem.findFirst({
        where: { label: 'Chuyên Mục' }
      });
      if (rootChuyenMuc) {
        navParentId = rootChuyenMuc.id;
      }
    }

    if (existingNav) {
      await prisma.navigationItem.update({
        where: { id: existingNav.id },
        data: {
          label: category.name,
          path: currentPath,
          parentId: navParentId
        }
      });
    } else {
      const siblings = await prisma.navigationItem.findMany({
        where: { parentId: navParentId }
      });
      const nextOrder = siblings.length + 1;

      await prisma.navigationItem.create({
        data: {
          label: category.name,
          path: currentPath,
          order: nextOrder,
          isActive: true,
          parentId: navParentId
        }
      });
    }
  } else {
    // Ẩn/Xóa khỏi menu nếu tồn tại
    if (existingNav) {
      await prisma.navigationItem.delete({
        where: { id: existingNav.id }
      });
    }
  }
};

export const getCategories = async () => {
  const categories = await prisma.category.findMany({
    include: {
      children: true
    }
  });

  // Lấy toàn bộ các mục menu để map trạng thái showInMenu
  const navItems = await prisma.navigationItem.findMany();

  return categories.map(cat => {
    const expectedPath = getPathForSlug(cat.slug);
    const hasMenu = navItems.some(item => item.path === expectedPath);
    return {
      ...cat,
      showInMenu: hasMenu
    };
  });
};

export const createCategory = async (data) => {
  const cat = await prisma.category.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      parentId: data.parentId ? parseInt(data.parentId) : null
    }
  });

  if (data.showInMenu) {
    await syncMenuForItem(cat, true);
  }

  return { ...cat, showInMenu: !!data.showInMenu };
};

export const updateCategory = async (id, data) => {
  const oldCat = await prisma.category.findUnique({ where: { id: parseInt(id) } });
  if (!oldCat) throw new AppError('Không tìm thấy chuyên mục', 404);

  const cat = await prisma.category.update({
    where: { id: parseInt(id) },
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      parentId: data.parentId ? parseInt(data.parentId) : null
    }
  });

  const oldPath = getPathForSlug(oldCat.slug);
  await syncMenuForItem(cat, !!data.showInMenu, oldPath);

  return { ...cat, showInMenu: !!data.showInMenu };
};

export const deleteCategory = async (id) => {
  const cat = await prisma.category.findUnique({ where: { id: parseInt(id) } });
  if (!cat) throw new AppError('Không tìm thấy chuyên mục', 404);

  const postCount = await prisma.post.count({
    where: { categoryId: parseInt(id) }
  });

  if (postCount > 0) {
    throw new AppError(`Không thể xóa danh mục vì còn ${postCount} bài viết thuộc danh mục này. Vui lòng chuyển các bài viết sang danh mục khác trước.`, 400);
  }

  // Tự động xóa khỏi menu điều hướng nếu có
  await prisma.navigationItem.deleteMany({
    where: { path: `/category/${cat.slug}` }
  });

  return await prisma.category.delete({
    where: { id: parseInt(id) }
  });
};
