# GIAI ĐOẠN 0 — AUDIT TOÀN DIỆN
**Dự án:** Chân Đi Và Nếm (CMS/Blog Du lịch - Ẩm thực - Di sản Việt Nam)
**Stack:** React 19 + Vite (Frontend) / Express.js + Prisma + MySQL (Backend)
**Thời gian ước tính:** 1–2 ngày
**Vai trò của Agent:** Bạn là một Security & Code Auditor. KHÔNG sửa code ở giai đoạn này trừ khi được yêu cầu rõ. Nhiệm vụ chính là ĐỌC, XÁC MINH, và BÁO CÁO bằng file markdown.

---

## 0. Bối cảnh đã biết trước (đã audit sơ bộ)
Đã xem qua `prisma/schema.prisma`, `authController.js`, `postController.js` và phát hiện các nghi vấn sau — nhiệm vụ của bạn là XÁC NHẬN từng nghi vấn này đúng/sai bằng cách đọc code thật:

| # | Nghi vấn | File cần đọc để xác nhận |
|---|----------|---------------------------|
| 1 | Response của `register`/`login` có trả `passwordHash` về client không (lộ hash mật khẩu) | `server/services/authService.js` |
| 2 | `updatePost`/`deletePost` có kiểm tra `post.authorId === req.user.id` khi role là CTV không (tránh CTV sửa/xóa bài người khác) | `server/services/postService.js`, `server/middleware/*` |
| 3 | Xóa Post/Category/User có bị lỗi Foreign Key Constraint không, do schema thiếu `onDelete` cho: `Comment.post`, `Rating.post`, `Post.category` | Test thủ công + đọc `server/services/postService.js`, `commentService.js`, `ratingService.js` |
| 4 | `getAllPosts()` có hỗ trợ filter/pagination theo query string không | `server/services/postService.js` |
| 5 | `searchPosts(q)` xử lý ra sao khi `q` rỗng/undefined | `server/services/postService.js` |
| 6 | Middleware xác thực JWT có kiểm tra hết hạn, có refresh token không, JWT secret có nằm trong `.env` hay hard-code | `server/middleware/authMiddleware.js` (hoặc tên tương đương) |
| 7 | Route nào đang thiếu middleware phân quyền (VD: route Admin-only nhưng không có check `role === 'ADMIN'`) | `server/routes/*.js` |
| 8 | Multer config: có giới hạn `fileSize`, `mimetype`, đổi tên file ngẫu nhiên không | `server/middleware/uploadMiddleware.js` hoặc file cấu hình Multer |
| 9 | Content bài viết (HTML từ Quill) có được sanitize trước khi lưu DB không | `server/services/postService.js`, `commentService.js` |
| 10 | CORS config đang mở cho origin nào (`*` hay whitelist cụ thể) | `server/app.js` |
| 11 | Error handling toàn cục: lỗi Prisma (P2002, P2003, P2025...) có được convert thành message thân thiện không, hay văng ra stack trace thô | `server/utils/*`, error middleware trong `app.js` |
| 12 | Có rate limiting cho `/api/auth/login` không | `server/app.js`, `server/routes/authRoutes.js` |

---

## 1. Nhiệm vụ cụ thể

### Bước 1: Liệt kê toàn bộ cấu trúc
Chạy lệnh và ghi lại kết quả:
```bash
find server -type f -name "*.js" | sort
```

### Bước 2: Đọc từng file theo bảng ở mục 0
Với mỗi nghi vấn, đọc file liên quan và trả lời **CÓ / KHÔNG / KHÔNG RÕ**, kèm trích dẫn đoạn code (số dòng) làm bằng chứng.

### Bước 3: Test thủ công các luồng xóa (tái hiện lỗi FK)
Sử dụng Postman/curl hoặc script test, thực hiện tuần tự:
1. Tạo 1 category, 1 post thuộc category đó
2. Tạo 1 comment và 1 rating cho post đó
3. Gọi `DELETE /api/posts/:id` → ghi lại kết quả (thành công/lỗi 500/lỗi gì)
4. Gọi `DELETE /api/categories/:id` (category đang có post) → ghi lại kết quả
5. Gọi xóa user đang có post/comment/rating (nếu có API) → ghi lại kết quả

### Bước 4: Kiểm tra response thực tế của login/register
```bash
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d '{"fullName":"Test","email":"test@test.com","password":"123456"}'
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"123456"}'
```
Kiểm tra JSON trả về có field `passwordHash` hay không.

### Bước 5: Kiểm tra ownership CTV
Tạo 2 tài khoản CTV (A và B). Dùng token của B để gọi `PUT /api/posts/:id` hoặc `DELETE /api/posts/:id` với `id` là bài viết của A. Ghi lại: có bị chặn (403) hay thực hiện thành công (lỗ hổng).

---

## 2. Yêu cầu đầu ra
Tạo file báo cáo `AUDIT-REPORT.md` tại thư mục gốc dự án, cấu trúc:

```markdown
# BÁO CÁO AUDIT - GIAI ĐOẠN 0

## Tóm tắt mức độ rủi ro
| Mức độ | Số lượng vấn đề |
|--------|------------------|
| Nghiêm trọng (Critical) | ... |
| Cao (High) | ... |
| Trung bình (Medium) | ... |
| Thấp (Low) | ... |

## Chi tiết từng vấn đề
### [CRITICAL] Tên vấn đề
- **File/dòng:** ...
- **Mô tả:** ...
- **Bằng chứng (code snippet hoặc kết quả test):** ...
- **Đề xuất xử lý:** ... (tham chiếu Giai đoạn 1/2/3/4 tương ứng)

(lặp lại cho từng vấn đề tìm thấy)

## Danh sách file cần sửa ở Giai đoạn 1
- [ ] file1.js — lý do
- [ ] file2.js — lý do
```

---

## 3. Quy tắc cho Agent
- **KHÔNG** tự ý sửa code trong giai đoạn này.
- **KHÔNG** đoán mò nếu không đọc được file — ghi rõ "KHÔNG RÕ, cần xem thêm file X".
- Nếu phát hiện vấn đề ngoài danh sách 12 mục trên, vẫn ghi vào báo cáo, đánh dấu mức độ rủi ro.
- Ưu tiên trích dẫn chính xác số dòng code khi báo cáo lỗi.
- Kết thúc giai đoạn bằng việc trình bày `AUDIT-REPORT.md` cho người dùng xác nhận trước khi chuyển sang Giai đoạn 1.
