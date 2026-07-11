# CHANGELOG - GIAI ĐOẠN 1: VÁ BẢO MẬT & LỖI CHẶN NGHIỆP VỤ

Tệp này ghi nhận toàn bộ các chỉnh sửa bảo mật và tối ưu hóa hệ thống đã thực hiện trong Giai đoạn 1.

---

## Các Thay Đổi Chi Tiết

### 1. Database & ORM Layer
* **Sửa lỗi ràng buộc khóa ngoại (Foreign Key Constraint):**
  * Tệp đã sửa: [schema.prisma](file:///d:/Duan/CHANDIVANEM/prisma/schema.prisma)
  * Chi tiết:
    * Thiết lập `onDelete: Cascade` tại `Comment` và `Rating` liên kết tới `Post`/`User`. Khi xóa Bài viết hoặc tài khoản Người dùng, toàn bộ comment/rating tương ứng sẽ tự động được dọn dẹp sạch sẽ ở database.
    * Thiết lập `onDelete: Restrict` tại `Post` liên kết tới `Category` và `User` để tránh việc vô tình xóa danh mục/tác giả làm mất bài viết liên quan.

### 2. Business Logic & Validation Layer (Tầng Nghiệp Vụ)
* **Khử độc dữ liệu (HTML Sanitization):**
  * Sử dụng thư viện `isomorphic-dompurify`.
  * Tại [postService.js](file:///d:/Duan/CHANDIVANEM/server/services/postService.js): Lọc sạch mã HTML bài viết (`content`) trong cả hai tác vụ tạo mới và cập nhật, chỉ cho phép các thẻ định dạng văn bản và hình ảnh an toàn.
  * Tại [commentService.js](file:///d:/Duan/CHANDIVANEM/server/services/commentService.js): Loại bỏ hoàn toàn các thẻ HTML khỏi nội dung bình luận để ngăn chặn triệt để lỗ hổng Stored XSS.
* **Kiểm tra quyền sở hữu (Ownership Validation):**
  * Tại [postService.js](file:///d:/Duan/CHANDIVANEM/server/services/postService.js) & [postController.js](file:///d:/Duan/CHANDIVANEM/server/controllers/postController.js):
    * Bổ sung kiểm tra: Nếu người dùng thực hiện cập nhật/xóa bài viết là `CTV`, hệ thống sẽ đối chiếu `authorId` của bài viết cũ. Nếu không phải là tác giả của bài viết đó, hệ thống sẽ chặn và trả về lỗi `403 Forbidden`.
  * Tại [postRoutes.js](file:///d:/Duan/CHANDIVANEM/server/routes/postRoutes.js):
    * Chuyển route `DELETE /api/posts/:id` sang middleware `verifyCTV`. Cho phép CTV tự xóa bài viết của mình, trong khi Admin vẫn có quyền xóa bất kỳ bài viết nào.
* **Chặn xóa dữ liệu cha còn liên kết:**
  * Tại [categoryService.js](file:///d:/Duan/CHANDIVANEM/server/services/categoryService.js): Kiểm tra `prisma.post.count` trước khi xóa danh mục. Nếu còn bài viết, chặn lại và đưa ra cảnh báo lỗi `400`.
  * Tại [userService.js](file:///d:/Duan/CHANDIVANEM/server/services/userService.js): Kiểm tra `prisma.post.count` của tài khoản trước khi xóa. Tránh việc xóa tài khoản Tác giả đang sở hữu bài viết hoạt động.

### 3. Middleware & Cấu hình Bảo Mật
* **Xác thực dữ liệu đầu vào (Zod Validation):**
  * Đã cài đặt thư viện `zod`.
  * Tạo tệp validate chung: [validate.js](file:///d:/Duan/CHANDIVANEM/server/middleware/validate.js)
  * Khai báo các schema kiểm tra tính hợp lệ dữ liệu tại thư mục `server/validators/`:
    * [authValidator.js](file:///d:/Duan/CHANDIVANEM/server/validators/authValidator.js): kiểm tra đăng ký/đăng nhập.
    * [postValidator.js](file:///d:/Duan/CHANDIVANEM/server/validators/postValidator.js): kiểm tra bài viết.
    * [commentValidator.js](file:///d:/Duan/CHANDIVANEM/server/validators/commentValidator.js): kiểm tra bình luận.
    * [ratingValidator.js](file:///d:/Duan/CHANDIVANEM/server/validators/ratingValidator.js): kiểm tra điểm đánh giá 1-5 sao.
    * [categoryValidator.js](file:///d:/Duan/CHANDIVANEM/server/validators/categoryValidator.js): kiểm tra danh mục.
  * Tích hợp các bộ kiểm tra này vào các route tương ứng tại `server/routes/` trước khi dữ liệu đi vào Controller xử lý.
* **Giới hạn tần suất yêu cầu (Rate Limiting):**
  * Sử dụng thư viện `express-rate-limit`.
  * Thiết lập tại [rateLimiter.js](file:///d:/Duan/CHANDIVANEM/server/middleware/rateLimiter.js): Giới hạn tối đa 10 lần truy cập `/api/auth/login` từ một IP trong vòng 15 phút.
* **Bảo mật Header & CORS Whitelist:**
  * Sử dụng thư viện `helmet`.
  * Tại [app.js](file:///d:/Duan/CHANDIVANEM/server/app.js):
    * Bật `helmet` giúp chặn các lỗi cấu hình HTTP Header phổ biến.
    * Cấu hình CORS Whitelist: Chỉ cho phép các domain được khai báo trong `process.env.CLIENT_URL` (mặc định trong file `.env` là `http://localhost:5173`) truy cập vào API.
* **Gỡ bỏ Fallback Secret:**
  * Tại [authMiddleware.js](file:///d:/Duan/CHANDIVANEM/server/middleware/authMiddleware.js): Loại bỏ khóa dự phòng `'fallback_secret'`, bắt buộc server phải cấu hình `JWT_SECRET` trong file `.env`.
* **Bảo mật tên file tải lên (Multer):**
  * Tại [uploadRoutes.js](file:///d:/Duan/CHANDIVANEM/server/routes/uploadRoutes.js): Nâng cấp sử dụng `crypto.randomBytes(16).toString('hex')` để tạo tên tệp ngẫu nhiên bảo mật cao thay cho cách dùng ngày tháng dễ đoán.

### 4. Xử lý Lỗi Tập Trung
* **Định dạng lỗi Prisma ORM:**
  * Tại [errorMiddleware.js](file:///d:/Duan/CHANDIVANEM/server/middleware/errorMiddleware.js):
    * `P2002` (trùng dữ liệu unique): Trả về mã lỗi 409 kèm thông báo tiếng Việt `"Dữ liệu bị trùng lặp: Trường dữ liệu ... đã tồn tại"`.
    * `P2003` (lỗi khóa ngoại): Trả về mã lỗi 400 kèm thông báo tiếng Việt `"Thao tác không thành công do vi phạm ràng buộc dữ liệu liên quan"`.
    * `P2025` (bản ghi không tồn tại): Trả về mã lỗi 404 kèm thông báo tiếng Việt `"Không tìm thấy bản ghi dữ liệu yêu cầu"`.

---

## Hướng Dẫn Kích Hoạt (Dành Cho Người Dùng)

Do môi trường sandbox hạn chế quyền chạy trực tiếp các câu lệnh terminal trên máy của bạn, **bạn cần tự chạy các lệnh sau tại terminal của dự án** để cài đặt các thư viện mới và cập nhật database:

### Bước 1: Cài đặt các thư viện mới
Chạy lệnh sau tại thư mục gốc của dự án:
```bash
npm install zod express-rate-limit helmet isomorphic-dompurify
```

### Bước 2: Đồng bộ cấu trúc Database & Sinh Prisma Client mới
Chạy tuần tự các lệnh sau:
```bash
npx prisma generate
npx prisma migrate dev --name fix_ondelete_relations
```

### Bước 3: Khởi động lại hệ thống
```bash
npm run dev
```
