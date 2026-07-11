# GIAI ĐOẠN 4 — SẴN SÀNG TRIỂN KHAI PRODUCTION
**Thời gian ước tính:** 1–2 tuần
**Điều kiện tiên quyết:** Hoàn thành Giai đoạn 1, 2, 3.

---

## Task 4.1 — Chuyển lưu trữ ảnh sang Cloudinary

**Lý do bắt buộc:** Nếu deploy backend lên các nền tảng có ephemeral storage (Render free tier, Railway, Fly.io khi không gắn volume...), thư mục `server/uploads` sẽ **mất trắng** mỗi lần container restart/redeploy.

**Cài đặt:**
```bash
npm install cloudinary multer-storage-cloudinary
```

**Cấu hình `.env`:**
```env
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

**Sửa file cấu hình Multer** (đã tạo ở Task 1.8):
```js
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'chandivanem',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    transformation: [{ width: 1600, crop: 'limit' }], // giới hạn kích thước tối đa
  },
});

export const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });
```

**Cập nhật:**
- `req.file.path` giờ sẽ là URL Cloudinary đầy đủ thay vì đường dẫn local — cập nhật `uploadController.js` để trả đúng field này.
- Sửa `deleteUploadedFile` (Task 3.2) để dùng `cloudinary.uploader.destroy(publicId)` thay vì `fs.unlink` — cần lưu thêm `publicId` khi upload (Cloudinary trả về `req.file.filename` là public_id).
- **Migration dữ liệu cũ:** viết script một lần `server/scripts/migrateImagesToCloudinary.js` để upload các ảnh hiện có trong `server/uploads` lên Cloudinary và cập nhật lại `imageUrl` trong DB (Post, User.avatarUrl, AdCampaign.imageUrl, SiteContent liên quan tới ảnh).

---

## Task 4.2 — Viết Test cho service nghiệp vụ phức tạp

**Cài đặt:**
```bash
npm install -D vitest supertest
```

**Ưu tiên viết test cho (theo mức độ phức tạp/rủi ro):**
1. `commentService.js` — test xóa comment cha phải xóa cascade các reply con, test không cho user khác xóa comment không phải của mình (trừ Admin)
2. `ratingService.js` — test upsert: user rate lần 1 tạo mới, rate lần 2 cùng post phải update chứ không tạo bản ghi mới, test điểm trung bình tính đúng
3. `postService.js` — test ownership check (CTV không sửa được bài người khác), test pagination trả đúng `totalPages`
4. `authService.js` — test đăng ký email trùng báo lỗi rõ ràng, test login sai password không lộ thông tin email có tồn tại hay không

**Cấu trúc thư mục test:**
```
server/
  tests/
    unit/
      ratingService.test.js
      commentService.test.js
      postService.test.js
      authService.test.js
    integration/
      auth.test.js       (dùng supertest gọi thẳng qua Express app)
      posts.test.js
