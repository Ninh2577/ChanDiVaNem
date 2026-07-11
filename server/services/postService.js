import prisma from '../config/db.js';
import AppError from '../utils/AppError.js';
import DOMPurify from 'isomorphic-dompurify';

const generateSlug = (title) => {
  return title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};

export const getAllPosts = async ({ page = 1, limit = 10, status, categoryId, authorId } = {}) => {
  const skip = (Number(page) - 1) * Number(limit);
  const where = {};
  if (status === 'published') where.isPublished = true;
  if (status === 'unpublished' || status === 'pending') where.isPublished = false;
  if (categoryId) where.categoryId = Number(categoryId);
  if (authorId) where.authorId = Number(authorId);

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      skip,
      take: Number(limit),
      include: {
        author: { select: { id: true, fullName: true } },
        category: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.post.count({ where })
  ]);
  
  return {
    posts: posts.map(post => ({
      id: post.id,
      title: post.title,
      author: post.author?.fullName || 'Khuyết danh',
      category: post.category?.name || 'Không có',
      status: post.isPublished ? 'published' : 'pending',
      date: new Date(post.createdAt).toLocaleDateString('vi-VN'),
      isFeatured: post.isFeatured
    })),
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit)
    }
  };
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

export const createPost = async (data, currentUser) => {
  const { title, content, categoryId, imageUrl, metaTitle, metaDesc, canonicalUrl, thumbnailAlt, customSlug, tagIds, isPublished } = data;
  const authorId = currentUser.id;

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

  const cleanContent = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['p','br','strong','em','u','h1','h2','h3','h4','ul','ol','li','a','img','blockquote','code','pre','span'],
    ALLOWED_ATTR: ['href','src','alt','class','target'],
  });

  const decodeEntities = (html) => {
    return html.replace(/&nbsp;/g, ' ')
               .replace(/&amp;/g, '&')
               .replace(/&quot;/g, '"')
               .replace(/&#39;/g, "'")
               .replace(/&lt;/g, '<')
               .replace(/&gt;/g, '>');
  };
  const rawText = cleanContent.replace(/<[^>]*>?/gm, '');
  const excerpt = decodeEntities(rawText).substring(0, 150) + '...';

  // Chuyển đổi tagIds từ string/number sang number nguyên
  const formattedTagIds = tagIds ? (Array.isArray(tagIds) ? tagIds.map(id => parseInt(id)) : [parseInt(tagIds)]) : [];

  // CTV luôn tạo bài viết ở trạng thái chưa xuất bản (isPublished = false)
  const isPostPublished = currentUser.role === 'ADMIN' ? (isPublished ?? false) : false;

  return await prisma.post.create({
    data: {
      title,
      slug,
      content: cleanContent,
      excerpt,
      imageUrl,
      thumbnailAlt,
      metaTitle,
      metaDesc,
      canonicalUrl,
      isPublished: isPostPublished,
      authorId,
      categoryId: validCategoryId,
      tags: {
        connect: formattedTagIds.map(id => ({ id }))
      }
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
      tags: { select: { id: true, name: true } }
    }
  });

  if (!post) {
    throw new AppError('Không tìm thấy bài viết', 404);
  }

  return post;
};

export const updatePost = async (id, data, currentUser) => {
  const post = await prisma.post.findUnique({ where: { id: parseInt(id) } });
  if (!post) {
    throw new AppError('Không tìm thấy bài viết', 404);
  }

  if (currentUser.role === 'CTV' && post.authorId !== currentUser.id) {
    throw new AppError('Bạn không có quyền chỉnh sửa bài viết này', 403);
  }

  let excerpt;
  let cleanContent;
  if (data.content) {
    cleanContent = DOMPurify.sanitize(data.content, {
      ALLOWED_TAGS: ['p','br','strong','em','u','h1','h2','h3','h4','ul','ol','li','a','img','blockquote','code','pre','span'],
      ALLOWED_ATTR: ['href','src','alt','class','target'],
    });

    const decodeEntities = (html) => {
      return html.replace(/&nbsp;/g, ' ')
                 .replace(/&amp;/g, '&')
                 .replace(/&quot;/g, '"')
                 .replace(/&#39;/g, "'")
                 .replace(/&lt;/g, '<')
                 .replace(/&gt;/g, '>');
    };
    const rawText = cleanContent.replace(/<[^>]*>?/gm, '');
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

  // Chuyển đổi tagIds từ string/number sang number nguyên
  const formattedTagIds = data.tagIds ? (Array.isArray(data.tagIds) ? data.tagIds.map(id => parseInt(id)) : [parseInt(data.tagIds)]) : undefined;

  // Chỉ Admin được cập nhật trạng thái isPublished
  const isPostPublished = currentUser.role === 'ADMIN' ? (data.isPublished !== undefined ? data.isPublished : post.isPublished) : post.isPublished;

  return await prisma.post.update({
    where: { id: parseInt(id) },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.content && { content: cleanContent, excerpt }),
      ...(data.categoryId && { categoryId: parseInt(data.categoryId) }),
      ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
      ...(data.thumbnailAlt !== undefined && { thumbnailAlt: data.thumbnailAlt }),
      ...(data.metaTitle !== undefined && { metaTitle: data.metaTitle }),
      ...(data.metaDesc !== undefined && { metaDesc: data.metaDesc }),
      ...(data.canonicalUrl !== undefined && { canonicalUrl: data.canonicalUrl }),
      ...(slug && { slug }),
      isPublished: isPostPublished,
      ...(data.isFeatured !== undefined && { isFeatured: data.isFeatured }),
      ...(formattedTagIds !== undefined && {
        tags: {
          set: formattedTagIds.map(id => ({ id }))
        }
      })
    }
  });
};

export const deletePost = async (id, currentUser) => {
  const post = await prisma.post.findUnique({ where: { id: parseInt(id) } });
  if (!post) {
    throw new AppError('Không tìm thấy bài viết', 404);
  }

  if (currentUser.role === 'CTV' && post.authorId !== currentUser.id) {
    throw new AppError('Bạn không có quyền xóa bài viết này', 403);
  }

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
