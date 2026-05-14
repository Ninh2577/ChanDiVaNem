import 'dotenv/config';
import bcrypt from 'bcrypt';
import prisma from '../server/config/db.js';

const siteContents = [
  {
    key: 'home_about',
    value: JSON.stringify({
      badgeText: 'SU MENH CUA CHUNG TOI',
      title: 'Luu giu va Lan toa\nTinh hoa Van hoa Viet',
      description:
        'CHAN DI VA NEM la noi luu giu cac cau chuyen du lich, am thuc va di san Viet Nam duoi goc nhin hien dai, de doc gia vua tim thay thong tin huu ich vua cam duoc chieu sau van hoa.',
      ctaText: 'Tim hieu them ve di san ->',
      ctaLink: '/about',
      imageUrl: '',
      imageAlt: 'Nghe nhan Viet Nam',
      imageFallback:
        'https://images.unsplash.com/photo-1611077544837-124b89dc19d3?auto=format&fit=crop&q=80',
      quoteText: 'Moi hanh trinh la mot cach cham vao linh hon vung dat Viet.',
    }),
  },
  {
    key: 'home_destinations',
    value: JSON.stringify({
      sectionTitle: 'Hanh trinh Xuyen Viet',
      sectionSubtitle: 'Kham pha nhung mien dat noi bat tu Bac vao Nam.',
      cards: [
        {
          region: 'MIEN BAC',
          title: 'Sac mau Tay Bac',
          imageUrl: '',
          imageFallback:
            'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80',
          link: '/destinations',
          isMain: true,
        },
        {
          region: 'MIEN TRUNG',
          title: 'Hoi An va Co do',
          imageUrl: '',
          imageFallback:
            'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&q=80',
          link: '/culture',
          isMain: false,
        },
        {
          region: 'MIEN NAM',
          title: 'Song nuoc Mien Tay',
          imageUrl: '',
          imageFallback:
            'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80',
          link: '/destinations',
          isMain: false,
        },
      ],
    }),
  },
  {
    key: 'home_foods',
    value: JSON.stringify({
      sectionSubtitle: 'VI NGON XU VIET',
      sectionTitle: 'Dac san Tieu bieu',
      cards: [
        {
          badge: 'HA NOI',
          name: 'Pho Bo',
          description: 'Nuoc dung thanh, thom hoi va thao qua, dai dien cho am thuc Bac.',
          imageUrl: '',
          imageFallback:
            'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&q=80',
          link: '/blog',
        },
        {
          badge: 'HUE',
          name: 'Bun Bo Hue',
          description: 'Vi dam da, cay nong, mang dau an ro net cua am thuc co do.',
          imageUrl: '',
          imageFallback:
            'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&q=80&w=500',
          link: '/blog',
        },
        {
          badge: 'SAI GON',
          name: 'Banh Mi',
          description: 'Mon an duong pho tieu bieu voi su giao thoa giua Au va Viet.',
          imageUrl: '',
          imageFallback:
            'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=500',
          link: '/blog',
        },
      ],
    }),
  },
  {
    key: 'home_culture',
    value: JSON.stringify({
      sectionTitle: 'Goc nhin Van hoa',
      featuredPostIds: [],
    }),
  },
];

const navigationItems = [
  {
    label: 'Trang Chu',
    path: '/',
    order: 1,
    isActive: true,
    icon: 'Home',
    children: {
      create: [
        {
          label: 'Du lich moi nhat',
          path: '/destinations',
          order: 1,
          isActive: true,
          icon: 'MapPin',
          description: 'Tong hop cac diem den noi bat.',
        },
      ],
    },
  },
  {
    label: 'Diem Den',
    path: '/destinations',
    order: 2,
    isActive: true,
    icon: 'MapPin',
  },
  {
    label: 'Am Thuc',
    path: '/cuisine',
    order: 3,
    isActive: true,
    icon: 'UtensilsCrossed',
  },
  {
    label: 'Van Hoa',
    path: '/culture',
    order: 4,
    isActive: true,
    icon: 'Landmark',
  },
  {
    label: 'Goc Chia Se',
    path: '/blog',
    order: 5,
    isActive: true,
    icon: 'BookOpen',
  },
  {
    label: 'Lien He',
    path: '/contact',
    order: 6,
    isActive: true,
    icon: 'Phone',
  },
  {
    label: 'Ve Chung Toi',
    path: '/about',
    order: 7,
    isActive: true,
    icon: 'Users',
  },
];

