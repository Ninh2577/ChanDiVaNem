import catchAsync from '../utils/catchAsync.js';
import * as ratingService from '../services/ratingService.js';

export const getStats = catchAsync(async (req, res) => {
  const { postId } = req.params;
  const stats = await ratingService.getPostRatingStats(postId);
  res.json(stats);
});

export const getUserRating = catchAsync(async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;
  const score = await ratingService.getUserRatingForPost(postId, userId);
  res.json({ score });
});

export const rate = catchAsync(async (req, res) => {
  const { postId, score } = req.body;
  const userId = req.user.id;

  const newRating = await ratingService.createOrUpdateRating({
    postId,
    userId,
    score
  });

  const stats = await ratingService.getPostRatingStats(postId);

  res.json({
    message: 'Đánh giá bài viết thành công!',
    rating: newRating,
    stats
  });
});
