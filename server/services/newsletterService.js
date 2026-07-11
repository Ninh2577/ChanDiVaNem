import prisma from '../config/db.js';
import AppError from '../utils/AppError.js';

export const subscribe = async (email) => {
  if (!email || !email.trim()) {
    throw new AppError('Email không được bỏ trống.', 400);
  }

  try {
    return await prisma.newsletterSubscriber.create({
      data: { email: email.trim().toLowerCase() }
    });
  } catch (error) {
    if (error.code === 'P2002') {
      throw new AppError('Email này đã đăng ký nhận bản tin trước đó.', 400);
    }
    throw error;
  }
};

export const getAllSubscribers = async () => {
  return await prisma.newsletterSubscriber.findMany({
    orderBy: { subscribedAt: 'desc' }
  });
};
