# GIAI ĐOẠN 1 — VÁ BẢO MẬT & LỖI CHẶN NGHIỆP VỤ
**Ưu tiên:** CAO NHẤT — thực hiện trước mọi tính năng mới
**Thời gian ước tính:** 3–5 ngày
**Điều kiện tiên quyết:** Đã hoàn thành `AUDIT-REPORT.md` ở Giai đoạn 0. Đọc file đó trước khi bắt đầu để biết chính xác vấn đề nào thực sự tồn tại trong code (không sửa những gì đã xác nhận là "KHÔNG" tồn tại).

**Nguyên tắc chung cho Agent:**
- Mỗi task dưới đây là độc lập, làm xong 1 task thì chạy lại server + test thủ công trước khi sang task tiếp theo.
- Không xóa/đổi tên biến, hàm đang được dùng ở nơi khác mà không kiểm tra tất cả nơi gọi (`grep -rn "tenHam" server/`).
- Sau khi sửa `schema.prisma`, LUÔN chạy `npx prisma generate` rồi `npx prisma migrate dev --name <ten_migration>` (không dùng `db push` cho thay đổi có ảnh hưởng dữ liệu).
- Viết log thay đổi vào `CHANGELOG-PHASE1.md`.

---

## Task 1.1 — Sửa quan hệ xóa (onDelete) trong schema.prisma

**File:** `prisma/schema.prisma`

Sửa như sau:

```prisma
model Comment {
  ...
  postId      Int
  post        Post      @relation(fields: [postId], references: [id], onDelete: Cascade)
  authorId    Int
  author      User      @relation(fields: [authorId], references: [id], onDelete: Cascade)
  ...
}

model Rating {
  ...
  postId      Int
  post        Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  userId      Int
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Post {
  ...
  categoryId  Int
  category    Category @relation(fields: [categoryId], references: [id], onDelete: Restrict)
  authorId    Int
  author      User     @relation(fields: [authorId], references: [id], onDelete: Restrict)
}
```

**Giải thích quyết định:**
- `Comment`, `Rating` → `Cascade` khi Post/User bị xóa (xóa bài viết thì xóa luôn bình luận/đánh giá liên quan; xóa user thì xóa comment/rating của họ).
- `Post.category` → giữ `Restrict` (KHÔNG cascade) vì không muốn xóa nhầm category làm mất luôn bài viết. Thay vào đó xử lý ở tầng service (xem Task 1.2).
- `Post.author` → giữ `Restrict` tương tự, xử lý ở service.

**Chạy lệnh:**
```bash
npx prisma generate
npx prisma migrate dev --name fix_ondelete_relations
```

**Kiểm tra:** Lặp lại đúng kịch bản test ở Giai đoạn 0 (xóa post có comment/rating) → phải thành công không lỗi FK.

---

## Task 1.2 — Chặn xóa Category/User còn dữ liệu liên quan (thông báo rõ ràng)

**File:** `server/services/categoryController.js` hoặc `categoryService.js` (nếu có), `server/services/userService.js` hoặc tương đương

Trước khi gọi `prisma.category.delete()`, kiểm tra:
```js
const postCount = await prisma.post.count({ where: { categoryId: id } });
if (postCount > 0) {
  throw new AppError(`Không thể xóa danh mục vì còn ${postCount} bài viết thuộc danh mục này. Vui lòng chuyển bài viết sang danh mục khác trước.`, 400);
}
```
Áp dụng tương tự cho xóa User có `posts.length > 0` (chặn xóa Admin/CTV còn bài viết, gợi ý chuyển quyền hoặc archive thay vì xóa).

---

## Task 1.3 — Không lộ passwordHash trong response

**File:** `server/services/authService.js`

Tìm mọi chỗ trả về đối tượng `user` (trong `registerUser`, `loginUser`, và bất kỳ hàm nào dùng `prisma.user.findUnique`/`findMany` trả cho client). Áp dụng 1 trong 2 cách:

