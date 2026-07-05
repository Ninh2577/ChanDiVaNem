import catchAsync from '../utils/catchAsync.js';
import * as commentService from '../services/commentService.js';

export const getComments = catchAsync(async (req, res) => {
  const { postId } = req.params;
  const comments = await commentService.getCommentsForPost(postId);
  res.json(comments);
});

export const addComment = catchAsync(async (req, res) => {
  const { postId, content, parentId } = req.body;
  const authorId = req.user.id;

  const newComment = await commentService.createComment({
    postId,
    authorId,
    content,
    parentId
  });

  res.status(201).json({
    message: 'Đăng bình luận thành công!',
    comment: newComment
  });
});

export const removeComment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const role = req.user.role;

  await commentService.deleteComment(id, userId, role);

  res.json({
    message: 'Đã xóa bình luận thành công!'
  });
});
