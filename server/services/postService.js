import prisma from '../config/db.js';
import AppError from '../utils/AppError.js';

const generateSlug = (title) => {
  return title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};

export const getAllPosts = async () => {
  const posts = await prisma.post.findMany({
    include: {
      author: { select: { fullName: true } },
      category: { select: { name: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
  
  return posts.map(post => ({
    id: post.id,
    title: post.title,
    author: post.author?.fullName || 'Khuyết danh',
    category: post.category?.name || 'Không có',
    status: post.isPublished ? 'published' : 'pending',
    date: new Date(post.createdAt).toLocaleDateString('vi-VN')
  }));
};

export const getPublishedPosts = async () => {
  const posts = await prisma.post.findMany({
    where: { isPublished: true },
    include: {
      author: { select: { fullName: true, avatarUrl: true } },
      category: { select: { name: true, slug: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
  
  return posts;
};

export const createPost = async ({ title, content, categoryId, authorId, imageUrl, metaTitle, metaDesc, canonicalUrl, thumbnailAlt, customSlug }) => {
  if (!authorId) {
    throw new AppError('Bạn chưa đăng nhập.', 401);
  }

  // Ưu tiên customSlug nếu có, không thì tự generate từ title
  let slug = customSlug ? generateSlug(customSlug) : generateSlug(title);
  const existingSlug = await prisma.post.findUnique({ where: { slug } });
  if(existingSlug) {
    slug = slug + '-' + Date.now();
  }

  let validCategoryId = parseInt(categoryId);
  if (!validCategoryId || isNaN(validCategoryId)) {
    let defaultCat = await prisma.category.findFirst();
    if (!defaultCat) {
      defaultCat = await prisma.category.create({ data: { name: 'Chung', slug: 'chung' } });
    }
    validCategoryId = defaultCat.id;
  }

  const decodeEntities = (html) => {
    return html.replace(/&nbsp;/g, ' ')
               .replace(/&amp;/g, '&')
               .replace(/&quot;/g, '"')
               .replace(/&#39;/g, "'")
               .replace(/&lt;/g, '<')
               .replace(/&gt;/g, '>');
  };
  const rawText = content.replace(/<[^>]*>?/gm, '');
  const excerpt = decodeEntities(rawText).substring(0, 150) + '...';

  return await prisma.post.create({
    data: {
      title,
      slug,
      content,
      excerpt,
      imageUrl,
      thumbnailAlt,
      metaTitle,
      metaDesc,
      canonicalUrl,
      isPublished: false,
      authorId,
      categoryId: validCategoryId
    }
  });
};

export const getPostBySlug = async (slug) => {
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: { select: { fullName: true, avatarUrl: true, bio: true } },
      category: { select: { name: true, slug: true } },
      tags: true,
    }
  });

  if (!post) {
    throw new AppError('Không tìm thấy bài viết', 404);
  }

  await prisma.post.update({
    where: { slug },
    data: { viewCount: { increment: 1 } }
  });

  return post;
};

export const getPostById = async (id) => {
  const post = await prisma.post.findUnique({
    where: { id: parseInt(id) },
    include: {
      category: { select: { id: true, name: true } },
    }
  });

  if (!post) {
    throw new AppError('Không tìm thấy bài viết', 404);
  }

  return post;
};

export const updatePost = async (id, data) => {
  let excerpt;
  if (data.content) {
    const decodeEntities = (html) => {
      return html.replace(/&nbsp;/g, ' ')
                 .replace(/&amp;/g, '&')
                 .replace(/&quot;/g, '"')
                 .replace(/&#39;/g, "'")
                 .replace(/&lt;/g, '<')
                 .replace(/&gt;/g, '>');
    };
    const rawText = data.content.replace(/<[^>]*>?/gm, '');
    excerpt = decodeEntities(rawText).substring(0, 150) + '...';
  }

  // Xử lý slug nếu người dùng muốn thay đổi
  let slug = data.slug;
  if (slug) {
    slug = generateSlug(slug);
    // Kiểm tra xem slug mới có trùng với bài khác không
    const existing = await prisma.post.findFirst({
      where: { slug, id: { not: parseInt(id) } }
    });
    if (existing) {
      slug = slug + '-' + Date.now();
    }
  }

  return await prisma.post.update({
    where: { id: parseInt(id) },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.content && { content: data.content, excerpt }),
      ...(data.categoryId && { categoryId: parseInt(data.categoryId) }),
      ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
      ...(data.thumbnailAlt !== undefined && { thumbnailAlt: data.thumbnailAlt }),
      ...(data.metaTitle !== undefined && { metaTitle: data.metaTitle }),
      ...(data.metaDesc !== undefined && { metaDesc: data.metaDesc }),
      ...(data.canonicalUrl !== undefined && { canonicalUrl: data.canonicalUrl }),
      ...(slug && { slug }),
      ...(data.isPublished !== undefined && { isPublished: data.isPublished }),
      ...(data.isFeatured !== undefined && { isFeatured: data.isFeatured }),
    }
  });
};

export const deletePost = async (id) => {
  await prisma.post.delete({
    where: { id: parseInt(id) }
  });
};

export const togglePostLock = async (id) => {
  const post = await prisma.post.findUnique({
    where: { id: parseInt(id) },
    select: { isPublished: true }
  });

  if (!post) {
    throw new AppError('Không tìm thấy bài viết', 404);
  }

  return await prisma.post.update({
    where: { id: parseInt(id) },
    data: { isPublished: !post.isPublished }
  });
};

export const searchPosts = async (query) => {
  if (!query || !query.trim()) {
    return [];
  }
  const posts = await prisma.post.findMany({
    where: {
      isPublished: true,
      OR: [
        { title: { contains: query } },
        { excerpt: { contains: query } },
        { content: { contains: query } }
      ]
    },
    include: {
      author: { select: { fullName: true } },
      category: { select: { name: true, slug: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
  return posts;
};

export const savePost = async (postId, userId) => {
  return await prisma.user.update({
    where: { id: parseInt(userId) },
    data: {
      savedPosts: {
        connect: { id: parseInt(postId) }
      }
    }
  });
};

export const unsavePost = async (postId, userId) => {
  return await prisma.user.update({
    where: { id: parseInt(userId) },
    data: {
      savedPosts: {
        disconnect: { id: parseInt(postId) }
      }
    }
  });
};

export const getSavedPosts = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId) },
    select: {
      savedPosts: {
        include: {
          author: { select: { fullName: true } },
          category: { select: { name: true, slug: true } }
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });
  return user ? user.savedPosts : [];
};