**Cách A (khuyến nghị) — dùng `select` khi query:**
```js
const user = await prisma.user.create({
  data: { fullName, email, passwordHash },
  select: { id: true, fullName: true, email: true, role: true, avatarUrl: true, bio: true, createdAt: true }
});
```

**Cách B — destructure loại bỏ trước khi trả:**
```js
const { passwordHash: _, ...safeUser } = user;
return safeUser;
```

Áp dụng cho TẤT CẢ endpoint trả thông tin user: `register`, `login`, `GET /api/users` (admin), `GET /author/:id` (nếu có trang profile công khai).

**Kiểm tra:** Lặp lại curl test ở Giai đoạn 0, xác nhận JSON response không còn `passwordHash`.

---

## Task 1.4 — Ownership check cho CTV (updatePost/deletePost)

**File:** `server/services/postService.js`, `server/controllers/postController.js`, hoặc middleware riêng

Thêm logic (ưu tiên đặt trong service để tái sử dụng):
```js
export const updatePost = async (id, data, currentUser) => {
  const post = await prisma.post.findUnique({ where: { id: Number(id) } });
  if (!post) throw new AppError('Không tìm thấy bài viết', 404);

  if (currentUser.role === 'CTV' && post.authorId !== currentUser.id) {
    throw new AppError('Bạn không có quyền chỉnh sửa bài viết này', 403);
  }
  // ... phần update như cũ
};
```
Cập nhật `postController.js` để truyền `req.user` vào service:
```js
export const updatePost = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updatedPost = await postService.updatePost(id, req.body, req.user);
  res.json({ message: 'Cập nhật bài viết thành công', post: updatedPost });
});
```
Áp dụng tương tự cho `deletePost` — LƯU Ý: Admin luôn được xóa bất kỳ bài viết nào (theo đúng nghiệp vụ mô tả), chỉ CTV mới bị giới hạn theo `authorId`.

**Kiểm tra:** Lặp lại kịch bản test 2 tài khoản CTV ở Giai đoạn 0 → phải trả về 403 khi B sửa bài của A.

---

## Task 1.5 — Validate input bằng Zod

**Cài đặt:**
```bash
npm install zod
```

**Tạo file mới:** `server/validators/authValidator.js`
```js
import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự').max(100),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự').max(100),
});

export const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});
```

**Tạo middleware chung:** `server/middleware/validate.js`
```js
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: 'Dữ liệu không hợp lệ',
      errors: result.error.flatten().fieldErrors,
    });
  }
  req.body = result.data;
  next();
};
```

**Áp dụng trong route:** `server/routes/authRoutes.js`
```js
import { validate } from '../middleware/validate.js';
import { registerSchema, loginSchema } from '../validators/authValidator.js';

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
```

**Lặp lại pattern này cho:**
- `postValidator.js` → `createPost` (title, content, categoryId bắt buộc), `updatePost`
- `commentValidator.js` → content bắt buộc, không rỗng
- `ratingValidator.js` → score phải là số nguyên 1-5
- `categoryValidator.js` → name, slug bắt buộc

---

## Task 1.6 — Rate limiting cho login

**Cài đặt:**
```bash
npm install express-rate-limit
```

**File:** `server/middleware/rateLimiter.js`
```js
import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 10, // tối đa 10 lần thử
  message: { message: 'Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau 15 phút.' },
  standardHeaders: true,
  legacyHeaders: false,
});
```

**Áp dụng:** `server/routes/authRoutes.js`
```js
router.post('/login', loginLimiter, validate(loginSchema), login);
```

---

## Task 1.7 — Helmet + CORS whitelist

**Cài đặt:**
```bash
npm install helmet
```

**File:** `server/app.js`
```js
import helmet from 'helmet';
import cors from 'cors';

app.use(helmet());

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',')
  : ['http://localhost:5173'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
```
Thêm vào `.env`: `CLIENT_URL="http://localhost:5173"`

---

## Task 1.8 — Giới hạn Multer (file upload)

