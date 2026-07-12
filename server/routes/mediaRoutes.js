import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { verifyToken, verifyAdmin } from '../middleware/authMiddleware.js';
import { uploadMedia, getMedia, deleteMedia } from '../controllers/mediaController.js';

const router = express.Router();

// Tạo thư mục tạm uploads nếu chưa có
const uploadDir = path.join(process.cwd(), 'server', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const randomName = crypto.randomBytes(16).toString('hex');
    cb(null, randomName + path.extname(file.originalname).toLowerCase());
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  const extname = /jpeg|jpg|png|webp|gif/.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedMimeTypes.includes(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file hình ảnh (JPEG, JPG, PNG, WEBP, GIF)!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

// Tải lên ảnh (Mọi người dùng có quyền đăng nhập như CTV/Admin đều làm được)
router.post('/upload', verifyToken, upload.single('image'), uploadMedia);

// Quản trị Thư viện Ảnh (Admin Only)
router.get('/', verifyToken, verifyAdmin, getMedia);
router.delete('/:id', verifyToken, verifyAdmin, deleteMedia);

export default router;