async function main() {
  const adminPasswordHash = await bcrypt.hash('Admin123456@', 10);
  const ctvPasswordHash = await bcrypt.hash('Ctv123456@', 10);
  const readerPasswordHash = await bcrypt.hash('Reader123456@', 10);

  const [admin, contributor, reader] = await Promise.all([
    prisma.user.create({
      data: {
        fullName: 'Quan Tri Vien',
        email: 'admin@chandivanem.local',
        passwordHash: adminPasswordHash,
        role: 'ADMIN',
        bio: 'Quan tri noi dung, danh muc va cac bai viet noi bat tren he thong.',
      },
    }),
    prisma.user.create({
      data: {
        fullName: 'Nguyen Minh Chau',
        email: 'ctv@chandivanem.local',
        passwordHash: ctvPasswordHash,
        role: 'CTV',
        bio: 'Cong tac vien chuyen viet ve du lich, van hoa va trai nghiem dia phuong.',
      },
    }),
    prisma.user.create({
      data: {
        fullName: 'Tran Ha Linh',
        email: 'reader@chandivanem.local',
        passwordHash: readerPasswordHash,
        role: 'READER',
        bio: 'Doc gia yeu thich luu tru cac bai viet du lich va am thuc Viet Nam.',
      },
    }),
  ]);

  const destination = await prisma.category.create({
    data: {
      name: 'Diem Den',
      slug: 'diem-den',
      description: 'Tong hop cac bai viet ve dia diem du lich va trai nghiem.',
    },
  });

  const cuisine = await prisma.category.create({
    data: {
      name: 'Am Thuc',
      slug: 'am-thuc',
      description: 'Cac mon ngon, dac san va van hoa an uong ba mien.',
    },
  });

  const culture = await prisma.category.create({
    data: {
      name: 'Van Hoa',
      slug: 'van-hoa',
      description: 'Le hoi, di san, lang nghe va nhung cau chuyen van hoa Viet.',
    },
  });

  await Promise.all([
    prisma.category.create({
      data: {
        name: 'Mien Nui Phia Bac',
        slug: 'mien-nui-phia-bac',
        description: 'Nhom bai viet ve Tay Bac va Dong Bac.',
        parentId: destination.id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Mon Nuoc',
        slug: 'mon-nuoc',
        description: 'Pho, bun, hu tieu va cac mon nuoc tieu bieu.',
        parentId: cuisine.id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Di San',
        slug: 'di-san',
        description: 'Noi dung lien quan den di san vat the va phi vat the.',
        parentId: culture.id,
      },
    }),
  ]);

  const [tagHeritage, tagFood, tagTravel, tagFestival] = await Promise.all([
    prisma.tag.create({ data: { name: 'Di San', slug: 'di-san' } }),
    prisma.tag.create({ data: { name: 'Am Thuc', slug: 'am-thuc' } }),
    prisma.tag.create({ data: { name: 'Du Lich', slug: 'du-lich' } }),
    prisma.tag.create({ data: { name: 'Le Hoi', slug: 'le-hoi' } }),
  ]);

  const postOne = await prisma.post.create({
    data: {
      title: 'Pho co Hoi An va nhung chiec den long cuoi ngay',
      slug: 'pho-co-hoi-an-va-nhung-chiec-den-long-cuoi-ngay',
      excerpt: 'Hoi An hien ra nhu mot khung tranh vang nhe, noi du khach co the cham vao nhiep song va di san song.',
      content:
        '<p>Hoi An la diem hen cua nhung ai muon tim lai nhip song cham va chieu sau van hoa. Ban co the bat dau tu nhung con hem nho, ghe tham cac ngoi nha co, roi ket thuc ngay bang mot bua an dia phuong don gian nhung day tinh te.</p><p>Bai viet nay cung goi y lich trinh nhe trong 2 ngay 1 dem cho du khach moi den lan dau.</p>',
      imageUrl: '',
      thumbnailAlt: 'Pho co Hoi An lung linh den long',
      metaTitle: 'Pho co Hoi An va nhung chiec den long cuoi ngay',
      metaDesc: 'Goi y trai nghiem Hoi An voi lich trinh nhe, diem di bo dep va net duyen cua pho co.',
      canonicalUrl: 'https://chandivanem.local/post/pho-co-hoi-an-va-nhung-chiec-den-long-cuoi-ngay',
      isPublished: true,
      isFeatured: true,
      viewCount: 128,
      authorId: contributor.id,
      categoryId: culture.id,
      tags: {
        connect: [{ id: tagHeritage.id }, { id: tagTravel.id }],
      },
    },
  });

  const postTwo = await prisma.post.create({
    data: {
      title: 'Pho bo Ha Noi va 5 chi tiet lam nen vi ngon kho quen',
      slug: 'pho-bo-ha-noi-va-5-chi-tiet-lam-nen-vi-ngon-kho-quen',
      excerpt: 'Tu nuoc dung, banh pho den hanh la, moi chi tiet nho deu gop phan tao nen mot bat pho tron vi.',
      content:
        '<p>Pho bo Ha Noi khong chi la mon an sang quen thuoc ma con la mot he ngon ngu am thuc. Huong vi den tu xuong ham lau, gung nuong, thao qua va cach canh lua chon thit bo phu hop.</p><p>Bai viet tong hop cac diem can nho khi thuong thuc va goi y dia diem cho nguoi moi bat dau.</p>',
      imageUrl: '',
      thumbnailAlt: 'Bat pho bo Ha Noi nong hoi',
      metaTitle: 'Pho bo Ha Noi va 5 chi tiet lam nen vi ngon kho quen',
      metaDesc: 'Giai ma vi ngon cua pho bo Ha Noi qua nuoc dung, thit bo va thao tac phuc vu.',
      canonicalUrl: 'https://chandivanem.local/post/pho-bo-ha-noi-va-5-chi-tiet-lam-nen-vi-ngon-kho-quen',
      isPublished: true,
      isFeatured: false,
      viewCount: 94,
      authorId: admin.id,
      categoryId: cuisine.id,
      tags: {
        connect: [{ id: tagFood.id }, { id: tagTravel.id }],
      },
    },
  });

  const postThree = await prisma.post.create({
    data: {
      title: 'Cho phien Bac Ha duoc giu lai trong anh sang som',
      slug: 'cho-phien-bac-ha-duoc-giu-lai-trong-anh-sang-som',
      excerpt: 'Mot bai viet dang cho duyet ve cho phien Bac Ha, nhan vat va sac mau van hoa vung cao.',
      content:
        '<p>Cho phien Bac Ha la noi hoi tu cua nhieu nhom dan toc voi van hoa mac, am thuc va giao thuong dac sac. Bai viet dang trong giai doan bien tap cuoi.</p>',
      imageUrl: '',
      thumbnailAlt: 'Cho phien Bac Ha buoi som',
      metaTitle: 'Cho phien Bac Ha duoc giu lai trong anh sang som',
      metaDesc: 'Goc nhin ve cho phien Bac Ha va doi song van hoa tren cao nguyen.',
      canonicalUrl: 'https://chandivanem.local/post/cho-phien-bac-ha-duoc-giu-lai-trong-anh-sang-som',
      isPublished: false,
      isFeatured: false,
      viewCount: 12,
      authorId: contributor.id,
      categoryId: destination.id,
      tags: {
        connect: [{ id: tagTravel.id }, { id: tagFestival.id }],
      },
    },
  });

  await Promise.all([
    prisma.comment.create({
      data: {
        content: 'Bai viet rat co khong khi, doc xong muon ghe Hoi An ngay.',
        authorId: reader.id,
        postId: postOne.id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'Phan mo ta nuoc dung pho rat chi tiet va de hinh dung.',
        authorId: contributor.id,
        postId: postTwo.id,
      },
    }),
    prisma.rating.create({
      data: {
        score: 5,
        userId: reader.id,
        postId: postOne.id,
      },
    }),
    prisma.rating.create({
      data: {
        score: 4,
        userId: reader.id,
        postId: postTwo.id,
      },
    }),
    prisma.newsletterSubscriber.create({
      data: { email: 'subscriber@chandivanem.local' },
    }),
    prisma.user.update({
      where: { id: reader.id },
      data: {
        savedPosts: {
          connect: [{ id: postOne.id }, { id: postTwo.id }],
        },
      },
    }),
  ]);

  await Promise.all([
    prisma.contributorApplication.create({
      data: {
        fullName: 'Le Bao Ngoc',
        phone: '0901234567',
        email: 'baongoc.ctv@example.com',
        portfolioLink: 'https://example.com/portfolio/baongoc',
        favoriteCategory: 'Van Hoa',
        experience: 'Da cong tac voi mot so du an noi dung du lich dia phuong va chup anh le hoi.',
        status: 'PENDING',
      },
    }),
    prisma.contributorApplication.create({
      data: {
        fullName: 'Pham Quoc Viet',
        phone: '0912345678',
        email: 'quocviet.ctv@example.com',
        portfolioLink: 'https://example.com/portfolio/quocviet',
        favoriteCategory: 'Am Thuc',
        experience: 'Co kinh nghiem viet review mon an va hanh trinh street food.',
        status: 'APPROVED',
      },
    }),
  ]);

  for (const item of navigationItems) {
    await prisma.navigationItem.create({ data: item });
  }

  await prisma.siteContent.createMany({
    data: siteContents,
  });

  await prisma.siteContent.update({
    where: { key: 'home_culture' },
    data: {
      value: JSON.stringify({
        sectionTitle: 'Goc nhin Van hoa',
        featuredPostIds: [postOne.id, postTwo.id],
      }),
    },
  });

  console.log('Seeded database successfully.');
  console.log('Admin:', admin.email, '/ Admin123456@');
  console.log('CTV:', contributor.email, '/ Ctv123456@');
  console.log('Reader:', reader.email, '/ Reader123456@');
  console.log('Pending post id:', postThree.id);
}

main()
  .catch(error => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