**File:** cấu hình Multer hiện tại (tìm bằng `grep -rn "multer" server/`)

```js
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'server/uploads'),
  filename: (req, file, cb) => {
    const randomName = crypto.randomBytes(16).toString('hex');
    cb(null, `${randomName}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error('Chỉ chấp nhận file ảnh (JPEG, PNG, WEBP, GIF)'), false);
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
```

**Kiểm tra:** thử upload file `.php` đổi đuôi thành `.jpg` (kiểm tra mimetype thật, không chỉ đuôi file) — nếu cần kiểm tra sâu hơn (magic bytes), cân nhắc thêm thư viện `file-type` ở giai đoạn sau, ghi chú vào `CHANGELOG-PHASE1.md` như "known limitation".

---

## Task 1.9 — Sanitize HTML content bài viết/bình luận

**Cài đặt:**
```bash
npm install isomorphic-dompurify
```

**File:** `server/services/postService.js` (và `commentService.js` nếu bình luận cũng cho phép HTML — thường thì comment nên là plain text, kiểm tra và xử lý riêng)

```js
import DOMPurify from 'isomorphic-dompurify';

// Trước khi lưu vào DB trong createPost/updatePost:
const cleanContent = DOMPurify.sanitize(content, {
  ALLOWED_TAGS: ['p','br','strong','em','u','h1','h2','h3','h4','ul','ol','li','a','img','blockquote','code','pre','span'],
  ALLOWED_ATTR: ['href','src','alt','class','target'],
});
```
Với `comment.content`, nếu Frontend chỉ dùng textarea thường (không phải rich editor), áp dụng sanitize nghiêm ngặt hơn — loại bỏ toàn bộ tag HTML:
```js
const cleanComment = DOMPurify.sanitize(content, { ALLOWED_TAGS: [] });
```

---

## Task 1.10 — Chuẩn hóa xử lý lỗi Prisma

**File:** middleware xử lý lỗi toàn cục trong `app.js` hoặc file riêng `server/middleware/errorHandler.js`

```js
export const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.code === 'P2002') {
    return res.status(409).json({ message: `Dữ liệu bị trùng lặp: ${err.meta?.target?.join(', ')}` });
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ message: 'Không tìm thấy dữ liệu yêu cầu' });
  }
  if (err.code === 'P2003') {
    return res.status(400).json({ message: 'Thao tác vi phạm ràng buộc dữ liệu liên quan' });
  }

  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Đã có lỗi xảy ra ở máy chủ';
  res.status(statusCode).json({ message });
};
```
Đảm bảo middleware này được đăng ký SAU CÙNG trong `app.js` (`app.use(errorHandler)`).

---

## Checklist hoàn thành Giai đoạn 1
- [ ] 1.1 Schema onDelete đã sửa, migrate thành công
- [ ] 1.2 Chặn xóa Category/User còn dữ liệu, thông báo rõ ràng
- [ ] 1.3 passwordHash không còn xuất hiện trong bất kỳ response nào
- [ ] 1.4 CTV không thể sửa/xóa bài viết người khác (test 2 tài khoản xác nhận 403)
- [ ] 1.5 Zod validate áp dụng cho auth, post, comment, rating, category
- [ ] 1.6 Rate limit hoạt động (test bằng cách gọi login sai 11 lần liên tiếp)
- [ ] 1.7 Helmet + CORS whitelist hoạt động, Frontend vẫn gọi API bình thường
- [ ] 1.8 Multer chặn file sai định dạng/quá dung lượng
- [ ] 1.9 Content lưu DB đã qua sanitize (test chèn `<script>alert(1)</script>` vào bài viết)
- [ ] 1.10 Lỗi Prisma trả về message tiếng Việt thân thiện, không lộ stack trace
- [ ] Đã viết `CHANGELOG-PHASE1.md` liệt kê toàn bộ thay đổi
- [ ] Toàn bộ tính năng cũ (login, tạo bài, comment, rating, upload ảnh) vẫn hoạt động bình thường sau khi sửa
