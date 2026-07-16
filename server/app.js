import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
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
import tagRoutes from './routes/tagRoutes.js';
import newsletterRoutes from './routes/newsletterRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';
import { globalErrorHandler } from './middleware/errorMiddleware.js';
import AppError from './utils/AppError.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" } // Cho phép tải ảnh local uploads từ domain khác (Frontend)
}));

const clientUrlOrigins = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : [];
const allowedOrigins = [
  ...clientUrlOrigins,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5175'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());

// Phục vụ thư mục ảnh tĩnh
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/public', express.static(path.join(__dirname, '..', 'public')));
app.use('/brain', express.static('C:\\Users\\hoang\\.gemini\\antigravity-ide\\brain'));

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
app.use('/api/tags', tagRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/media', mediaRoutes);

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
