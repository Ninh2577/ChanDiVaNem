import catchAsync from '../utils/catchAsync.js';
import * as postService from '../services/postService.js';

export const getPosts = catchAsync(async (req, res) => {
  const posts = await postService.getAllPosts();
  res.json(posts);
});

export const getPublishedPosts = catchAsync(async (req, res) => {
  const posts = await postService.getPublishedPosts();
  res.json(posts);
});

export const createPost = catchAsync(async (req, res) => {
  const { title, content, categoryId, imageUrl, metaTitle, metaDesc, canonicalUrl, thumbnailAlt, customSlug } = req.body;
  const authorId = req.user.id;

  const newPost = await postService.createPost({ 
    title, content, categoryId, authorId, imageUrl, 
    metaTitle, metaDesc, canonicalUrl, thumbnailAlt, customSlug 
  });
  
  res.status(201).json({ message: 'Tạo bài viết thành công!', post: newPost });
});

export const getPostBySlug = catchAsync(async (req, res) => {
  const { slug } = req.params;
  const post = await postService.getPostBySlug(slug);
  res.json(post);
});

export const getPostById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const post = await postService.getPostById(id);
  res.json(post);
});

export const updatePost = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updatedPost = await postService.updatePost(id, req.body);
  
  res.json({ message: 'Cập nhật bài viết thành công', post: updatedPost });
});

export const deletePost = catchAsync(async (req, res) => {
  const { id } = req.params;
  await postService.deletePost(id);
  res.json({ message: 'Xóa bài viết thành công' });
});

export const togglePostLock = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updatedPost = await postService.togglePostLock(id);

  const statusMessage = updatedPost.isPublished ? 'đã được mở khóa và hiển thị' : 'đã bị khóa và ẩn đi';
  res.json({ 
    message: `Bài viết ${statusMessage}`, 
    isPublished: updatedPost.isPublished 
  });
});

export const search = catchAsync(async (req, res) => {
  const { q } = req.query;
  const posts = await postService.searchPosts(q);
  res.json(posts);
});

export const save = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  await postService.savePost(id, userId);
  res.json({ message: 'Đã lưu bài viết thành công.' });
});

export const unsave = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  await postService.unsavePost(id, userId);
  res.json({ message: 'Đã bỏ lưu bài viết.' });
});

export const savedList = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const posts = await postService.getSavedPosts(userId);
  res.json(posts);
});
