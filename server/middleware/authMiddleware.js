import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError.js';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Không tìm thấy xác thực (Token bị thiếu)', 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    if (!process.env.JWT_SECRET) {
      return next(new AppError('Cấu hình khóa bí mật JWT_SECRET trên server bị thiếu.', 500));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return next(new AppError('Token không hợp lệ hoặc đã hết hạn', 403));
  }
};

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, (err) => {
    if (err) return next(err);
    if (req.user && req.user.role === 'ADMIN') {
      next();
    } else {
      next(new AppError('Chỉ Quản trị viên mới có quyền thực hiện chức năng này.', 403));
    }
  });
};

export const verifyCTV = (req, res, next) => {
  verifyToken(req, res, (err) => {
    if (err) return next(err);
    if (req.user && (req.user.role === 'CTV' || req.user.role === 'ADMIN')) {
      next();
    } else {
      next(new AppError('Chỉ Cộng tác viên hoặc Quản trị viên mới có quyền thực hiện chức năng này.', 403));
    }
  });
};
