import prisma from '../config/db.js';
import AppError from '../utils/AppError.js';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;
const isCloudinaryConfigured = cloudName && apiKey && apiSecret;

export const uploadFile = async (file) => {
  if (isCloudinaryConfigured) {
    try {
      const timestamp = Math.round(new Date().getTime() / 1000);
      const folder = 'chandivanem';

      // Sinh Signature xác thực dạng SHA-1
      const params = { folder, timestamp };
      const signatureString = Object.keys(params)
        .sort()
        .map(key => `${key}=${params[key]}`)
        .join('&') + apiSecret;
      const signature = crypto.createHash('sha1').update(signatureString).digest('hex');

      // Tạo FormData tải lên
      const formData = new FormData();
      const fileBuffer = fs.readFileSync(file.path);
      const blob = new Blob([fileBuffer], { type: file.mimetype });

      formData.append('file', blob, file.originalname);
      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp.toString());
      formData.append('signature', signature);
      formData.append('folder', folder);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Cloudinary API Error: ${errText}`);
      }

      const data = await res.json();

      // Xóa file ảnh tạm thời trên server sau khi up thành công
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }

      // Lưu trữ thông tin ảnh vào bảng Media
      return await prisma.media.create({
        data: {
          filename: file.originalname,
          url: data.secure_url,
          publicId: data.public_id,
          mimeType: file.mimetype,
          size: file.size
        }
      });
    } catch (error) {
      console.error('Lỗi khi upload lên Cloudinary:', error.message);
      // Fallback về lưu cục bộ (Local Storage) nếu kết nối lỗi
      return await saveLocalMedia(file);
    }
  } else {
    // Cloudinary chưa cấu hình, lưu trực tiếp local
    return await saveLocalMedia(file);
  }
};

const saveLocalMedia = async (file) => {
  const publicUrl = `/uploads/${file.filename}`;
  return await prisma.media.create({
    data: {
      filename: file.originalname,
      url: publicUrl,
      mimeType: file.mimetype,
      size: file.size
    }
  });
};

export const getMediaList = async ({ page = 1, limit = 12 } = {}) => {
  const skip = (Number(page) - 1) * Number(limit);
  const [mediaList, total] = await Promise.all([
    prisma.media.findMany({
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' }
    }),
    prisma.media.count()
  ]);

  return {
    mediaList,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit)
    }
  };
};

export const deleteMedia = async (id) => {
  const media = await prisma.media.findUnique({ where: { id: parseInt(id) } });
  if (!media) throw new AppError('Không tìm thấy tệp tin hình ảnh', 404);

  // 1. Xóa khỏi Cloudinary nếu có publicId
  if (media.publicId && isCloudinaryConfigured) {
    try {
      const timestamp = Math.round(new Date().getTime() / 1000);
      const params = { public_id: media.publicId, timestamp };
      const signatureString = Object.keys(params)
        .sort()
        .map(key => `${key}=${params[key]}`)
        .join('&') + apiSecret;
      const signature = crypto.createHash('sha1').update(signatureString).digest('hex');

      const formData = new FormData();
      formData.append('public_id', media.publicId);
      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp.toString());
      formData.append('signature', signature);

      await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
        method: 'POST',
        body: formData
      });
    } catch (err) {
      console.warn('Lỗi khi xóa ảnh trên Cloudinary:', err.message);
    }
  } else {
    // 2. Xóa khỏi thư mục cục bộ nếu là file local
    if (media.url.includes('/uploads/')) {
      const filename = path.basename(media.url);
      const filePath = path.join(process.cwd(), 'server', 'uploads', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  }

  // 3. Xóa khỏi database
  await prisma.media.delete({ where: { id: parseInt(id) } });
};
