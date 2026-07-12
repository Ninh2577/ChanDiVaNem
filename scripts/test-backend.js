import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import 'dotenv/config';

const prisma = new PrismaClient();
const BACKEND_URL = 'http://localhost:5000';

// ANSI màu sắc cho log
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

async function testDatabase() {
  console.log(`\n${colors.bold}${colors.cyan}--- PHẦN A: KIỂM TRA CƠ SỞ DỮ LIỆU & ORM ---${colors.reset}`);
  try {
    await prisma.$connect();
    console.log(`${colors.green}✔ Kết nối thành công tới database qua Prisma Client.${colors.reset}`);

    // Đếm số lượng bản ghi
    const counts = {
      users: await prisma.user.count(),
      categories: await prisma.category.count(),
      posts: await prisma.post.count(),
      tags: await prisma.tag.count(),
      comments: await prisma.comment.count(),
      ratings: await prisma.rating.count(),
      ads: await prisma.adCampaign.count(),
      navs: await prisma.navigationItem.count(),
      siteContents: await prisma.siteContent.count()
    };

    console.log(`Số lượng dữ liệu hiện tại trong hệ thống:`);
    console.log(` - Người dùng (User): ${counts.users}`);
    console.log(` - Danh mục (Category): ${counts.categories}`);
    console.log(` - Bài viết (Post): ${counts.posts}`);
    console.log(` - Thẻ (Tag): ${counts.tags}`);
    console.log(` - Bình luận (Comment): ${counts.comments}`);
    console.log(` - Đánh giá (Rating): ${counts.ratings}`);
    console.log(` - Chiến dịch Quảng cáo (AdCampaign): ${counts.ads}`);
    console.log(` - Menu điều hướng (NavigationItem): ${counts.navs}`);
    console.log(` - Nội dung tĩnh CMS (SiteContent): ${counts.siteContents}`);

    // Nếu database trống hoặc thiếu dữ liệu, tự động kích hoạt Seeder
    if (counts.categories === 0 || counts.posts === 0) {
      console.log(`\n${colors.yellow}⚠ Cảnh báo: Cơ sở dữ liệu trống hoặc thiếu dữ liệu mẫu. Bắt đầu đổ dữ liệu mẫu phong phú...${colors.reset}`);
      await runSeedData();
    } else {
      console.log(`${colors.green}✔ Dữ liệu cơ sở đã sẵn sàng.${colors.reset}`);
    }

  } catch (error) {
    console.error(`${colors.red}❌ Lỗi cơ sở dữ liệu:`, error.message, colors.reset);
    process.exit(1);
  }
}