```

**Dùng database test riêng** (không test trên DB thật): tạo `.env.test` với `DATABASE_URL` trỏ đến database MySQL riêng cho test, script `npm run test` phải chạy `prisma migrate deploy` lên DB test trước khi test.

**Thêm script vào `package.json`:**
```json
"scripts": {
  "test": "vitest run",
  "test:watch": "vitest"
}
```

---

## Task 4.3 — Sitemap.xml & robots.txt tự động

**Backend — endpoint mới `GET /sitemap.xml`** (đặt ở `app.js` hoặc route riêng, KHÔNG dưới `/api`):
```js
app.get('/sitemap.xml', async (req, res) => {
  const posts = await prisma.post.findMany({
    where: { isPublished: true, deletedAt: null },
    select: { slug: true, updatedAt: true },
  });
  const categories = await prisma.category.findMany({ select: { slug: true } });

  const urls = [
    `<url><loc>${process.env.CLIENT_URL}/</loc></url>`,
    ...categories.map(c => `<url><loc>${process.env.CLIENT_URL}/category/${c.slug}</loc></url>`),
    ...posts.map(p => `<url><loc>${process.env.CLIENT_URL}/post/${p.slug}</loc><lastmod>${p.updatedAt.toISOString()}</lastmod></url>`),
  ].join('');

  res.header('Content-Type', 'application/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`);
});
```

**`robots.txt`** — file tĩnh trong `public/robots.txt` (Frontend):
```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /ctv
Sitemap: https://<domain-that-le>/sitemap.xml
```

---

## Task 4.4 — Redis Cache (trang chủ, bài viết nổi bật, menu động)

**Cài đặt:**
```bash
npm install redis
```
(cần chạy Redis server — local dev dùng Docker: `docker run -d -p 6379:6379 redis`)

**File mới `server/config/redisClient.js`:**
```js
import { createClient } from 'redis';

const redisClient = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
redisClient.on('error', (err) => console.error('Redis Client Error', err));
await redisClient.connect();

export default redisClient;
```

**Áp dụng cache-aside pattern cho các endpoint đọc nhiều, ghi ít:**
```js
// GET /api/navigation
export const getNavigation = async () => {
  const cached = await redisClient.get('navigation:active');
  if (cached) return JSON.parse(cached);

  const nav = await prisma.navigationItem.findMany({ where: { isActive: true, parentId: null }, include: { children: true }, orderBy: { order: 'asc' } });
  await redisClient.setEx('navigation:active', 3600, JSON.stringify(nav)); // cache 1 giờ
  return nav;
};
```
**QUAN TRỌNG:** phải **xóa cache (invalidate)** ngay khi Admin sửa menu/bài nổi bật, nếu không dữ liệu sẽ cũ:
```js
// trong navigationService.updateNavigation, sau khi update DB:
await redisClient.del('navigation:active');
```
Áp dụng tương tự cho: danh sách bài viết nổi bật trang chủ (key `homepage:featured-posts`, invalidate khi `isFeatured` thay đổi), site content trang About (key `sitecontent:about`, invalidate khi Admin sửa CMS).

**Lưu ý cho Agent:** Không cache dữ liệu thay đổi thường xuyên (viewCount, comment mới) — chỉ cache dữ liệu đọc nhiều/ghi hiếm như trên.

---

## Task 4.5 — Swagger / Postman Collection

**Chọn 1 trong 2 cách (đơn giản hơn: Postman Collection xuất tay hoặc tự động sinh cơ bản):**

**Cách A — Swagger (khuyến nghị nếu dự án còn phát triển tiếp lâu dài):**
```bash
npm install swagger-jsdoc swagger-ui-express
```
Thêm JSDoc comment chuẩn OpenAPI phía trên mỗi route, ví dụ:
```js
/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Lấy danh sách bài viết (có phân trang, filter)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Thành công }
 */
router.get('/', getPosts);
```
Cấu hình `server/config/swagger.js` và mount tại `app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))`.

**Cách B — Postman Collection (nhanh hơn, đủ dùng cho team nhỏ):**
Xuất file `postman_collection.json` liệt kê đầy đủ mọi endpoint đã liệt kê trong tài liệu dự án (mục 5.1 → 5.9), kèm ví dụ body request, header `Authorization: Bearer <token>` cho route cần đăng nhập. Lưu tại thư mục gốc dự án `docs/postman_collection.json`.

---

## Checklist hoàn thành Giai đoạn 4
- [ ] 4.1 Ảnh mới upload lưu trên Cloudinary, ảnh cũ đã migrate xong, xóa bài/đổi ảnh xóa đúng file trên Cloudinary
- [ ] 4.2 Test cho commentService, ratingService, postService, authService chạy pass, có script `npm test`
- [ ] 4.3 `/sitemap.xml` trả về đúng danh sách URL công khai, `robots.txt` chặn đúng các route admin/ctv
- [ ] 4.4 Redis cache hoạt động cho navigation/featured posts/site content, có invalidate đúng khi Admin sửa dữ liệu
- [ ] 4.5 Tài liệu API (Swagger hoặc Postman) đầy đủ, dễ dùng cho người mới tham gia dự án
- [ ] Review lại toàn bộ `.env.example` để đảm bảo liệt kê đủ biến môi trường cần thiết cho production (DATABASE_URL, JWT_SECRET, CLIENT_URL, CLOUDINARY_*, SMTP_*, REDIS_URL)
- [ ] Test toàn bộ hệ thống end-to-end một lần cuối trước khi công bố sẵn sàng deploy
