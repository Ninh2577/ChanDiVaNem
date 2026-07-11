import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import prisma from '../config/db.js';
import AppError from '../utils/AppError.js';

export const registerUser = async ({ fullName, email, password }) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError('Email này đã được sử dụng.', 400);
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const newUser = await prisma.user.create({
    data: {
      fullName,
      email,
      passwordHash,
      role: 'READER'
    },
  });

  return {
    id: newUser.id,
    fullName: newUser.fullName,
    email: newUser.email,
    role: newUser.role
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError('Email hoặc mật khẩu không đúng.', 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new AppError('Email hoặc mật khẩu không đúng.', 401);
  }

  if (!process.env.JWT_SECRET) {
    throw new AppError('Cấu hình khóa bí mật JWT_SECRET trên server bị thiếu.', 500);
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    token,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl
    }
  };
};

export const forgotPassword = async (email) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError('Không tìm thấy tài khoản với email này.', 404);
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  const resetExpires = new Date(Date.now() + 3600000); // 1 giờ

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetPasswordToken: hashedToken,
      resetPasswordExpires: resetExpires
    }
  });

  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
  const html = `
    <h3>Yêu cầu khôi phục mật khẩu</h3>
    <p>Bạn nhận được email này vì bạn (hoặc ai đó) đã yêu cầu khôi phục mật khẩu cho tài khoản Chân Đi Và Nếm.</p>
    <p>Vui lòng click vào đường dẫn bên dưới để đặt lại mật khẩu của bạn (đường dẫn có hiệu lực trong 1 giờ):</p>
    <p><a href="${resetUrl}" target="_blank" style="display:inline-block;padding:10px 20px;color:#fff;background:#3b82f6;text-decoration:none;border-radius:5px;">Đặt lại mật khẩu</a></p>
    <p>Hoặc copy link này dán vào trình duyệt: <br/> ${resetUrl}</p>
    <p>Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email này.</p>
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: '[Chân Đi Và Nếm] Khôi phục mật khẩu',
      html
    });
  } catch (error) {
    console.error('Lỗi gửi mail reset mật khẩu:', error);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: null,
        resetPasswordExpires: null
      }
    });
    throw new AppError('Có lỗi xảy ra khi gửi email khôi phục. Vui lòng thử lại sau.', 500);
  }
};

export const resetPassword = async (token, newPassword) => {
  if (!token) {
    throw new AppError('Token không hợp lệ.', 400);
  }

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { gt: new Date() }
    }
  });

  if (!user) {
    throw new AppError('Token khôi phục mật khẩu không hợp lệ hoặc đã hết hạn.', 400);
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(newPassword, salt);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      resetPasswordToken: null,
      resetPasswordExpires: null
    }
  });
};
