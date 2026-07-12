import prisma from '../config/db.js';

/** Xây dựng cây đệ quy từ mảng flat */
const buildTree = (items, parentId = null) => {
  return items
    .filter(i => i.parentId === parentId)
    .sort((a, b) => a.order - b.order)
    .map(i => ({ ...i, children: buildTree(items, i.id) }));
};

/** Lấy toàn bộ menu dạng cây (dùng cho Header và Admin) */
export const getNavigation = async () => {
  const all = await prisma.navigationItem.findMany({ orderBy: { order: 'asc' } });
  return buildTree(all);
};

/** Lấy dạng flat (dùng nội bộ khi cần) */
export const getNavigationFlat = async () => {
  return await prisma.navigationItem.findMany({ orderBy: [{ parentId: 'asc' }, { order: 'asc' }] });
};

/**
 * Lưu toàn bộ menu từ Admin.
 * Nhận vào mảng flat: [{ id?, label, path, order, isActive, parentId, icon, imageUrl, description }]
 * Xử lý: xóa hết → tạo lại (đảm bảo thứ tự và cấp cha-con đúng)
 */
export const updateNavigation = async (items) => {
  // Xóa tất cả (cascade sẽ xóa con theo)
  await prisma.navigationItem.deleteMany();

  // Sắp xếp: cha trước, con sau (để parentId luôn hợp lệ)
  const roots = items.filter(i => !i.tempParentRef);
  const children = items.filter(i => i.tempParentRef);

  // Tạo theo thứ tự: cha → con
  // Dùng mapping id tạm (client) → id thật (DB)
  const idMap = {};

  // Tạo các mục gốc trước
  for (const item of roots) {
    const created = await prisma.navigationItem.create({
      data: {
        label: item.label,
        path: item.path,
        order: item.order,
        isActive: item.isActive !== false,
        icon: item.icon || null,
        imageUrl: item.imageUrl || null,
        description: item.description || null,
        parentId: null
      }
    });
    if (item.tempId) idMap[item.tempId] = created.id;
    if (item.id && !item.tempId) idMap[item.id] = created.id;
  }

  // Tạo các mục con, nhiều cấp — lặp đến khi hết
  let remaining = [...children];
  let maxIterations = 20; // tránh vòng lặp vô hạn
  while (remaining.length > 0 && maxIterations-- > 0) {
    const nextRound = [];
    for (const item of remaining) {
      const realParentId = idMap[item.tempParentRef] || idMap[item.parentId];
      if (!realParentId) {
        nextRound.push(item); // chờ vòng sau khi cha đã được tạo
        continue;
      }
      const created = await prisma.navigationItem.create({
        data: {
          label: item.label,
          path: item.path,
          order: item.order,
          isActive: item.isActive !== false,
          icon: item.icon || null,
          imageUrl: item.imageUrl || null,
          description: item.description || null,
          parentId: realParentId
        }
      });
      if (item.tempId) idMap[item.tempId] = created.id;
      if (item.id && !item.tempId) idMap[item.id] = created.id;
    }
    remaining = nextRound;
  }

  // Đồng bộ tự động các mục menu thuộc Chuyên Mục sang bảng Category
  await syncNavigationToCategories();

  return getNavigation();
};

