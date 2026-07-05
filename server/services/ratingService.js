import prisma from '../config/db.js';
import AppError from '../utils/AppError.js';

export const getPostRatingStats = async (postId) => {
  const ratings = await prisma.rating.findMany({
    where: { postId: parseInt(postId) }
  });

  const totalCount = ratings.length;
  const averageScore = totalCount > 0
    ? parseFloat((ratings.reduce((sum, r) => sum + r.score, 0) / totalCount).toFixed(1))
    : 0;

  return {
    postId: parseInt(postId),
    averageScore,
    totalCount
  };
};

export const getUserRatingForPost = async (postId, userId) => {
  const rating = await prisma.rating.findUnique({
    where: {
      userId_postId: {
        userId: parseInt(userId),
        postId: parseInt(postId)
      }
    }
  });

  return rating ? rating.score : null;
};

export const createOrUpdateRating = async ({ postId, userId, score }) => {
  const valScore = parseInt(score);
  if (isNaN(valScore) || valScore < 1 || valScore > 5) {
    throw new AppError('Số sao đánh giá phải từ 1 đến 5.', 400);
  }

  return await prisma.rating.upsert({
    where: {
      userId_postId: {
        userId: parseInt(userId),
        postId: parseInt(postId)
      }
    },
    update: {
      score: valScore
    },
    create: {
      userId: parseInt(userId),
      postId: parseInt(postId),
      score: valScore
    }
  });
};
