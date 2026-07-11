# GIAI ĐOẠN 2 — HOÀN THIỆN TÍNH NĂNG CÒN THIẾU
**Thời gian ước tính:** 1–2 tuần
**Điều kiện tiên quyết:** Đã hoàn thành và test kỹ Giai đoạn 1 (bảo mật). KHÔNG bắt đầu giai đoạn này nếu checklist Giai đoạn 1 chưa xong.

**Nguyên tắc chung:** Mỗi task có Backend (API) + Frontend (UI) tương ứng. Làm xong Backend, test bằng Postman/curl trước khi động vào Frontend.

---

## Task 2.1 — Pagination

**Backend — `server/services/postService.js`:**
```js
export const getAllPosts = async ({ page = 1, limit = 10, status, categoryId, authorId } = {}) => {
  const skip = (Number(page) - 1) * Number(limit);
  const where = {};
  if (status === 'published') where.isPublished = true;
  if (status === 'unpublished') where.isPublished = false;
  if (categoryId) where.categoryId = Number(categoryId);
  if (authorId) where.authorId = Number(authorId);

  const [posts, total] = await Promise.all([
    prisma.post.findMany({ where, skip, take: Number(limit), orderBy: { createdAt: 'desc' }, include: { author: { select: { id: true, fullName: true } }, category: true } }),
    prisma.post.count({ where }),
  ]);

  return { posts, pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / limit) } };
};
```

**Controller — `server/controllers/postController.js`:**
```js
export const getPosts = catchAsync(async (req, res) => {
  const { page, limit, status, categoryId, authorId } = req.query;
  const result = await postService.getAllPosts({ page, limit, status, categoryId, authorId });
  res.json(result);
});
```

Áp dụng pattern tương tự (skip/take + count) cho:
- `GET /api/comments/post/:postId` (phân trang bình luận gốc, replies vẫn load kèm theo comment cha)
- `GET /api/users` (admin — danh sách user)
- `GET /api/applications` (admin — danh sách đơn ứng tuyển)

**Frontend:** cập nhật các trang danh sách (`AdminPosts.jsx`, `AdminUsers.jsx`, `AdminApplications.jsx`, phần bình luận trong `PostDetail.jsx`) để:
- Đọc `pagination` từ response
- Thêm component phân trang (nút Previous/Next hoặc số trang) — nếu chưa có, tạo component `Pagination.jsx` tái sử dụng được, nhận props `currentPage`, `totalPages`, `onPageChange`.

---

## Task 2.2 — Filter cho danh sách bài viết (Admin)

Đã bao gồm 1 phần trong Task 2.1 (`status`, `categoryId`, `authorId`). Bổ sung:
- Frontend `AdminPosts.jsx`: thêm dropdown filter theo Category, theo trạng thái (Đã xuất bản / Chưa xuất bản / Tất cả), theo tác giả (nếu Admin).
- Đảm bảo các filter kết hợp được với nhau và với pagination (giữ query params trên URL để có thể back/forward, dùng `useSearchParams` từ React Router).

---

## Task 2.3 — API CRUD cho Tag

**Kiểm tra trước:** chạy `grep -rn "Tag" server/` để xác nhận có tồn tại `tagController.js`/`tagRoutes.js` chưa (theo tài liệu là chưa có).

**Tạo mới:**
- `server/controllers/tagController.js` — copy pattern từ `categoryController.js` (get all, create, update, delete — Admin only cho create/update/delete)
- `server/services/tagService.js` — logic CRUD + tự sinh `slug` từ `name` (dùng slugify, xử lý tiếng Việt có dấu → không dấu)
- `server/routes/tagRoutes.js`:
```js
router.get('/', getTags);
router.post('/', protect, restrictTo('ADMIN'), createTag);
router.put('/:id', protect, restrictTo('ADMIN'), updateTag);
router.delete('/:id', protect, restrictTo('ADMIN'), deleteTag);
```
- Đăng ký route trong `app.js`: `app.use('/api/tags', tagRoutes)`
- Cập nhật `createPost`/`updatePost` trong `postService.js` để nhận `tagIds: number[]` và connect quan hệ nhiều-nhiều:
```js
tags: { connect: tagIds?.map(id => ({ id })) || [] }
```

**Frontend:**
- Trang Admin mới `AdminTags.jsx` (CRUD đơn giản, danh sách + form thêm/sửa/xóa)
- Trong form tạo/sửa bài viết (`CreatePost.jsx` hoặc tương đương), thêm ô chọn nhiều Tag (multi-select) cho bài viết.

---

## Task 2.4 — Newsletter Subscribe API

**Backend:**
- `server/controllers/newsletterController.js`:
```js
export const subscribe = catchAsync(async (req, res) => {
  const { email } = req.body;
  await newsletterService.subscribe(email);
  res.status(201).json({ message: 'Đăng ký nhận bản tin thành công!' });
});

export const getSubscribers = catchAsync(async (req, res) => {
  const subscribers = await newsletterService.getAll();
  res.json(subscribers);
});
```
- `server/services/newsletterService.js` — dùng `upsert` hoặc bắt lỗi `P2002` (email trùng) để trả message thân thiện "Email này đã đăng ký trước đó".
- `server/routes/newsletterRoutes.js`:
```js
router.post('/subscribe', validate(newsletterSchema), subscribe);
router.get('/', protect, restrictTo('ADMIN'), getSubscribers);
```
- Validator: kiểm tra email hợp lệ bằng Zod.

