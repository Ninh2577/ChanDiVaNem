// Script seed dữ liệu menu mặc định
import prisma from '../server/config/db.js';

const defaultNavItems = [
  { label: 'Trang Chủ', path: '/', order: 1, isActive: true },
  { label: 'Điểm Đến', path: '/destinations', order: 2, isActive: true },
  { label: 'Ẩm Thực', path: '/cuisine', order: 3, isActive: true },
  { label: 'Văn Hóa', path: '/culture', order: 4, isActive: true },
  { label: 'Góc Chia Sẻ', path: '/blog', order: 5, isActive: true },
  { label: 'Liên Hệ', path: '/contact', order: 6, isActive: true },
  { label: 'Về Chúng Tôi', path: '/about', order: 7, isActive: true },
];

async function seedNavigation() {
  const existing = await prisma.navigationItem.count();
  if (existing > 0) {
    console.log(`✅ Navigation items already seeded (${existing} items). Skipping.`);
    return;
  }

  await prisma.navigationItem.createMany({ data: defaultNavItems });
  console.log(`✅ Seeded ${defaultNavItems.length} navigation items successfully!`);
}

seedNavigation()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
