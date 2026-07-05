import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import userRoutes from './routes/userRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import navigationRoutes from './routes/navigationRoutes.js';
import siteContentRoutes from './routes/siteContentRoutes.js';
import adRoutes from './routes/adRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import ratingRoutes from './routes/ratingRoutes.js';
import { globalErrorHandler } from './middleware/errorMiddleware.js';
import AppError from './utils/AppError.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Phục vụ thư mục ảnh tĩnh
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/navigation', navigationRoutes);
app.use('/api/site-content', siteContentRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/ratings', ratingRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running smoothly' });
});

// Xử lý các routes không tồn tại (404)
app.use((req, res, next) => {
  next(new AppError(`Không tìm thấy route ${req.originalUrl} trên máy chủ`, 404));
});

// Bắt toàn bộ lỗi chảy về đây
app.use(globalErrorHandler);

export default app;