async function runSeedData() {
  try {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash('123456', saltRounds);

    console.log(` - Đang tạo tài khoản người dùng mẫu...`);
    const admin = await prisma.user.upsert({
      where: { email: 'admin@chandivanem.vn' },
      update: {},
      create: {
        email: 'admin@chandivanem.vn',
        fullName: 'Nguyễn Văn Admin',
        passwordHash,
        role: 'ADMIN',
        bio: 'Quản trị viên sáng lập blog Chân Đi Và Nếm.'
      }
    });

    const ctv = await prisma.user.upsert({
      where: { email: 'ctv@chandivanem.vn' },
      update: {},
      create: {
        email: 'ctv@chandivanem.vn',
        fullName: 'Trần Thị Tác Giả',
        passwordHash,
        role: 'CTV',
        bio: 'Biên tập viên đam mê ẩm thực đường phố và di sản Việt.'
      }
    });

    const reader = await prisma.user.upsert({
      where: { email: 'reader@chandivanem.vn' },
      update: {},
      create: {
        email: 'reader@chandivanem.vn',
        fullName: 'Lê Văn Độc Giả',
        passwordHash,
        role: 'READER',
        bio: 'Người yêu thích du lịch tự túc và chụp ảnh phong cảnh.'
      }
    });

    console.log(` - Đang tạo danh mục bài viết mẫu...`);
    const catDiemDen = await prisma.category.upsert({
      where: { slug: 'diem-den' },
      update: {},
      create: { name: 'Điểm Đến', slug: 'diem-den', description: 'Hành trình khám phá các danh lam thắng cảnh Việt Nam.' }
    });

    const catAmThuc = await prisma.category.upsert({
      where: { slug: 'am-thuc' },
      update: {},
      create: { name: 'Ẩm Thực', slug: 'am-thuc', description: 'Tinh hoa văn hóa ẩm thực và đặc sản ba miền.' }
    });

    const catVanHoa = await prisma.category.upsert({
      where: { slug: 'van-hoa' },
      update: {},
      create: { name: 'Văn Hóa', slug: 'van-hoa', description: 'Câu chuyện di sản, làng nghề cổ truyền và lễ hội dân gian.' }
    });

    // Tạo thêm danh mục con
    const subMienBac = await prisma.category.upsert({
      where: { slug: 'mien-bac' },
      update: {},
      create: { name: 'Miền Bắc', slug: 'mien-bac', parentId: catDiemDen.id }
    });

    const subMienTrung = await prisma.category.upsert({
      where: { slug: 'mien-trung' },
      update: {},
      create: { name: 'Miền Trung', slug: 'mien-trung', parentId: catDiemDen.id }
    });

    console.log(` - Đang tạo thẻ (Tags) mẫu...`);
    const tagHoiAn = await prisma.tag.upsert({ where: { slug: 'hoi-an' }, update: {}, create: { name: 'Hội An', slug: 'hoi-an' } });
    const tagHaNoi = await prisma.tag.upsert({ where: { slug: 'ha-noi' }, update: {}, create: { name: 'Hà Nội', slug: 'ha-noi' } });
    const tagPho = await prisma.tag.upsert({ where: { slug: 'pho' }, update: {}, create: { name: 'Phở', slug: 'pho' } });
    const tagCaPhe = await prisma.tag.upsert({ where: { slug: 'ca-phe' }, update: {}, create: { name: 'Cà Phê', slug: 'ca-phe' } });

    console.log(` - Đang tạo các bài viết mẫu phong phú...`);
    const post1 = await prisma.post.upsert({
      where: { slug: 'nhung-chiec-den-long-cuoi-cung-pho-hoi' },
      update: {},
      create: {
        title: 'Những Chiếc Đèn Lồng Cuối Cùng Ở Phố Hội',
        slug: 'nhung-chiec-den-long-cuoi-cung-pho-hoi',
        excerpt: 'Ký sự về làng nghề làm đèn lồng thủ công truyền thống tại phố cổ Hội An và những trăn trở giữ hồn di sản.',
        content: '<p>Đèn lồng Hội An không chỉ là vật trang trí đơn thuần mà còn là biểu tượng tinh thần, là nhịp thở văn hóa của một thương cảng sầm uất xưa kia. Trải qua hàng thế kỷ, những nghệ nhân gạo cội tại phố cổ vẫn ngày đêm tỉ mỉ chuốt từng thanh tre, bọc từng thớ vải lụa tơ tằm mềm mại để tạo nên những tác phẩm rực rỡ sắc màu.</p><p>Hành trình khám phá làng nghề làm đèn lồng sẽ đưa độc giả chạm vào chiều sâu văn hóa truyền thống cổ xưa của dải đất miền Trung đầy nắng gió.</p>',
        imageUrl: '',
        thumbnailAlt: 'Nghệ nhân làm đèn lồng Hội An bọc lụa tỉ mỉ',
        isFeatured: true,
        isPublished: true,
        authorId: ctv.id,
        categoryId: catVanHoa.id,
        tags: { connect: [{ id: tagHoiAn.id }] },
        metaTitle: 'Đèn Lồng Hội An - Ký Sự Làng Nghề Thủ Công | Chân Đi Và Nếm',
        metaDesc: 'Tìm hiểu nghề làm đèn lồng truyền thống tại phố cổ Hội An qua ký sự trải nghiệm chân thực của tác giả Chân Đi Và Nếm.',
        canonicalUrl: 'http://localhost:5173/post/nhung-chiec-den-long-cuoi-cung-pho-hoi'
      }
    });

    const post2 = await prisma.post.upsert({
      where: { slug: 'tinh-hoa-nuoc-dung-pho-ha-noi' },
      update: {},
      create: {
        title: 'Tinh Hoa Nước Dùng Phở Hà Nội',
        slug: 'tinh-hoa-nuoc-dung-pho-ha-noi',
        excerpt: 'Bí quyết ninh xương ống bò trong 24 giờ cùng các loại thảo mộc tự nhiên tạo nên bát phở truyền thống chuẩn vị Bắc.',
        content: '<p>Nói đến Phở Hà Nội, người ta thường nhớ ngay đến hương vị ngọt thanh tự nhiên của nước dùng. Nước dùng phở ngon phải được ninh từ xương ống bò luộc sạch, kết hợp hài hòa cùng hương thơm thoang thoảng của gừng nướng, hành khô nướng cháy cạnh, sá sùng khô, thảo quả, đại hồi và thanh quế mỏng.</p><p>Mỗi thìa nước dùng nóng hổi đưa vào miệng là sự tổng hòa tinh tế của vị ngọt đậm từ tủy xương và mùi thơm nồng nàn của đất trời xứ Bắc.</p>',
        imageUrl: '',
        thumbnailAlt: 'Bát phở bò nóng hổi thơm phức hành hoa',
        isFeatured: true,
        isPublished: true,
        authorId: ctv.id,
        categoryId: catAmThuc.id,
        tags: { connect: [{ id: tagHaNoi.id }, { id: tagPho.id }] },
        metaTitle: 'Cách Ninh Nước Dùng Phở Hà Nội Chuẩn Vị Bắc | Chân Đi Và Nếm',
        metaDesc: 'Bí quyết chế biến và hầm nước dùng phở bò Hà Nội truyền thống của các thương hiệu phở gia truyền lâu đời.',
        canonicalUrl: 'http://localhost:5173/post/tinh-hoa-nuoc-dung-pho-ha-noi'
      }
    });

    const post3 = await prisma.post.upsert({
      where: { slug: 'ca-phe-sua-da-van-hoa-via-he-sai-gon' },
      update: {},
      create: {
        title: 'Cà Phê Sữa Đá: Văn Hóa Vỉa Hè Sài Gòn',
        slug: 'ca-phe-sua-da-van-hoa-via-he-sai-gon',
        excerpt: 'Một ly cà phê sữa đá pha phin mát lạnh bên góc đường vỉa hè nhộn nhịp đã trở thành linh hồn buổi sáng của người Sài Gòn.',
        content: '<p>Cà phê sữa đá Sài Gòn giản dị mà đi sâu vào đời sống hàng ngày của người dân nơi đây. Từ người lao động bình dân đến doanh nhân sang trọng, tất cả đều có thể tìm thấy góc quen thuộc bên chiếc ghế nhựa vỉa hè để nhâm nhi ly cà phê đắng ngậy, trò chuyện rôm rả.</p>',
        imageUrl: '',
        thumbnailAlt: 'Ly cà phê sữa đá pha phin chảy chậm rãi',
        isFeatured: false,
        isPublished: true,
        authorId: admin.id,
        categoryId: catAmThuc.id,
        tags: { connect: [{ id: tagCaPhe.id }] },
        metaTitle: 'Cà phê sữa đá Sài Gòn - Nét đẹp văn hóa vỉa hè | Chân Đi Và Nếm',
        metaDesc: 'Khám phá câu chuyện đằng sau ly cà phê sữa đá phin đậm đà đặc trưng trong đời sống thường nhật của Sài Gòn.',
        canonicalUrl: 'http://localhost:5173/post/ca-phe-sua-da-van-hoa-via-he-sai-gon'
      }
    });

    console.log(` - Đang tạo bình luận mẫu...`);
    const c1 = await prisma.comment.create({
      data: {
        content: 'Bài viết viết rất cảm xúc và chân thực. Tôi đã đến Hội An 3 lần và đèn lồng luôn làm tôi mê đắm.',
        authorId: reader.id,
        postId: post1.id
      }
    });

    await prisma.comment.create({
      data: {
        content: 'Cảm ơn bạn đã yêu mến di sản Hội An! Sắp tới mình sẽ ra mắt bài viết về làng gốm Thanh Hà nữa nhé.',
        authorId: ctv.id,
        postId: post1.id,
        parentId: c1.id
      }
    });

    console.log(` - Đang tạo đánh giá sao (Ratings) mẫu...`);
    await prisma.rating.upsert({
      where: { userId_postId: { userId: reader.id, postId: post1.id } },
      update: {},
      create: { score: 5, userId: reader.id, postId: post1.id }
    });

    await prisma.rating.upsert({
      where: { userId_postId: { userId: admin.id, postId: post1.id } },
      update: {},
      create: { score: 5, userId: admin.id, postId: post1.id }
    });

    await prisma.rating.upsert({
      where: { userId_postId: { userId: reader.id, postId: post2.id } },
      update: {},
      create: { score: 4, userId: reader.id, postId: post2.id }
    });

    console.log(` - Đang tạo các chiến dịch Quảng cáo (Banner/Popup) mẫu...`);
    await prisma.adCampaign.create({
      data: {
        title: 'Chiến dịch Quảng cáo Du lịch Tây Bắc 2026',
        imageUrl: '/uploads/ads/northwest_travel.jpg',
        targetUrl: 'https://vietnamtourism.gov.vn/',
        position: 'POPUP_CENTER',
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-12-31'),
        contractValue: 50000000,
        displayInterval: 5,
        isActive: true
      }
    });

    await prisma.adCampaign.create({
      data: {
        title: 'Quảng cáo Đặc sản Quà Việt',
        imageUrl: '/uploads/ads/gift_viet.jpg',
        targetUrl: 'https://vietnamtourism.gov.vn/',
        position: 'BANNER_SIDEBAR',
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-12-31'),
        contractValue: 12000000,
        isActive: true
      }
    });

    console.log(` - Đang tạo thanh điều hướng (NavigationItems) mẫu...`);
    const nav1 = await prisma.navigationItem.create({ data: { label: 'Trang Chủ', path: '/', order: 1 } });
    const nav2 = await prisma.navigationItem.create({ data: { label: 'Chuyên Mục', path: '#', order: 2 } });
    await prisma.navigationItem.create({ data: { label: 'Điểm Đến', path: '/destinations', order: 1, parentId: nav2.id } });
    await prisma.navigationItem.create({ data: { label: 'Ẩm Thực', path: '/cuisine', order: 2, parentId: nav2.id } });
    await prisma.navigationItem.create({ data: { label: 'Văn Hóa', path: '/culture', order: 3, parentId: nav2.id } });
    await prisma.navigationItem.create({ data: { label: 'Về Chúng Tôi', path: '/about', order: 3 } });
    await prisma.navigationItem.create({ data: { label: 'Liên Hệ', path: '/contact', order: 4 } });

    console.log(` - Đang cấu hình nội dung tĩnh CMS trang chủ mẫu...`);
    const mockAbout = {
      badgeText: 'SỨ MỆNH CỦA CHÚNG TÔI',
      title: 'Lưu giữ và Lan tỏa\nTinh hoa Văn hóa Việt',
      description: 'CHÂN ĐI VÀ NẾM ra đời với khát vọng trở thành một thư viện sống động, nơi mỗi con đường bạn đi và mỗi món ăn bạn nếm đều kể một câu chuyện về lịch sử hàng nghìn năm của dân tộc.',
      ctaText: 'Tìm hiểu thêm về di sản →',
      ctaLink: '/about',
      imageFallback: 'https://images.unsplash.com/photo-1611077544837-124b89dc19d3?auto=format&fit=crop&q=80',
      quoteText: 'Mỗi tác phẩm là một câu chuyện về con người và vùng đất Việt.'
    };
    const mockDestinations = {
      sectionTitle: 'Hành trình Xuyên Việt',
      sectionSubtitle: 'Khám phá sự khác biệt tinh tế giữa ba miền đất nước.',
      cards: [
        { region: 'MIỀN BẮC', title: 'Hùng vĩ Đông Tây Bắc', imageFallback: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80', link: '/destinations', isMain: true },
        { region: 'MIỀN TRUNG', title: 'Di sản Cố đô', imageFallback: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&q=80', link: '/destinations', isMain: false },
        { region: 'MIỀN NAM', title: 'Sông nước Cửu Long', imageFallback: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=600', link: '/destinations', isMain: false },
      ]
    };
    const mockFoods = {
      sectionSubtitle: 'VỊ NGON XỨ VIỆT',
      sectionTitle: 'Đặc sản Tiêu biểu',
      cards: [
        { badge: 'HÀ NỘI', name: 'Phở Bò', description: 'Món ăn quốc hồn quốc túy với nước dùng thanh ngọt từ xương và hương hồi thảo quả đặc trưng.', imageFallback: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&q=80', link: '' },
        { badge: 'HUẾ', name: 'Bún Bò Huế', description: 'Đậm đà hương vị mắm ruốc, cay nồng ớt sa tế, nước dùng đỏ cam cuốn hút và tinh tế của người Huế.', imageFallback: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&q=80&w=500', link: '' },
        { badge: 'SÀI GÒN', name: 'Bánh Mì', description: 'Sự giao thoa văn hóa hoàn hảo giữa ổ bánh mì Pháp và nguyên liệu đặc trưng thuần Việt.', imageFallback: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=500', link: '' },
      ]
    };

    await prisma.siteContent.upsert({ where: { key: 'home_about' }, update: {}, create: { key: 'home_about', value: JSON.stringify(mockAbout) } });
    await prisma.siteContent.upsert({ where: { key: 'home_destinations' }, update: {}, create: { key: 'home_destinations', value: JSON.stringify(mockDestinations) } });
    await prisma.siteContent.upsert({ where: { key: 'home_foods' }, update: {}, create: { key: 'home_foods', value: JSON.stringify(mockFoods) } });
    await prisma.siteContent.upsert({ where: { key: 'home_culture' }, update: {}, create: { key: 'home_culture', value: JSON.stringify({ sectionTitle: 'Góc Nhìn Văn Hóa', featuredPostIds: [post1.id, post2.id] }) } });

    console.log(`${colors.green}✔ Đổ dữ liệu mẫu thành công! CSDL của bạn hiện tại đã đầy đủ và sinh động.${colors.reset}`);
  } catch (err) {
    console.error(`${colors.red}❌ Lỗi trong quá trình Seed dữ liệu mẫu:`, err.message, colors.reset);
  }
}

async function testApiEndpoints() {
  console.log(`\n${colors.bold}${colors.cyan}--- PHẦN B: KIỂM TRA ĐẦU CUỐI API (HTTP PINGS) ---${colors.reset}`);
  
  const endpoints = [
    { name: 'Health Check', path: '/api/health', expectedStatus: 200 },
    { name: 'Bài viết Đã xuất bản', path: '/api/posts/published', expectedStatus: 200 },
    { name: 'Danh sách Danh mục', path: '/api/categories', expectedStatus: 200 },
    { name: 'Danh sách Thẻ (Tags)', path: '/api/tags', expectedStatus: 200 }
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetch(`${BACKEND_URL}${ep.path}`);
      if (res.status === ep.expectedStatus) {
        const body = await res.json();
        console.log(`${colors.green}✔ [${ep.name}] GET ${ep.path} -> ${res.status} OK (Trả về ${Array.isArray(body) ? body.length : '1'} bản ghi)${colors.reset}`);
      } else {
        console.log(`${colors.red}❌ [${ep.name}] GET ${ep.path} -> Trả về HTTP Code ${res.status} (Kỳ vọng ${ep.expectedStatus})${colors.reset}`);
      }
    } catch (err) {
      console.log(`${colors.red}❌ [${ep.name}] GET ${ep.path} -> Lỗi kết nối API Server! (Hãy chắc chắn backend đang chạy trên cổng 5000)${colors.reset}`);
    }
  }
}

async function testAuthMiddleware() {
  console.log(`\n${colors.bold}${colors.cyan}--- PHẦN C: KIỂM TRA LUỒNG XÁC THỰC & BẢO MẬT (AUTH FLOW) ---${colors.reset}`);
  
  const uniqueSuffix = Date.now();
  const testUser = {
    email: `test_reader_${uniqueSuffix}@chandivanem.vn`,
    password: 'password123',
    fullName: 'Độc Giả Thử Nghiệm'
  };

  let token = '';

  // 1. Đăng ký tài khoản mới
  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });

    if (res.status === 201) {
      console.log(`${colors.green}✔ Đăng ký tài khoản thử nghiệm thành công (Status 201).${colors.reset}`);
    } else {
      const err = await res.json();
      console.log(`${colors.red}❌ Đăng ký thất bại -> Status ${res.status}: ${err.message}${colors.reset}`);
      return;
    }
  } catch (err) {
    console.log(`${colors.red}❌ Lỗi kết nối đăng ký tài khoản: ${err.message}${colors.reset}`);
    return;
  }

  // 2. Đăng nhập để lấy token
  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUser.email, password: testUser.password })
    });

    if (res.status === 200) {
      const data = await res.json();
      token = data.token;
      console.log(`${colors.green}✔ Đăng nhập thành công, nhận JWT Token bảo mật.${colors.reset}`);
    } else {
      const err = await res.json();
      console.log(`${colors.red}❌ Đăng nhập thất bại -> Status ${res.status}: ${err.message}${colors.reset}`);
      return;
    }
  } catch (err) {
    console.log(`${colors.red}❌ Lỗi kết nối đăng nhập: ${err.message}${colors.reset}`);
    return;
  }

  // 3. Truy vấn API cần phân quyền sử dụng Token
  try {
    const res = await fetch(`${BACKEND_URL}/api/posts/saved-list/all`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (res.status === 200) {
      console.log(`${colors.green}✔ Middleware verifyToken hoạt động tốt. Lấy thành công danh sách bài viết đã lưu.${colors.reset}`);
    } else {
      console.log(`${colors.red}❌ Lỗi truy vấn API bảo mật -> Status ${res.status}${colors.reset}`);
    }
  } catch (err) {
    console.log(`${colors.red}❌ Lỗi kết nối kiểm thử API bảo mật: ${err.message}${colors.reset}`);
  }

  // Dọn dẹp tài khoản thử nghiệm
  try {
    const dbUser = await prisma.user.findUnique({ where: { email: testUser.email } });
    if (dbUser) {
      await prisma.user.delete({ where: { id: dbUser.id } });
      console.log(`${colors.green}✔ Đã dọn dẹp tài khoản thử nghiệm khỏi cơ sở dữ liệu.${colors.reset}`);
    }
  } catch (err) {
    console.log(`${colors.yellow}⚠ Cảnh báo dọn dẹp tài khoản thử nghiệm thất bại: ${err.message}${colors.reset}`);
  }
}

async function main() {
  console.log(`${colors.bold}${colors.cyan}================================================================`);
  console.log(`        BẮT ĐẦU CHẨN ĐOÁN HỆ THỐNG BACKEND CHÂN ĐI VÀ NẾM`);
  console.log(`================================================================${colors.reset}`);
  
  await testDatabase();
  await testApiEndpoints();
  await testAuthMiddleware();
  
  await prisma.$disconnect();
  console.log(`\n${colors.bold}${colors.green}--- CHẨN ĐOÁN HOÀN TẤT ---${colors.reset}\n`);
}

main();
