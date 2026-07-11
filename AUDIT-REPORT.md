# BÁO CÁO AUDIT - GIAI ĐOẠN 0
**Dự án:** Chân Đi Và Nếm (CMS/Blog Du lịch - Ẩm thực - Di sản Việt Nam)
**Thời gian audit:** 05/07/2026

---

## Tóm Tắt Mức Độ Rủi Ro

| Mức độ | Số lượng vấn đề | Chi tiết vấn đề |
| :--- | :---: | :--- |
| **Nghiêm trọng (Critical)** | **2** | - Quyền sửa/xóa bài viết của CTV bị thiếu kiểm tra quyền sở hữu (ID 2)<br>- Thiếu kiểm tra và khử độc (Sanitize) mã HTML bài viết/bình luận (ID 9) |
| **Cao (High)** | **3** | - Lỗi Foreign Key Constraint khi xóa Post/Category/User (ID 3)<br>- CORS cấu hình mở hoàn toàn cho mọi Origin `*` (ID 10)<br>- Thiếu cơ chế giới hạn tần suất yêu cầu (Rate Limiting) tại trang đăng nhập (ID 12) |
| **Trung bình (Medium)** | **3** | - API `getAllPosts` tải toàn bộ dữ liệu, thiếu phân trang và bộ lọc chuyên sâu (ID 4)<br>- Khóa bảo mật JWT sử dụng mã cứng mặc định (`fallback_secret`) và thiếu Refresh Token (ID 6)<br>- Lỗi database Prisma không được định dạng thông báo thân thiện tới người dùng cuối (ID 11) |
| **Thấp (Low)** | **1** | - Tên file upload sinh ngẫu nhiên chưa tối ưu bảo mật (dùng date + random số thay vì crypto hash) (ID 8) |

---

## Chi Tiết Từng Vấn Đề

