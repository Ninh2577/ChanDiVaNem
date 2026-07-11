import prisma from '../config/db.js';
import bcrypt from 'bcrypt';
import AppError from '../utils/AppError.js';

export const submitApplication = async (data) => {
  return await prisma.contributorApplication.create({
    data: {
      ...data,
      status: 'PENDING'
    }
  });
};

export const getApplications = async ({ page = 1, limit = 10, status } = {}) => {
  const skip = (Number(page) - 1) * Number(limit);
  const where = {};
  if (status && status !== 'all') {
    where.status = status;
  }

  const [applications, total] = await Promise.all([
    prisma.contributorApplication.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' }
    }),
    prisma.contributorApplication.count({ where })
  ]);

  return {
    applications,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit)
    }
  };
};

export const updateApplicationStatus = async (id, status) => {
  const application = await prisma.contributorApplication.findUnique({ 
    where: { id: parseInt(id) } 
  });
  
  if (!application) {
    throw new AppError('Không tìm thấy đơn', 404);
  }

  const updatedApp = await prisma.contributorApplication.update({
    where: { id: parseInt(id) },
    data: { status }
  });

  if (status === 'APPROVED' && application.status !== 'APPROVED') {
    const existingUser = await prisma.user.findUnique({ where: { email: application.email } });
    if (!existingUser) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('Ctv123456@', salt);
      
      await prisma.user.create({
        data: {
          email: application.email,
          fullName: application.fullName,
          passwordHash,
          role: 'CTV'
        }
      });
    }
  }

  return updatedApp;
};