// Tự động đồng bộ các mục menu nằm trong "Chuyên Mục" sang CSDL Chuyên mục (Category)
const syncNavigationToCategories = async () => {
  try {
    const chuyenMucNav = await prisma.navigationItem.findFirst({
      where: { label: 'Chuyên Mục' }
    });
    if (!chuyenMucNav) return;

    const allNavs = await prisma.navigationItem.findMany();
    const parentCats = allNavs.filter(n => n.parentId === chuyenMucNav.id);
    const childCats = allNavs.filter(n => parentCats.some(p => p.id === n.parentId));
    const activeNavIds = [...parentCats, ...childCats].map(n => n.id);

    const getSlugFromNav = (nav) => {
      if (nav.path === '/culture') return 'van-hoa';
      if (nav.path === '/cuisine') return 'am-thuc';
      if (nav.path === '/destinations') return 'diem-den';
      if (nav.path.startsWith('/category/')) return nav.path.replace('/category/', '');
      return nav.label.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    };

    const navToCatIdMap = {};

    // 1. Tạo/Cập nhật các chuyên mục cha
    for (const nav of parentCats) {
      const slug = getSlugFromNav(nav);
      let cat = await prisma.category.findUnique({ where: { slug } });
      if (cat) {
        cat = await prisma.category.update({
          where: { id: cat.id },
          data: { name: nav.label, parentId: null }
        });
      } else {
        cat = await prisma.category.create({
          data: { name: nav.label, slug, parentId: null }
        });
      }
      navToCatIdMap[nav.id] = cat.id;
    }

    // 2. Tạo/Cập nhật các chuyên mục con
    for (const nav of childCats) {
      const slug = getSlugFromNav(nav);
      const parentCatId = navToCatIdMap[nav.parentId];
      let cat = await prisma.category.findUnique({ where: { slug } });
      if (cat) {
        cat = await prisma.category.update({
          where: { id: cat.id },
          data: { name: nav.label, parentId: parentCatId || null }
        });
      } else {
        cat = await prisma.category.create({
          data: { name: nav.label, slug, parentId: parentCatId || null }
        });
      }
      navToCatIdMap[nav.id] = cat.id;
    }

    // 3. Xóa các chuyên mục mồ côi không còn nằm trong menu Chuyên Mục
    const allCategories = await prisma.category.findMany();
    for (const cat of allCategories) {
      const hasNav = activeNavIds.some(navId => navToCatIdMap[navId] === cat.id);
      if (!hasNav) {
        const postCount = await prisma.post.count({ where: { categoryId: cat.id } });
        if (postCount === 0) {
          await prisma.category.delete({ where: { id: cat.id } }).catch(() => {});
        }
      }
    }
  } catch (error) {
    console.error('Lỗi đồng bộ menu sang categories:', error);
  }
};

/** Thêm 1 mục con vào cha cụ thể */
export const addNavigationChild = async ({ label, path, parentId, icon, imageUrl, description }) => {
  const siblings = await prisma.navigationItem.findMany({ where: { parentId: parseInt(parentId) } });
  const nextOrder = siblings.length + 1;

  const item = await prisma.navigationItem.create({
    data: {
      label,
      path,
      order: nextOrder,
      isActive: true,
      parentId: parseInt(parentId),
      icon: icon || null,
      imageUrl: imageUrl || null,
      description: description || null
    }
  });

  await syncNavigationToCategories();
  return item;
};

/** Thêm mục gốc (cấp 1) */
export const addRootItem = async ({ label, path, icon }) => {
  const roots = await prisma.navigationItem.findMany({ where: { parentId: null } });
  const item = await prisma.navigationItem.create({
    data: { label, path, order: roots.length + 1, isActive: true, icon: icon || null, parentId: null }
  });

  await syncNavigationToCategories();
  return item;
};

/** Cập nhật 1 mục */
export const updateItem = async (id, data) => {
  const item = await prisma.navigationItem.update({
    where: { id: parseInt(id) },
    data: {
      ...(data.label !== undefined && { label: data.label }),
      ...(data.path !== undefined && { path: data.path }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
      ...(data.icon !== undefined && { icon: data.icon || null }),
      ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl || null }),
      ...(data.description !== undefined && { description: data.description || null }),
      ...(data.parentId !== undefined && { parentId: data.parentId ? parseInt(data.parentId) : null }),
    }
  });

  await syncNavigationToCategories();
  return item;
};

/** Xóa 1 mục (cascade xóa con theo) */
export const deleteItem = async (id) => {
  const res = await prisma.navigationItem.delete({ where: { id: parseInt(id) } });
  await syncNavigationToCategories();
  return res;
};

/** Cập nhật thứ tự hàng loạt trong cùng 1 cấp */
export const reorderItems = async (orderedIds) => {
  const updates = orderedIds.map((id, index) =>
    prisma.navigationItem.update({ where: { id: parseInt(id) }, data: { order: index + 1 } })
  );
  const res = await prisma.$transaction(updates);
  await syncNavigationToCategories();
  return res;
};