**Frontend:**
- Kết nối Form đăng ký ở Footer (hiện có UI nhưng theo tài liệu chưa rõ có gọi API chưa — kiểm tra `Footer.jsx`) với endpoint `POST /api/newsletter/subscribe`.
- Trang Admin mới hoặc thêm tab `AdminNewsletter.jsx` — hiển thị danh sách subscriber, có nút export CSV (dùng thư viện nhỏ hoặc tự build CSV string).

---

## Task 2.5 — Quy trình duyệt bài (Draft/Pending/Published)

**Quyết định nghiệp vụ (Agent cần hỏi người dùng xác nhận trước khi code nếu chưa rõ):**
- Đề xuất mặc định: CTV tạo bài → trạng thái `PENDING` (không hiển thị công khai) → Admin duyệt → chuyển `isPublished = true`. CTV KHÔNG được tự set `isPublished = true` khi tạo/sửa bài.

**Backend — `server/services/postService.js`:**
```js
export const createPost = async (data, currentUser) => {
  const isPublished = currentUser.role === 'ADMIN' ? (data.isPublished ?? false) : false; // CTV luôn tạo ở trạng thái chưa publish
  // ... tạo post với isPublished này
};
```
Thêm endpoint riêng cho Admin duyệt bài (có thể tái dùng `togglePostLock` đã có, hoặc tạo route mới `PATCH /api/posts/:id/approve` rõ nghĩa hơn).

**Frontend:**
- `AdminPosts.jsx`: thêm badge trạng thái "Chờ duyệt" / "Đã xuất bản" / "Đã khóa", nút "Duyệt bài" riêng cho bài `PENDING`.
- Dashboard CTV: hiển thị rõ trạng thái từng bài (đặc biệt là "Đang chờ Admin duyệt").
- Cân nhắc thêm thông báo (email hoặc in-app) cho CTV khi bài được duyệt/từ chối — có thể để việc này sang Giai đoạn 3 nếu phức tạp, ghi chú lại.

---

## Task 2.6 — Quên mật khẩu / Đặt lại mật khẩu

**Cài đặt:**
```bash
npm install nodemailer
```

**Schema — thêm vào `User` trong `schema.prisma`:**
```prisma
model User {
  ...
  resetPasswordToken   String?
  resetPasswordExpires DateTime?
}
```
Chạy `npx prisma migrate dev --name add_password_reset`

**Backend:**
- `POST /api/auth/forgot-password` — nhận email, tạo token ngẫu nhiên (`crypto.randomBytes(32).toString('hex')`), hash token trước khi lưu DB, set hạn dùng 15-30 phút, gửi email chứa link `https://<frontend>/reset-password?token=...`
- `POST /api/auth/reset-password` — nhận token + mật khẩu mới, tìm user theo token đã hash + chưa hết hạn, cập nhật `passwordHash`, xóa `resetPasswordToken`/`resetPasswordExpires`.
- Cấu hình Nodemailer trong `.env`: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` (dùng Gmail App Password hoặc dịch vụ như Mailtrap để test).
- **Bảo mật:** luôn trả về message giống nhau dù email tồn tại hay không (tránh lộ thông tin email nào đã đăng ký): "Nếu email tồn tại, chúng tôi đã gửi hướng dẫn đặt lại mật khẩu."

**Frontend:**
- Trang `ForgotPassword.jsx` — form nhập email
- Trang `ResetPassword.jsx` — đọc `token` từ URL query, form nhập mật khẩu mới + xác nhận

---

## Task 2.7 — Xác thực email khi đăng ký (tùy chọn, làm nếu còn thời gian)

Tương tự pattern Task 2.6 nhưng dùng field `isEmailVerified Boolean @default(false)` và `emailVerifyToken`. Có thể gộp chung logic gửi mail với Task 2.6 (dùng chung service Nodemailer).

---

## Task 2.8 — Trang cá nhân công khai của CTV (Author Profile)

**Backend:**
- `GET /api/users/author/:id` — trả về thông tin công khai của tác giả (fullName, avatarUrl, bio — KHÔNG bao gồm email/passwordHash) kèm danh sách bài viết đã publish của họ (có phân trang, tái dùng Task 2.1).

**Frontend:**
- Trang mới `AuthorProfile.jsx`, route `/author/:id`
- Link đến trang này từ tên tác giả hiển thị trong `PostDetail.jsx` và danh sách bài viết.

---

## Checklist hoàn thành Giai đoạn 2
- [ ] 2.1 Pagination hoạt động cho posts, comments, users, applications
- [ ] 2.2 Filter kết hợp pagination trên Admin Posts
- [ ] 2.3 CRUD Tag đầy đủ + gắn tag được vào bài viết
- [ ] 2.4 Newsletter subscribe hoạt động, Admin xem được danh sách
- [ ] 2.5 CTV không thể tự publish bài, Admin có luồng duyệt rõ ràng
- [ ] 2.6 Quên/đặt lại mật khẩu hoạt động end-to-end (test gửi mail thật hoặc qua Mailtrap)
- [ ] 2.7 (tùy chọn) Xác thực email khi đăng ký
- [ ] 2.8 Trang profile công khai CTV hiển thị đúng, không lộ dữ liệu nhạy cảm
- [ ] Test toàn bộ luồng cũ (login, CRUD post, comment, rating) không bị ảnh hưởng