### 1. Lộ mật khẩu trong phản hồi đăng nhập/đăng ký (Register/Login)
* **Xác nhận:** **KHÔNG BỊ LỘ** (Hệ thống xử lý an toàn).
* **Chi tiết & Bằng chứng:**
  * Tại [authService.js](file:///d:/Duan/CHANDIVANEM/server/services/authService.js) (dòng 27-32), hàm `registerUser` chỉ trả về `id`, `fullName`, `email`, `role` của bản ghi mới tạo.
  * Hàm `loginUser` (dòng 56-65) trả về JWT `token` và thông tin `user` đã lược bỏ mật khẩu.
  * Tương tự, tại [userService.js](file:///d:/Duan/CHANDIVANEM/server/services/userService.js) (dòng 4-13), các hàm lấy danh sách người dùng `getUsers` và `getUserProfile` đều sử dụng `select` để lọc bỏ trường `passwordHash`.

### 2. Thiếu kiểm tra quyền sở hữu bài viết của Cộng tác viên (CTV) khi chỉnh sửa (Update/Delete)
* **Xác nhận:** **CÓ LỖ HỔNG NGHIÊM TRỌNG**. CTV này có thể sửa bài viết của CTV khác.
* **Chi tiết & Bằng chứng:**
  * Tại [postRoutes.js](file:///d:/Duan/CHANDIVANEM/server/routes/postRoutes.js) (dòng 21): `router.put('/:id', verifyCTV, updatePost);` chỉ kiểm tra token hợp lệ của CTV/Admin, không kiểm tra quyền sở hữu bài viết.
  * Tại [postController.js](file:///d:/Duan/CHANDIVANEM/server/controllers/postController.js) (dòng 38-43): Hàm `updatePost` nhận ID bài viết từ tham số và trực tiếp gọi `postService.updatePost` mà không đối chiếu tác giả bài viết với người dùng thực hiện yêu cầu (`req.user.id`).
  * Tại [postService.js](file:///d:/Duan/CHANDIVANEM/server/services/postService.js) (dòng 127-171): Hàm `updatePost` thực thi trực tiếp câu lệnh `prisma.post.update` mà không kiểm tra trường `authorId` của bài viết cũ.
* **Đề xuất xử lý:** Cập nhật hàm `updatePost` ở service để nhận thêm `currentUser` và thêm điều kiện kiểm tra `if (currentUser.role === 'CTV' && post.authorId !== currentUser.id)` (tham chiếu Giai đoạn 1 - Task 1.4).

### 3. Lỗi Foreign Key Constraint (Ràng buộc khóa ngoại) khi xóa dữ liệu
* **Xác nhận:** **CÓ LỖI CHẶN NGHIỆP VỤ**.
* **Chi tiết & Bằng chứng:**
  * Xem file cấu hình schema [schema.prisma](file:///d:/Duan/CHANDIVANEM/prisma/schema.prisma):
    * Mối quan hệ giữa bài viết (`Post`) với bình luận (`Comment`) (dòng 97) và đánh giá (`Rating`) (dòng 114) không cấu hình hành động xóa tự động `onDelete: Cascade`.
    * Mối quan hệ giữa danh mục (`Category`) với bài viết (`Post`) (dòng 80) không cấu hình ràng buộc ngăn chặn `onDelete: Restrict`.
  * Thực tế khi thực hiện xóa một bài viết đang có bình luận/đánh giá, hoặc xóa danh mục đang chứa bài viết, MySQL sẽ từ chối thao tác và trả về lỗi ràng buộc khóa ngoại (Foreign key constraint violation P2003).
  * Trong [categoryService.js](file:///d:/Duan/CHANDIVANEM/server/services/categoryService.js) (dòng 34-38), hàm `deleteCategory` gọi trực tiếp `prisma.category.delete` mà không kiểm tra bài viết con thuộc danh mục đó.
* **Đề xuất xử lý:**
  * Sửa đổi `schema.prisma` thiết lập `onDelete: Cascade` cho `Comment` và `Rating` khi bài viết/người dùng bị xóa.
  * Viết thêm logic kiểm tra `prisma.post.count` trước khi xóa Danh mục/Người dùng tại service (tham chiếu Giai đoạn 1 - Task 1.1 & 1.2).

### 4. API `getAllPosts` thiếu cơ chế phân trang (Pagination) và bộ lọc nâng cao
* **Xác nhận:** **CÓ VẤN ĐỀ**.
* **Chi tiết & Bằng chứng:**
  * Tại [postService.js](file:///d:/Duan/CHANDIVANEM/server/services/postService.js) (dòng 8-25), hàm `getAllPosts` thực hiện truy vấn `prisma.post.findMany()` toàn bộ bài viết trong database mà không có bất kỳ bộ lọc phân trang `skip` / `take` hay phân loại trạng thái.
  * Khi số lượng bài viết lên tới hàng nghìn bài, API này sẽ gây suy giảm nghiêm trọng hiệu năng hệ thống.
* **Đề xuất xử lý:** Tích hợp `skip` và `take` vào truy vấn cơ sở dữ liệu dựa trên query parameters `page` và `limit` (tham chiếu Giai đoạn 2 - Task 2.1).

### 5. Lỗi xử lý tìm kiếm khi chuỗi truy vấn `q` rỗng/undefined
* **Xác nhận:** **KHÔNG BỊ LỖI**. Hệ thống đã xử lý an toàn.
* **Chi tiết & Bằng chứng:**
  * Tại [postService.js](file:///d:/Duan/CHANDIVANEM/server/services/postService.js) (dòng 195-215), hàm `searchPosts` kiểm tra an toàn điều kiện: `if (!query || !query.trim()) { return []; }`.
  * Nếu chuỗi truy vấn rỗng hoặc bị thiếu, hệ thống sẽ lập tức trả về mảng rỗng thay vì thực thi truy vấn tìm kiếm SQL lỗi.

### 6. Khóa bảo mật JWT chứa mã cứng mặc định và thiếu Refresh Token
* **Xác nhận:** **CÓ RỦI RO BẢO MẬT TRUNG BÌNH**.
* **Chi tiết & Bằng chứng:**
  * Tại [authMiddleware.js](file:///d:/Duan/CHANDIVANEM/server/middleware/authMiddleware.js) (dòng 13): Hệ thống sử dụng giá trị mặc định là `'fallback_secret'` nếu môi trường không khai báo biến `JWT_SECRET`. Đây là rủi ro bị giải mã token hàng loạt nếu quản trị viên quên thiết lập file cấu hình `.env` trên production.
  * Hiện tại hệ thống chỉ kiểm tra token hết hạn ở hàm `jwt.verify` nhưng hoàn toàn chưa xây dựng cơ chế Refresh Token giúp độc giả không phải đăng nhập lại nhiều lần khi hết hạn token ngắn hạn.
* **Đề xuất xử lý:** Loại bỏ chuỗi mặc định `'fallback_secret'`, bắt buộc phải cấu hình `JWT_SECRET` và bổ sung kế hoạch Refresh Token ở giai đoạn tương lai.

### 7. Thiếu phân quyền tại các Router Admin
* **Xác nhận:** **KHÔNG**.
* **Chi tiết & Bằng chứng:**
  * Đã kiểm tra toàn bộ các tệp định tuyến `routes/*.js`, các tác vụ quản trị nâng cao của Admin đều được bọc bởi middleware `verifyAdmin` (ví dụ: `categoryRoutes.js`, `adRoutes.js`, `userRoutes.js`, `navigationRoutes.js`, `siteContentRoutes.js`).
  * Tuy nhiên, quyền ghi đè chỉnh sửa của CTV trên bài viết của người khác (ID 2) vẫn bị hổng do cấu hình middleware `verifyCTV` chưa kiểm tra sâu xuống tầng dữ liệu.

### 8. Cấu hình Multer upload chưa tối ưu bảo mật tên file
* **Xác nhận:** **CÓ THỂ CẢI THIỆN (RỦI RO THẤP)**.
* **Chi tiết & Bằng chứng:**
  * Tại [uploadRoutes.js](file:///d:/Duan/CHANDIVANEM/server/routes/uploadRoutes.js) (dòng 19-22): Multer cấu hình đặt tên ảnh bằng cách nối chuỗi `Date.now() + '-' + Math.round(Math.random() * 1E9)` kèm đuôi file.
  * Cơ chế này mặc dù hạn chế trùng lặp tên, nhưng dễ đoán cấu trúc tên ảnh tiếp theo.
* **Đề xuất xử lý:** Áp dụng thư viện `crypto` để sinh chuỗi ngẫu nhiên dạng Hex dài bảo mật hơn (tham chiếu Giai đoạn 1 - Task 1.8).

### 9. Thiếu bộ lọc khử độc HTML (XSS Sanitizer) trước khi lưu cơ sở dữ liệu
* **Xác nhận:** **CÓ LỖ HỔNG NGHIÊM TRỌNG (XSS)**.
* **Chi tiết & Bằng chứng:**
  * Bài viết được CTV soạn thảo bằng trình soạn thảo Quill, truyền trực tiếp HTML lên server qua request body.
  * Tại [postService.js](file:///d:/Duan/CHANDIVANEM/server/services/postService.js) (dòng 72), bài viết mới được lưu trữ trực tiếp vào trường `content` mà không thông qua bất kỳ bộ lọc loại bỏ thẻ nguy hiểm (`<script>`, `<iframe>`, `onload`, v.v.).
  * Tương tự đối với bình luận tại [commentService.js](file:///d:/Duan/CHANDIVANEM/server/services/commentService.js) (dòng 34), nội dung bình luận lưu trực tiếp plain/HTML thô. Kẻ tấn công có thể chèn mã độc Javascript tự động chạy khi độc giả khác đọc bài viết hoặc bình luận.
* **Đề xuất xử lý:** Tích hợp thư viện `isomorphic-dompurify` để khử độc toàn bộ HTML bài viết và lọc bỏ thẻ HTML khỏi bình luận trước khi lưu xuống Database (tham chiếu Giai đoạn 1 - Task 1.9).

### 10. CORS cho phép kết nối tự do từ mọi nguồn bên ngoài (`*`)
* **Xác nhận:** **CÓ NGUY CƠ BẢO MẬT CAO**.
* **Chi tiết & Bằng chứng:**
  * Tại [app.js](file:///d:/Duan/CHANDIVANEM/server/app.js) (dòng 23): `app.use(cors());` được gọi không kèm tham số. Theo hành vi mặc định của thư viện `cors`, backend sẽ thiết lập header `Access-Control-Allow-Origin: *`, cho phép bất kỳ website lạ nào cũng có thể gửi yêu cầu HTTP lấy dữ liệu.
* **Đề xuất xử lý:** Thiết lập CORS Whitelist giới hạn chính xác địa chỉ Client của Frontend (`http://localhost:5173`) (tham chiếu Giai đoạn 1 - Task 1.7).

### 11. Trả về lỗi Database Prisma thô sơ tới Client
* **Xác nhận:** **CÓ NGUY CƠ BẢO MẬT TRUNG BÌNH & TRẢI NGHIỆM KÉM**.
* **Chi tiết & Bằng chứng:**
  * Bộ quản lý lỗi tập trung [errorMiddleware.js](file:///d:/Duan/CHANDIVANEM/server/middleware/errorMiddleware.js) hiện tại chỉ lọc thuộc tính `err.isOperational`.
  * Các lỗi phát sinh từ tầng ORM database (như lỗi trùng lặp dữ liệu `P2002`, lỗi khóa ngoại `P2003`) không thuộc nhóm `isOperational` nên trên Production sẽ bị quy thành mã lỗi `500` kèm thông báo chung chung `"Có lỗi xảy ra từ máy chủ!"`. Điều này khiến người dùng không biết mình đã điền trùng email hay vi phạm dữ liệu gì để sửa đổi.
* **Đề xuất xử lý:** Rà soát mã lỗi Prisma (`P2002`, `P2003`, `P2025`) để sinh ra thông điệp trả về thân thiện bằng tiếng Việt tương ứng (tham chiếu Giai đoạn 1 - Task 1.10).

### 12. Thiếu cơ chế giới hạn tần suất yêu cầu (Rate Limiting) tại trang đăng nhập
* **Xác nhận:** **CÓ NGUY CƠ TẤN CÔNG BRUTE FORCE (CAO)**.
* **Chi tiết & Bằng chứng:**
  * File cấu hình server [app.js](file:///d:/Duan/CHANDIVANEM/server/app.js) và tệp định tuyến [authRoutes.js](file:///d:/Duan/CHANDIVANEM/server/routes/authRoutes.js) hoàn toàn không có bất kỳ bộ giới hạn tần suất truy cập nào.
  * Kẻ tấn công có thể liên tục gửi hàng triệu yêu cầu đăng nhập đoán mật khẩu của Admin mà không bị máy chủ chặn lại.
* **Đề xuất xử lý:** Cài đặt `express-rate-limit` giới hạn tối đa 10 lần thử đăng nhập sai trong vòng 15 phút (tham chiếu Giai đoạn 1 - Task 1.6).

---

## Danh Sách File Cần Sửa Đổi ở Giai Đoạn 1

Dựa trên kết quả audit, các tệp tin sau đây bắt buộc phải được xử lý bảo mật ở Giai đoạn 1:

- [ ] [prisma/schema.prisma](file:///d:/Duan/CHANDIVANEM/prisma/schema.prisma) — Sửa đổi `onDelete: Cascade` cho `Comment` và `Rating`.
- [ ] [server/services/categoryService.js](file:///d:/Duan/CHANDIVANEM/server/services/categoryService.js) — Thêm kiểm tra trước khi xóa danh mục.
- [ ] [server/services/userService.js](file:///d:/Duan/CHANDIVANEM/server/services/userService.js) — Thêm kiểm tra trước khi xóa tài khoản.
- [ ] [server/services/postService.js](file:///d:/Duan/CHANDIVANEM/server/services/postService.js) — Kiểm tra quyền sở hữu bài viết cho CTV khi chỉnh sửa; sanitize HTML bài viết.
- [ ] [server/services/commentService.js](file:///d:/Duan/CHANDIVANEM/server/services/commentService.js) — Khử độc thẻ HTML trong bình luận.
- [ ] [server/controllers/postController.js](file:///d:/Duan/CHANDIVANEM/server/controllers/postController.js) — Truyền thông tin người dùng vào tầng dịch vụ.
- [ ] [server/middleware/authMiddleware.js](file:///d:/Duan/CHANDIVANEM/server/middleware/authMiddleware.js) — Xóa mã cứng bảo mật fallback JWT.
- [ ] [server/routes/uploadRoutes.js](file:///d:/Duan/CHANDIVANEM/server/routes/uploadRoutes.js) — Áp dụng thuật toán sinh tên file ngẫu nhiên bằng `crypto`.
- [ ] [server/routes/authRoutes.js](file:///d:/Duan/CHANDIVANEM/server/routes/authRoutes.js) — Tích hợp bộ xác thực Zod đầu vào và Rate Limiting.
- [ ] [server/app.js](file:///d:/Duan/CHANDIVANEM/server/app.js) — Thêm cấu hình bảo mật `helmet`, CORS whitelist.
- [ ] [server/middleware/errorMiddleware.js](file:///d:/Duan/CHANDIVANEM/server/middleware/errorMiddleware.js) — Định dạng mã lỗi Prisma tiếng Việt.
