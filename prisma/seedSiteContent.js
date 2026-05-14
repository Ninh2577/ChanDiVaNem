import prisma from '../server/config/db.js';

const defaultContent = [
  {
    key: 'home_about',
    value: JSON.stringify({
      badgeText: 'SỨ MỆNH CỦA CHÚNG TÔI',
      title: 'Lưu giữ và Lan tỏa\nTinh hoa Văn hóa Việt',
      description: 'CHÂN ĐI VÀ NẾM ra đời với khát vọng trở thành một thư viện sống động, nơi mỗi con đường bạn đi và mỗi món ăn bạn nếm đều kể một câu chuyện về lịch sử hàng nghìn năm của dân tộc. Chúng tôi không chỉ giới thiệu điểm đến, mà còn dẫn dắt bạn chạm vào linh hồn của di sản qua lăng kính hiện đại.',
      ctaText: 'Tìm hiểu thêm về di sản →',
      ctaLink: '/about',
      imageUrl: '',
      imageAlt: 'Nghệ nhân mộc',
      imageFallback: 'https://images.unsplash.com/photo-1611077544837-124b89dc19d3?auto=format&fit=crop&q=80',
      quoteText: 'Mỗi tác phẩm là một câu chuyện về con người và vùng đất Việt.'
    })
  },
  {
    key: 'home_destinations',
    value: JSON.stringify({
      sectionTitle: 'Hành trình Xuyên Việt',
      sectionSubtitle: 'Khám phá sự khác biệt tinh tế giữa ba miền đất nước.',
      cards: [
        {
          region: 'MIỀN BẮC',
          title: 'Hùng vĩ Đông Tây Bắc',
          imageUrl: '',
          imageFallback: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80',
          link: '/destinations',
          isMain: true
        },
        {
          region: 'MIỀN TRUNG',
          title: 'Di sản Cố đô',
          imageUrl: '',
          imageFallback: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&q=80',
          link: '/destinations',
          isMain: false
        },
        {
          region: 'MIỀN NAM',
          title: 'Sông nước Cửu Long',
          imageUrl: '',
          imageFallback: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
          link: '/destinations',
          isMain: false
        }
      ]
    })
  },
  {
    key: 'home_foods',
    value: JSON.stringify({
      sectionSubtitle: 'VỊ NGON XỨ VIỆT',
      sectionTitle: 'Đặc sản Tiêu biểu',
      cards: [
        {
          badge: 'HÀ NỘI',
          name: 'Phở Bò',
          description: 'Món ăn quốc hồn quốc túy với nước dùng thanh ngọt từ xương và hương hồi thảo quả đặc trưng.',
          imageUrl: '',
          imageFallback: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&q=80',
          link: ''
        },
        {
          badge: 'HUẾ',
          name: 'Bún Bò Huế',
          description: 'Đậm đà hương vị mắm ruốc, cay nồng ớt sa tế, nước dùng đỏ cam cuốn hút và tinh tế của người Huế.',
          imageUrl: '',
          imageFallback: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&q=80&w=500',
          link: ''
        },
        {
          badge: 'SÀI GÒN',
          name: 'Bánh Mì',
          description: 'Sự giao thoa văn hóa hoàn hảo giữa ổ bánh mì Pháp và nguyên liệu đặc trưng thuần Việt.',
          imageUrl: '',
          imageFallback: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=500',
          link: ''
        }
      ]
    })
  },
  {
    key: 'home_culture',
    value: JSON.stringify({
      sectionTitle: 'Góc Nhìn Văn Hóa',
      featuredPostIds: []
    })
  }
];

async function seed() {
  for (const item of defaultContent) {
    const existing = await prisma.siteContent.findUnique({ where: { key: item.key } });
    if (!existing) {
      await prisma.siteContent.create({ data: item });
      console.log(`✅ Seeded: ${item.key}`);
    } else {
      console.log(`⏭️  Already exists: ${item.key}`);
    }
  }
  console.log('Done!');
}

seed().catch(console.error).finally(() => prisma.$disconnect());
